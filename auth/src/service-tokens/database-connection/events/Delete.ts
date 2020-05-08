import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { Stages } from "../../../domain/Stages";

export const deleteDatabaseConnection = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (deleteEvent.ResourceProperties.Stage === Stages.DEVELOPMENT || deleteEvent.ResourceProperties.Stage === Stages.PRODUCTION) {
  } else {
    const managementClient = await getAuth0ManagementClient();
    await managementClient.deleteConnection({
      id: deleteEvent.PhysicalResourceId
    });
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
