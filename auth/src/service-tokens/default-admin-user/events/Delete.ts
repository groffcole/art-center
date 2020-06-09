import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { Stages } from "../../../domain/Stages";

export const deleteDefaultAdminUser = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (defaultAdminUserShouldBeDeleted(deleteEvent)) {
    deleteTheDefaultAdminUser(deleteEvent);
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

const defaultAdminUserShouldBeDeleted = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  return deleteEvent.ResourceProperties.Stage !== Stages.DEVELOPMENT && deleteEvent.ResourceProperties.Stage !== Stages.PRODUCTION;
};

const deleteTheDefaultAdminUser = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  const managementClient = await getAuth0ManagementClient();
  await managementClient.deleteUser({ id: deleteEvent.PhysicalResourceId });
};
