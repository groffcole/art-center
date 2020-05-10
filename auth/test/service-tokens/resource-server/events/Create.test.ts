import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatus } from "../../../../src/domain/CloudFormationStatus";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { createResourceServer } from "../../../../src/service-tokens/resource-server/events/Create";

const RESOURCE_SERVER_NAME = "the resource server name";
const RESOURCE_SERVER_ID = "the resource server id";
const CREATE_EVENT: CloudFormationCustomResourceCreateEvent = {
  ResponseURL: "the response url",
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    ResourceServerName: RESOURCE_SERVER_NAME,
    Identifier: "the identifier",
    Scope: "the scopes"
  }
};

test("createResourceServer should create a new resource server", async () => {
  const mockedManagementClient = getMockedManagementClient([], {
    id: RESOURCE_SERVER_ID
  });
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => mockedManagementClient);

  await createResourceServer(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 1);
  assertCommonCloudFormationUtilityExpectations();
  expect(mockedManagementClient.createResourceServer).toHaveBeenCalledWith({
    name: CREATE_EVENT.ResourceProperties.ResourceServerName,
    identifier: CREATE_EVENT.ResourceProperties.Identifier,
    signing_alg: "RS256",
    scopes: CREATE_EVENT.ResourceProperties.Scopes,
    allow_offline_access: false,
    skip_consent_for_verifiable_first_party_clients: false,
    token_lifetime: 86400,
    token_lifetime_for_web: 7200,
    enforce_policies: true,
    token_dialect: "access_token"
  });
});

test("createResourceServer should_not create a new resource server if one already exists", async () => {
  const mockedManagementClient = getMockedManagementClient([{ name: RESOURCE_SERVER_NAME, id: RESOURCE_SERVER_ID }], undefined);
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => mockedManagementClient);

  await createResourceServer(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 0);
  assertCommonCloudFormationUtilityExpectations();
});

const assertCommonManagementClientExpectations = (managementClient: any, numberOfExpectedCreateResourceServerCalls: number) => {
  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(managementClient.getResourceServers).toHaveBeenCalledTimes(1);
  expect(managementClient.getResourceServers).toHaveBeenCalledWith();
  expect(managementClient.createResourceServer).toHaveBeenCalledTimes(numberOfExpectedCreateResourceServerCalls);
};

const assertCommonCloudFormationUtilityExpectations = () => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    CREATE_EVENT.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: CREATE_EVENT.RequestId,
      LogicalResourceId: CREATE_EVENT.LogicalResourceId,
      StackId: CREATE_EVENT.StackId,
      PhysicalResourceId: RESOURCE_SERVER_ID,
      Data: {
        Identifier: CREATE_EVENT.ResourceProperties.Identifier
      }
    })
  );
};

const getMockedManagementClient = (expectedResourceServers: any, createdResourceServer: any) => {
  return {
    getResourceServers: jest.fn().mockReturnValueOnce(expectedResourceServers),
    createResourceServer: jest.fn().mockReturnValueOnce(createdResourceServer)
  };
};
