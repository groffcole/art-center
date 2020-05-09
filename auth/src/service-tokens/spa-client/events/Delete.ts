import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { Stages } from "../../../domain/Stages";
import { CloudFormationStatus } from "../../../domain/CloudFormationStatus";

export const deleteSpaClient = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (spaClientShouldBeDeleted(deleteEvent)) {
    await deleteTheSpaClient(deleteEvent);
  }

  await sendCloudFormationResponse(
    deleteEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: deleteEvent.RequestId,
      LogicalResourceId: deleteEvent.LogicalResourceId,
      StackId: deleteEvent.StackId,
      PhysicalResourceId: deleteEvent.PhysicalResourceId
    })
  );
};

const spaClientShouldBeDeleted = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  return deleteEvent.ResourceProperties.Stage !== Stages.DEVELOPMENT && deleteEvent.ResourceProperties.Stage !== Stages.PRODUCTION;
};

const deleteTheSpaClient = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  const managementClient = await getAuth0ManagementClient();
  await managementClient.deleteClient({ client_id: deleteEvent.PhysicalResourceId });
};
