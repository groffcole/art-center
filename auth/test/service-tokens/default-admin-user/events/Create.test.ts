import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);

const UUID = "the uuid value";
import { v4 as uuid } from "uuid";
jest.mock("uuid");
const mockedUuid = mocked(uuid);
mockedUuid.mockReturnValue(UUID);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { createDefaultAdminUser } from "../../../../src/service-tokens/default-admin-user/events/Create";

const USER_ID = "the user id";
const EMAIL_ADDRESS = "the email address";
const CONNECTION_NAME = "the connection name";
const ROLES = "the roles";
const CREATE_EVENT: CloudFormationCustomResourceCreateEvent = {
  ResponseURL: "the response url",
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    EmailAddress: EMAIL_ADDRESS,
    ConnectionName: CONNECTION_NAME,
    Roles: ROLES
  }
};

test("createDefaultAdminUser should create a new user role", async () => {
  const mockedManagementClient = getMockedManagementClient(USER_ID);
  mockManagementClientImplementations(mockedManagementClient);

  await createDefaultAdminUser(CREATE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.createUser).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.createUser).toHaveBeenCalledWith({
    email: EMAIL_ADDRESS,
    email_verified: false,
    verify_email: true,
    connection: CONNECTION_NAME,
    password: UUID
  });
  expect(mockedManagementClient.assignRolestoUser).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.assignRolestoUser).toHaveBeenCalledWith({ id: USER_ID }, { roles: ROLES });
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    CREATE_EVENT.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: CREATE_EVENT.RequestId,
      LogicalResourceId: CREATE_EVENT.LogicalResourceId,
      StackId: CREATE_EVENT.StackId,
      PhysicalResourceId: USER_ID
    })
  );
});

const getMockedManagementClient = (expectedUserId: any) => {
  return {
    createUser: jest.fn().mockReturnValueOnce({ user_id: expectedUserId }),
    assignRolestoUser: jest.fn()
  };
};

const mockManagementClientImplementations = (managementClient: any) => {
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => managementClient);
};
