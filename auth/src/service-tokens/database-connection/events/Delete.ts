import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { Stages } from "../../../domain/Stages";
import { CloudFormationStatus } from "../../../domain/CloudFormationStatus";

export const deleteDatabaseConnection = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (databaseConnectionShouldBeDeleted(deleteEvent)) {
    await deleteTheDatabaseConnection(deleteEvent);
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

const databaseConnectionShouldBeDeleted = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  return deleteEvent.ResourceProperties.Stage !== Stages.DEVELOPMENT && deleteEvent.ResourceProperties.Stage !== Stages.PRODUCTION;
};

const deleteTheDatabaseConnection = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  const managementClient = await getAuth0ManagementClient();
  await managementClient.deleteConnection({
    id: deleteEvent.PhysicalResourceId
  });
};