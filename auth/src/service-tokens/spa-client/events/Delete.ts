import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { Stages } from "../../../utilities/domain/Stages";

export const deleteSpaClient = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  if (deleteEvent.ResourceProperties.Stage === "dev" || deleteEvent.ResourceProperties.Stage === "prod" || deleteEvent.ResourceProperties.Stage === Stages.PRODUCTION) {
  } else {
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
