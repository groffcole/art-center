import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatus } from "../../../../src/domain/CloudFormationStatus";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { createClientGrant } from "../../../../src/service-tokens/client-grant/events/Create";

const CLIENT_GRANT_ID = "the client grant id";
const CLIENT_ID = "the client id";
const AUDIENCE = "the audience";
const CREATE_EVENT: CloudFormationCustomResourceCreateEvent = {
  RequestId: "the request id",
  ResponseURL: "the response url",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    ClientId: CLIENT_ID,
    Audience: AUDIENCE
  }
};

test("createClientGrant should create a new client grant", async () => {
  const mockedManagementClient = getMockedManagementClient([]);
  mockManagementClientImplementations(mockedManagementClient);

  await createClientGrant(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 1);
  expect(mockedManagementClient.createClientGrant).toHaveBeenCalledWith({
    client_id: CREATE_EVENT.ResourceProperties.ClientId,
    audience: CREATE_EVENT.ResourceProperties.Audience,
    scope: []
  });
  assertCommonCloudFormationUtilityExpectations(CREATE_EVENT, CLIENT_GRANT_ID);
});

test("createClientGrant should_not create a new client grant if one already exists", async () => {
  const mockedManagementClient = getMockedManagementClient([{ id: CLIENT_GRANT_ID, client_id: CLIENT_ID, audience: AUDIENCE }]);
  mockManagementClientImplementations(mockedManagementClient);

  await createClientGrant(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 0);
  assertCommonCloudFormationUtilityExpectations(CREATE_EVENT, CLIENT_GRANT_ID);
});

const assertCommonManagementClientExpectations = (managementClient: any, numberOfExpectedCreateClientGrantCalls: number) => {
  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(managementClient.getClientGrants).toHaveBeenCalledTimes(1);
  expect(managementClient.getClientGrants).toHaveBeenCalledWith();
  expect(managementClient.createClientGrant).toHaveBeenCalledTimes(numberOfExpectedCreateClientGrantCalls);
};

const assertCommonCloudFormationUtilityExpectations = (createEvent: CloudFormationCustomResourceCreateEvent, clientGrantId: string) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: clientGrantId
    })
  );
};

const getMockedManagementClient = (expectedClientGrants: any) => {
  return {
    getClientGrants: jest.fn().mockReturnValueOnce(expectedClientGrants),
    createClientGrant: jest.fn().mockReturnValueOnce({ id: CLIENT_GRANT_ID })
  };
};

const mockManagementClientImplementations = (managementClient: any) => {
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => managementClient);
};
