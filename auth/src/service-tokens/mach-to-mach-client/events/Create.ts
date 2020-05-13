import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { ManagementClient } from "auth0";

export const createMachToMachClient = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingMachToMachClient = await attemptToGetExistingMachToMachClient(createEvent, managementClient);

  let clientId: string;

  if (existingMachToMachClient) {
    clientId = existingMachToMachClient.client_id;
  } else {
    clientId = (await createAndReturnNewMachToMachClient(createEvent, managementClient)).client_id;
  }

  await sendCloudFormationResponse(
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

const attemptToGetExistingMachToMachClient = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  managementClient: ManagementClient
) => {
  return (await managementClient.getClients({ fields: ["client_id", "name"], include_fields: true, app_type: ["non_interactive"] })).find(
    (machToMachClient) => machToMachClient.name === createEvent.ResourceProperties.MachToMachClientName
  );
};

const createAndReturnNewMachToMachClient = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  managementClient: ManagementClient
) => {
  return await managementClient.createClient({
    name: createEvent.ResourceProperties.MachToMachClientName,
    app_type: "non_interactive",
    oidc_conformant: true,
    grant_types: ["client_credentials"]
  });
};
