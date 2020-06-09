import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";

export const deleteDefaultAdminUser = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (deleteEvent.ResourceProperties.Stage === "dev" || deleteEvent.ResourceProperties.Stage === "prod") {
  } else {
    const managementClient = await getAuth0ManagementClient();
    await managementClient.deleteUser({ id: deleteEvent.PhysicalResourceId });
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
