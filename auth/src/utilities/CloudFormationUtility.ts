import axios from "axios";
import { Context } from "aws-lambda/handler";
import { CloudFormationStatus } from "../domain/CloudFormationStatus";

export const sendCloudFormationResponse = async (responseUrl: string, responseBody: string): Promise<void> => {
  try {
    await axios.put(responseUrl, responseBody, {
      headers: {
        "content-type": "",
        "content-length": responseBody.length
      }
    });
  } catch (error) {
    console.error(`CloudFormationClient.sendCloudFormationResponse axios error: ${JSON.stringify(error)}`);
    throw error;
  }
};

export const sendFailedResponse = async (error: Error, event: any, context: Context) => {
  await sendCloudFormationResponse(
    event.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.FAILED,
      Reason: error.message || error.stack || `error processing event: ${JSON.stringify(event)}`,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      StackId: event.StackId,
      PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
    })
  );
};
