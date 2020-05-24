import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";
import { Stages } from "../../../domain/Stages";

export const deleteUserRole = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (userRoleShouldBeDeleted(deleteEvent)) {
    await deleteTheUserRole(deleteEvent);
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

const userRoleShouldBeDeleted = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  return deleteEvent.ResourceProperties.Stage !== Stages.DEVELOPMENT && deleteEvent.ResourceProperties.Stage !== Stages.PRODUCTION;
};

const deleteTheUserRole = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  const managementClient = await getAuth0ManagementClient();
  await managementClient.deleteRole({ id: deleteEvent.PhysicalResourceId });
};
