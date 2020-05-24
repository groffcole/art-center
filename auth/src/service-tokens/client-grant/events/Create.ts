import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { ManagementClient } from "auth0";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";

export const createClientGrant = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingClientGrant = await attemptToGetExistingClientGrant(createEvent, managementClient);
  let clientGrantId: string;

  if (existingClientGrant) {
    clientGrantId = existingClientGrant.id;
  } else {
    clientGrantId = (await createAndReturnClientGrant(createEvent, managementClient)).id;
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: clientGrantId
    })
  );
};

const attemptToGetExistingClientGrant = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  managementClient: ManagementClient
) => {
  return (await managementClient.getClientGrants()).find(
    (clientGrant) =>
      clientGrant.client_id === createEvent.ResourceProperties.ClientId && clientGrant.audience === createEvent.ResourceProperties.Audience
  );
};

const createAndReturnClientGrant = async (createEvent: CloudFormationCustomResourceCreateEvent, managementClient: ManagementClient) => {
  return await managementClient.createClientGrant({
    client_id: createEvent.ResourceProperties.ClientId,
    audience: createEvent.ResourceProperties.Audience,
    scope: []
  });
};
