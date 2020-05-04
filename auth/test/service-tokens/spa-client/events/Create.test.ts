import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { createSpaClient } from "../../../../src/service-tokens/spa-client/events/Create";

const CLIENT_NAME = "the client name";
const CLIENT_ID = "the client id";
const CREATE_EVENT: CloudFormationCustomResourceCreateEvent = {
  RequestId: "the request id",
  ResponseURL: "the response url",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    SpaClientName: CLIENT_NAME,
    Callbacks: [],
    AllowedLogoutUrls: [],
    WebOrigins: [],
    AllowedOrigins: []
  }
};

test("createSpaClient should create a new spa client", async () => {
  const mockedManagementClient = getMockedManagementClient([]);
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => mockedManagementClient);

  await createSpaClient(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 1);
  expect(mockedManagementClient.createClient).toHaveBeenCalledWith({
    name: CREATE_EVENT.ResourceProperties.SpaClientName,
    app_type: "spa",
    callbacks: CREATE_EVENT.ResourceProperties.Callbacks,
    allowed_logout_urls: CREATE_EVENT.ResourceProperties.AllowedLogoutUrls,
    web_origins: CREATE_EVENT.ResourceProperties.WebOrigins,
    allowed_origins: CREATE_EVENT.ResourceProperties.AllowedOrigins,
    oidc_conformant: true,
    grant_types: ["authorization_code", "implicit", "refresh_token"],
    token_endpoint_auth_method: "none",
    jwt_configuration: {
      alg: "RS256",
      lifetime_in_seconds: 36000
    }
  });
  assertCloudFormationUtilityExpectations(CREATE_EVENT, CLIENT_ID);
});

test("createSpaClient should_not create a new spa client if one already exists", async () => {
  const mockedManagementClient = getMockedManagementClient([{ name: CLIENT_NAME, client_id: CLIENT_ID }]);
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => mockedManagementClient);

  await createSpaClient(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 0);
  assertCloudFormationUtilityExpectations(CREATE_EVENT, CLIENT_ID);
});

const assertCommonManagementClientExpectations = (managementClient: any, numberOfExpectedCreateClientCalls: number) => {
  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(managementClient.getClients).toHaveBeenCalledTimes(1);
  expect(managementClient.getClients).toHaveBeenCalledWith({
    fields: ["client_id", "name"],
    include_fields: true,
    app_type: ["spa"]
  });
  expect(managementClient.createClient).toHaveBeenCalledTimes(numberOfExpectedCreateClientCalls);
};

const assertCloudFormationUtilityExpectations = (createEvent: CloudFormationCustomResourceCreateEvent, clientId: string) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: clientId
    })
  );
};

const getMockedManagementClient = (expectedClients: any) => {
  return {
    getClients: jest.fn().mockReturnValueOnce(expectedClients),
    createClient: jest.fn().mockReturnValueOnce({ client_id: CLIENT_ID })
  };
};
