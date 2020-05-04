import { Context } from "aws-lambda/handler";

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { handleSpaClientError } from "../../../../src/service-tokens/spa-client/events/Error";

test("handleSpaClientError should send failed response to cloudformation with physical resource id", async () => {
  const error: Error = new Error();
  // @ts-ignore
  const context: Context = "the context";
  const event = {
    ResponseURL: "the response url",
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id",
    PhysicalResourceId: "the physical resource id"
  };

  await handleSpaClientError(error, event, context);

  assertCloudFormationUtilityExpectations(error, event, event.PhysicalResourceId);
});

test("handleSpaClientError should send failed response to cloudformation with context log stream name", async () => {
  const error: Error = new Error();
  // @ts-ignore
  const context: Context = {
    logStreamName: "the log stream name"
  };
  const event = {
    ResponseURL: "the response url",
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id"
  };

  await handleSpaClientError(error, event, context);

  assertCloudFormationUtilityExpectations(error, event, context.logStreamName);
});

const assertCloudFormationUtilityExpectations = (error: Error, event: any, physicalResourceId: string) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    event.ResponseURL,
    JSON.stringify({
      Status: "FAILED",
      Reason: error.message || error.stack || `error processing event: ${JSON.stringify(event)}`,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      StackId: event.StackId,
      PhysicalResourceId: physicalResourceId
    })
  );
};
