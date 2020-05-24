import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { Stages } from "../../../domain/Stages";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";

export const deleteMachToMachClient = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (machToMachClientShouldBeDeleted(deleteEvent)) {
    await deleteTheMachToMachClient(deleteEvent);
  }

  await sendCloudFormationResponse(
    deleteEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: deleteEvent.RequestId,
      LogicalResourceId: deleteEvent.LogicalResourceId,
      StackId: deleteEvent.StackId,
      PhysicalResourceId: deleteEvent.PhysicalResourceId
    })
  );
};

const machToMachClientShouldBeDeleted = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  return deleteEvent.ResourceProperties.Stage !== Stages.DEVELOPMENT && deleteEvent.ResourceProperties.Stage !== Stages.PRODUCTION;
};

const deleteTheMachToMachClient = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  const managementClient = await getAuth0ManagementClient();
  await managementClient.deleteClient({ client_id: deleteEvent.PhysicalResourceId });
};
