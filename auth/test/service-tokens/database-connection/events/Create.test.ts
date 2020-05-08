import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient, getAuth0MangementClientId } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedGetAuth0ManagementClientId = mocked(getAuth0MangementClientId);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { createDatabaseConnection } from "../../../../src/service-tokens/database-connection/events/Create";

const MANAGEMENT_CLIENT_ID = "the management client id";
const DATABASE_CONNECTION_ID = "the database connection id";
const DATABASE_CONNECTION_NAME = "the database connection name";
const CREATE_EVENT: CloudFormationCustomResourceCreateEvent = {
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    DatabaseConnectionName: DATABASE_CONNECTION_NAME,
    SpaClientId: "the spa client id"
  }
};

test("createDatabaseConnection should create a new spa client", async () => {
  const mockedManagementClient = getMockedManagementClient([], {
    id: DATABASE_CONNECTION_ID
  });
  mockManagementClientImplementations(mockedManagementClient);

  await createDatabaseConnection(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 1, 1);
  expect(mockedManagementClient.createConnection).toHaveBeenCalledWith({
    name: CREATE_EVENT.ResourceProperties.DatabaseConnectionName,
    strategy: "auth0",
    enabled_clients: [MANAGEMENT_CLIENT_ID, CREATE_EVENT.ResourceProperties.SpaClientId]
  });
  assertCommonCloudFormationUtilityExpectations();
});

test("createDatabaseConnection should_not create a new database connection if one already exists", async () => {
  const mockedManagementClient = getMockedManagementClient([{ name: DATABASE_CONNECTION_NAME, id: DATABASE_CONNECTION_ID }], undefined);
  mockManagementClientImplementations(mockedManagementClient);

  await createDatabaseConnection(CREATE_EVENT);

  assertCommonManagementClientExpectations(mockedManagementClient, 0, 0);
  assertCommonCloudFormationUtilityExpectations();
});

const assertCommonManagementClientExpectations = (
  managementClient: any,
  numberOfExpectedGetAuth0ManagementClientIdCalls: number,
  numberOfExpectedCreateConnectionCalls: number
) => {
  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(managementClient.getConnections).toHaveBeenCalledTimes(1);
  expect(managementClient.getConnections).toHaveBeenCalledWith();
  expect(getAuth0MangementClientId).toHaveBeenCalledTimes(numberOfExpectedGetAuth0ManagementClientIdCalls);
  expect(managementClient.createConnection).toHaveBeenCalledTimes(numberOfExpectedCreateConnectionCalls);
};

const assertCommonCloudFormationUtilityExpectations = () => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    CREATE_EVENT.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: CREATE_EVENT.RequestId,
      LogicalResourceId: CREATE_EVENT.LogicalResourceId,
      StackId: CREATE_EVENT.StackId,
      PhysicalResourceId: DATABASE_CONNECTION_ID,
      Data: {
        Name: CREATE_EVENT.ResourceProperties.DatabaseConnectionName
      }
    })
  );
};

const getMockedManagementClient = (expectedDatabaseConnections: any, createdDatabaseConnection: any) => {
  return {
    getConnections: jest.fn().mockReturnValueOnce(expectedDatabaseConnections),
    createConnection: jest.fn().mockReturnValueOnce(createdDatabaseConnection)
  };
};

const mockManagementClientImplementations = (managementClient: any) => {
  mockedGetAuth0ManagementClient.mockImplementationOnce((): any => managementClient);
  mockedGetAuth0ManagementClientId.mockImplementationOnce((): any => MANAGEMENT_CLIENT_ID);
};
