import { Context } from "aws-lambda/handler";
import { mocked } from "ts-jest/utils";

import { createSpaClient } from "../../../src/service-tokens/spa-client/events/Create";
import { updateSpaClient } from "../../../src/service-tokens/spa-client/events/Update";
import { deleteSpaClient } from "../../../src/service-tokens/spa-client/events/Delete";
import { handleSpaClientError } from "../../../src/service-tokens/spa-client/events/Error";
jest.mock("../../../src/service-tokens/spa-client/events/Create");
jest.mock("../../../src/service-tokens/spa-client/events/Update");
jest.mock("../../../src/service-tokens/spa-client/events/Delete");
jest.mock("../../../src/service-tokens/spa-client/events/Error");
const mockedCreateSpaClient = mocked(createSpaClient);

import { handle } from "../../../src/service-tokens/spa-client/SpaClientHandler";
import { CloudFormationEvents } from "../../../src/domain/CloudFormationEvents";

// @ts-ignore
const THE_CONTEXT: Context = jest.fn();

test("handle should handle create event", async () => {
  // @ts-ignore
  const createEvent: CloudFormationCustomResourceCreateEvent = {
    RequestType: CloudFormationEvents.CREATE
  };

  await handle(createEvent, THE_CONTEXT, undefined);

  assertEventHandlingExpectations(1, 0, 0, 0);
});

test("handle should handle update event", async () => {
  // @ts-ignore
  const updateEvent: CloudFormationCustomResourceUpdateEvent = {
    RequestType: CloudFormationEvents.UPDATE
  };

  await handle(updateEvent, THE_CONTEXT, undefined);

  assertEventHandlingExpectations(0, 1, 0, 0);
});

test("handle should handle delete event", async () => {
  // @ts-ignore
  const deleteEvent: CloudFormationCustomResourceDeleteEvent = {
    RequestType: CloudFormationEvents.DELETE
  };

  await handle(deleteEvent, THE_CONTEXT, undefined);

  assertEventHandlingExpectations(0, 0, 1, 0);
});

test("handle should handle errors", async () => {
  // @ts-ignore
  const createEvent: CloudFormationCustomResourceCreateEvent = {
    RequestType: CloudFormationEvents.CREATE
  };
  // @ts-ignore
  const context: Context = "the context";
  const error: Error = new Error();

  mockedCreateSpaClient.mockImplementationOnce(() => {
    throw error;
  });

  await handle(createEvent, context, undefined);

  assertEventHandlingExpectations(0, 0, 0, 1);
  expect(handleSpaClientError).toHaveBeenCalledWith(error, createEvent, context);
});

const assertEventHandlingExpectations = (createCalls: number, updateCalls: number, deleteCalls: number, handleErrorCalls: number) => {
  expect(createSpaClient).toHaveBeenCalledTimes(createCalls);
  expect(updateSpaClient).toHaveBeenCalledTimes(updateCalls);
  expect(deleteSpaClient).toHaveBeenCalledTimes(deleteCalls);
  expect(handleSpaClientError).toHaveBeenCalledTimes(handleErrorCalls);
};
