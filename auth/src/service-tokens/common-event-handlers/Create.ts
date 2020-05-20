import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { sendCloudFormationResponse } from "../../utilities/CloudFormationUtility";
import { getAuth0ManagementClient } from "../../utilities/Auth0Utility";
import { CloudFormationStatus } from "../../domain/CloudFormationStatus";

export const handleResourceCreation = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  getExistingResource,
  createNewResource
) => {
  const managementClient = await getAuth0ManagementClient();
  const existingResource = await getExistingResource(createEvent, managementClient);
  let resourceId: string;

  // .id could be different, for example - client_id
  if (existingResource) {
    resourceId = existingResource.id;
  } else {
    resourceId = (await createNewResource(createEvent, managementClient)).id;
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: resourceId
    })
  );
};

// const attemptToGetExistingResource = async (createEvent: CloudFormationCustomResourceCreateEvent, managementClient: ManagementClient) => {
//   return (await managementClient.getClientGrants()).find(
//     (clientGrant) =>
//       clientGrant.client_id === createEvent.ResourceProperties.ClientId && clientGrant.audience === createEvent.ResourceProperties.Audience
//   );
// };

// const createTheResource = async (createEvent: CloudFormationCustomResourceCreateEvent, managementClient: ManagementClient) => {
//   return await managementClient.createClientGrant({
//     client_id: createEvent.ResourceProperties.ClientId,
//     audience: createEvent.ResourceProperties.Audience,
//     scope: []
//   });
// };
