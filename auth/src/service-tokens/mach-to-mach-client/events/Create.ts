import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";

// @ts-ignore
export const createMachToMachClient = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const clients = await managementClient.getClients({ fields: ["client_id", "name"], include_fields: true, app_type: ["non_interactive"] });
  const foundClient = clients.find((element) => element.name === createEvent.ResourceProperties.MachToMachClientName);

  let clientId: string;

  if (foundClient) {
    clientId = foundClient.client_id;
  } else {
    const machineToMachineClient = await managementClient.createClient({
      name: createEvent.ResourceProperties.MachToMachClientName,
      app_type: "non_interactive",
      oidc_conformant: true,
      grant_types: ["client_credentials"]
    });
    clientId = machineToMachineClient.client_id;
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
