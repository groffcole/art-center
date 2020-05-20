import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";

export const updateClientGrant = async (updateEvent: CloudFormationCustomResourceUpdateEvent) => {
  await sendCloudFormationResponse(
    updateEvent.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: updateEvent.RequestId,
      LogicalResourceId: updateEvent.LogicalResourceId,
      StackId: updateEvent.StackId,
      PhysicalResourceId: updateEvent.PhysicalResourceId
    })
  );
};
