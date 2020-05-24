import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { createMachToMachClient } from "../../../../src/service-tokens/mach-to-mach-client/events/Create";

const MACH_TO_MACH_CLIENT_NAME = "the mach to mach client name";
const MACH_TO_MACH_CLIENT_ID = "the mach to mach client id";
const CREATE_EVENT: CloudFormationCustomResourceCreateEvent = {
  ResponseURL: "the response url",
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    MachToMachClientName: MACH_TO_MACH_CLIENT_NAME
  }
};

test("createMachToMachClient should create a new mach to mach client", async () => {
  const mockedManagementClient = getMockedManagementClient([], {
    client_id: MACH_TO_MACH_CLIENT_ID
  });
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => mockedManagementClient);

  await createMachToMachClient(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 1);
  assertCommonCloudFormationUtilityExpectations();
  expect(mockedManagementClient.createClient).toHaveBeenCalledWith({
    name: CREATE_EVENT.ResourceProperties.MachToMachClientName,
    app_type: "non_interactive",
    oidc_conformant: true,
    grant_types: ["client_credentials"]
  });
});

test("createMachToMachClient should_not create a new mach to mach client if one already exists", async () => {
  const mockedManagementClient = getMockedManagementClient(
    [{ name: MACH_TO_MACH_CLIENT_NAME, client_id: MACH_TO_MACH_CLIENT_ID }],
    undefined
  );
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => mockedManagementClient);

  await createMachToMachClient(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 0);
  assertCommonCloudFormationUtilityExpectations();
});

const assertCommonManagementClientExpectations = (managementClient: any, numberOfExpectedCreateClientCalls: number) => {
  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(managementClient.getClients).toHaveBeenCalledTimes(1);
  expect(managementClient.getClients).toHaveBeenCalledWith({
    fields: ["client_id", "name"],
    include_fields: true,
    app_type: ["non_interactive"]
  });
  expect(managementClient.createClient).toHaveBeenCalledTimes(numberOfExpectedCreateClientCalls);
};

const assertCommonCloudFormationUtilityExpectations = () => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    CREATE_EVENT.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: CREATE_EVENT.RequestId,
      LogicalResourceId: CREATE_EVENT.LogicalResourceId,
      StackId: CREATE_EVENT.StackId,
      PhysicalResourceId: MACH_TO_MACH_CLIENT_ID
    })
  );
};

const getMockedManagementClient = (expectedMachToMachClients: any, createdMachToMachClient: any) => {
  return {
    getClients: jest.fn().mockReturnValueOnce(expectedMachToMachClients),
    createClient: jest.fn().mockReturnValueOnce(createdMachToMachClient)
  };
};
