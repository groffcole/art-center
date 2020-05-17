import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";

// @ts-ignore
export const createClientGrant = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const clientGrants = await managementClient.getClientGrants();
  const foundClientGrant = clientGrants.find(
    (clientGrant) =>
      clientGrant.client_id === createEvent.ResourceProperties.ClientId && clientGrant.audience === createEvent.ResourceProperties.Audience
  );

  let clientGrantId: string;

  if (foundClientGrant) {
    clientGrantId = foundClientGrant.id;
  } else {
    const clientGrant = await managementClient.createClientGrant({
      client_id: createEvent.ResourceProperties.ClientId,
      audience: createEvent.ResourceProperties.Audience,
      scope: []
    });
    clientGrantId = clientGrant.id;
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: clientGrantId
    })
  );
};
