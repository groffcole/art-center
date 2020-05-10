import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationStatus } from "../../../domain/CloudFormationStatus";

export const deleteResourceServer = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (deleteEvent.ResourceProperties.Stage === "dev" || deleteEvent.ResourceProperties.Stage === "prod") {
  } else {
    const managementClient = await getAuth0ManagementClient();
    await managementClient.deleteResourceServer({ id: deleteEvent.PhysicalResourceId });
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
