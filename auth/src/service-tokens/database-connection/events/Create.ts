import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient, getAuth0MangementClientId } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationStatus } from "../../../domain/CloudFormationStatus";
import { ManagementClient } from "auth0";

export const createDatabaseConnection = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingDatabaseConnection = await attemptToGetExistingDatabaseConnection(createEvent, managementClient);
  let databaseConnectionId: string;

  if (existingDatabaseConnection) {
    databaseConnectionId = existingDatabaseConnection.id;
  } else {
    databaseConnectionId = (await createAndReturnNewDatabaseConnection(createEvent, managementClient)).id;
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: databaseConnectionId,
      Data: {
        Name: createEvent.ResourceProperties.DatabaseConnectionName
      }
    })
  );
};

const attemptToGetExistingDatabaseConnection = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  managementClient: ManagementClient
) => {
  const existingConnections = await managementClient.getConnections();
  return existingConnections.find((connection) => connection.name === createEvent.ResourceProperties.DatabaseConnectionName);
};

const createAndReturnNewDatabaseConnection = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  managementClient: ManagementClient
) => {
  const managementClientId = await getAuth0MangementClientId();
  return await managementClient.createConnection({
    name: createEvent.ResourceProperties.DatabaseConnectionName,
    strategy: "auth0",
    enabled_clients: [managementClientId, createEvent.ResourceProperties.SpaClientId]
  });
};
