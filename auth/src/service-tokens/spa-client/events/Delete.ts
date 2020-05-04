import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { Stages } from "../../../domain/Stages";

export const deleteSpaClient = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (spaClientShouldBeDeleted(deleteEvent)) {
    const managementClient = await getAuth0ManagementClient();
    await managementClient.deleteClient({ client_id: deleteEvent.PhysicalResourceId });
  }

  await sendCloudFormationResponse(
    deleteEvent.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: deleteEvent.RequestId,
      LogicalResourceId: deleteEvent.LogicalResourceId,
      StackId: deleteEvent.StackId,
      PhysicalResourceId: deleteEvent.PhysicalResourceId
    })
  );
};
function spaClientShouldBeDeleted(deleteEvent: CloudFormationCustomResourceDeleteEvent) {
  return deleteEvent.ResourceProperties.Stage !== Stages.DEVELOPMENT && deleteEvent.ResourceProperties.Stage !== Stages.PRODUCTION;
}
