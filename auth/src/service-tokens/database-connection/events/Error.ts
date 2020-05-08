import { Context } from "aws-lambda/handler";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";

export const handleDatabaseConnectionError = async (error: Error, event: any, context: Context) => {
  await sendCloudFormationResponse(
    event.ResponseURL,
    JSON.stringify({
      Status: "FAILED",
      Reason: error.message || error.stack || `error processing event: ${JSON.stringify(event)}`,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      StackId: event.StackId,
      PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
    })
  );
};
