import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient, getAuth0MangementClientId } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";

export const createDatabaseConnection = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingConnections = await managementClient.getConnections();
  const foundDatabaseConnection = existingConnections.find(
    (connection) => connection.name === createEvent.ResourceProperties.DatabaseConnectionName
  );
  let databaseConnectionId: string;

  if (foundDatabaseConnection) {
    databaseConnectionId = foundDatabaseConnection.id;
  } else {
    const managementClientId = await getAuth0MangementClientId();

    const createdDatabaseConnection = await managementClient.createConnection({
      name: createEvent.ResourceProperties.DatabaseConnectionName,
      strategy: "auth0",
      enabled_clients: [managementClientId, createEvent.ResourceProperties.SpaClientId]
    });

    databaseConnectionId = createdDatabaseConnection.id;

    await sendCloudFormationResponse(
      createEvent.ResponseURL,
      JSON.stringify({
        Status: "SUCCESS",
        RequestId: createEvent.RequestId,
        LogicalResourceId: createEvent.LogicalResourceId,
        StackId: createEvent.StackId,
        PhysicalResourceId: databaseConnectionId,
        Data: {
          Name: createEvent.ResourceProperties.DatabaseConnectionName
        }
      })
    );
  }
};
