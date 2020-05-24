import axios from "axios";
import { Context } from "aws-lambda/handler";
import { request } from "http";
import { CloudFormationStatuses } from "../domain/CloudFormationStatuses";

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

export type CloudFormationResponse = {
  Status: string;
  RequestId: string;
  LogicalResourceId: string;
  StackId: string;
  PhysicalResourceId: string;
  Data?: { [key: string]: string };
};

const createResponseBody = (resourceId, requestId, logicalResourceId, stackId, responseData?) => {
  const responseBody: CloudFormationResponse = {
    Status: CloudFormationStatuses.SUCCESS,
    RequestId: requestId,
    LogicalResourceId: logicalResourceId,
    StackId: stackId,
    PhysicalResourceId: resourceId
  };

  if (responseData) {
    responseBody.Data = responseData;
  }

  return JSON.stringify(responseBody);
};

export const sendCloudFormationResponse2 = async (event, resourceId, responseData?): Promise<void> => {
  const responseBody = createResponseBody(resourceId, event.RequestId, event.LogicalResourceId, event.StackId, responseData);

  try {
    await axios.put(event.ResponseURL, responseBody, {
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
      Status: CloudFormationStatuses.FAILED,
      Reason: error.message || error.stack || `error processing event: ${JSON.stringify(event)}`,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      StackId: event.StackId,
      PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
    })
  );
};
