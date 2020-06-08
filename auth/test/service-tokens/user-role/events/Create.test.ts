import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { createUserRole } from "../../../../src/service-tokens/user-role/events/Create";
import { Role } from "auth0";

const USER_ROLE_ID = "the user role id";
const USER_ROLE_NAME = "the user role name";
const PERMISSIONS = "the permissions";
const CREATE_EVENT: CloudFormationCustomResourceCreateEvent = {
  ResponseURL: "the response url",
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    UserRoleName: USER_ROLE_NAME,
    Permissions: PERMISSIONS
  }
};

test("createUserRole should create a new user role", async () => {
  const mockedManagementClient = getMockedManagementClient([], { id: USER_ROLE_ID });
  mockManagementClientImplementations(mockedManagementClient);

  await createUserRole(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 1, 1);
  expect(mockedManagementClient.createRole).toHaveBeenCalledWith({ name: USER_ROLE_NAME });
  expect(mockedManagementClient.addPermissionsInRole).toHaveBeenCalledWith(
    {
      id: USER_ROLE_ID
    },
    {
      permissions: PERMISSIONS
    }
  );
  assertCommonCloudFormationUtilityExpectations(CREATE_EVENT, USER_ROLE_ID);
});

test("createUserRole should_not create a new user role if one already exists", async () => {
  const mockedManagementClient = getMockedManagementClient([{ id: USER_ROLE_ID, name: USER_ROLE_NAME }], undefined);
  mockManagementClientImplementations(mockedManagementClient);

  await createUserRole(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 0, 0);
  assertCommonCloudFormationUtilityExpectations(CREATE_EVENT, USER_ROLE_ID);
});

const assertCommonManagementClientExpectations = (
  managementClient: any,
  numberOfExpectedCreateRoleCalls: number,
  numberOfExpectedAddPermissionsInRoleCalls: number
) => {
  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(managementClient.getRoles).toHaveBeenCalledTimes(1);
  expect(managementClient.getRoles).toHaveBeenCalledWith({ name_filter: USER_ROLE_NAME });
  expect(managementClient.createRole).toHaveBeenCalledTimes(numberOfExpectedCreateRoleCalls);
  expect(managementClient.addPermissionsInRole).toHaveBeenCalledTimes(numberOfExpectedAddPermissionsInRoleCalls);
};

const assertCommonCloudFormationUtilityExpectations = (createEvent: CloudFormationCustomResourceCreateEvent, userRoleId: string) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: userRoleId
    })
  );
};

const getMockedManagementClient = (expectedUserRoles: any, createdUserRole: Role) => {
  return {
    getRoles: jest.fn().mockReturnValueOnce(expectedUserRoles),
    createRole: jest.fn().mockReturnValueOnce(createdUserRole),
    addPermissionsInRole: jest.fn()
  };
};

const mockManagementClientImplementations = (managementClient: any) => {
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => managementClient);
};
