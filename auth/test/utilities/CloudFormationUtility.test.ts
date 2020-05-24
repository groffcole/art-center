import axios from "axios";
import { mocked } from "ts-jest/utils";
import { CloudFormationStatuses } from "../../src/domain/CloudFormationStatuses";

jest.mock("axios");
const mockedAxiosPut = mocked(axios.put, true);

import { sendCloudFormationResponse, sendFailedResponse } from "../../src/utilities/CloudFormationUtility";

const RESPONSE_URL = "the response url";
const RESPONSE_BODY = "the response body";

test("sendCloudFormationResponse should send response", async () => {
  await sendCloudFormationResponse(RESPONSE_URL, RESPONSE_BODY);

  expect(mockedAxiosPut).toHaveBeenCalledTimes(1);
  expect(mockedAxiosPut).toHaveBeenCalledWith(RESPONSE_URL, RESPONSE_BODY, {
    headers: {
      "content-type": "",
      "content-length": RESPONSE_BODY.length
    }
  });
});

test("sendCloudFormationResponse should handle errors", async () => {
  const expectedError = new Error();
  console.error = jest.fn();

  mockedAxiosPut.mockImplementationOnce((): any => {
    throw expectedError;
  });

  try {
    await sendCloudFormationResponse(RESPONSE_URL, RESPONSE_BODY);
  } catch (error) {
    expect(error).toEqual(expectedError);
  }

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledWith(
    `CloudFormationClient.sendCloudFormationResponse axios error: ${JSON.stringify(expectedError)}`
  );
});

test("sendFailedResponse should send failed response to cloudformation with physical resource id", async () => {
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
  const responseBody = JSON.stringify({
    Status: CloudFormationStatuses.FAILED,
    Reason: error.message || error.stack || `error processing event: ${JSON.stringify(event)}`,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    PhysicalResourceId: event.PhysicalResourceId
  });

  await sendFailedResponse(error, event, context);

  expect(mockedAxiosPut).toHaveBeenCalledTimes(1);
  expect(mockedAxiosPut).toHaveBeenCalledWith(event.ResponseURL, responseBody, {
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  });
});

test("sendFailedResponse should send failed response to cloudformation with context log stream name", async () => {
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
  const responseBody = JSON.stringify({
    Status: CloudFormationStatuses.FAILED,
    Reason: error.message || error.stack || `error processing event: ${JSON.stringify(event)}`,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    PhysicalResourceId: context.logStreamName
  });

  await sendFailedResponse(error, event, context);

  expect(mockedAxiosPut).toHaveBeenCalledTimes(1);
  expect(mockedAxiosPut).toHaveBeenCalledWith(event.ResponseURL, responseBody, {
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  });
});

test("sendFailedResponse should send failed response to cloudformation with error.message", async () => {
  const expectedErrorMessage = "the error message";
  const error: Error = new Error(expectedErrorMessage);
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
  const responseBody = JSON.stringify({
    Status: CloudFormationStatuses.FAILED,
    Reason: expectedErrorMessage,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    PhysicalResourceId: context.logStreamName
  });

  await sendFailedResponse(error, event, context);

  expect(mockedAxiosPut).toHaveBeenCalledTimes(1);
  expect(mockedAxiosPut).toHaveBeenCalledWith(event.ResponseURL, responseBody, {
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  });
});

test("sendFailedResponse should send failed response to cloudformation with error.stack", async () => {
  const expectedErrorStack = "the expected error stack";
  const error: Error = new Error();
  error.stack = expectedErrorStack;

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
  const responseBody = JSON.stringify({
    Status: CloudFormationStatuses.FAILED,
    Reason: expectedErrorStack,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    PhysicalResourceId: context.logStreamName
  });

  await sendFailedResponse(error, event, context);

  expect(mockedAxiosPut).toHaveBeenCalledTimes(1);
  expect(mockedAxiosPut).toHaveBeenCalledWith(event.ResponseURL, responseBody, {
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  });
});
test("sendFailedResponse should send failed response to cloudformation with custom error message", async () => {
  const error: Error = new Error();
  error.stack = undefined;
  
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
  const expectedReason = `error processing event: ${JSON.stringify(event)}`
  const responseBody = JSON.stringify({
    Status: CloudFormationStatuses.FAILED,
    Reason: expectedReason,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    StackId: event.StackId,
    PhysicalResourceId: context.logStreamName
  });
  

  await sendFailedResponse(error, event, context);

  expect(mockedAxiosPut).toHaveBeenCalledTimes(1);
  expect(mockedAxiosPut).toHaveBeenCalledWith(event.ResponseURL, responseBody, {
    headers: {
      "content-type": "",
      "content-length": responseBody.length
    }
  });
});