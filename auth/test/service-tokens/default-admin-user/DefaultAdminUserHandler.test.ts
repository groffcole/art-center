import { Context } from "aws-lambda/handler";
import { mocked } from "ts-jest/utils";
import { CloudFormationEvents } from "../../../src/domain/CloudFormationEvents";

import { createDefaultAdminUser } from "../../../src/service-tokens/default-admin-user/events/Create";
import { updateDefaultAdminUser } from "../../../src/service-tokens/default-admin-user/events/Update";
import { deleteDefaultAdminUser } from "../../../src/service-tokens/default-admin-user/events/Delete";
jest.mock("../../../src/service-tokens/default-admin-user/events/Create");
jest.mock("../../../src/service-tokens/default-admin-user/events/Update");
jest.mock("../../../src/service-tokens/default-admin-user/events/Delete");
const mockedCreateUserRole = mocked(createDefaultAdminUser);

import { sendFailedResponse } from "../../../src/utilities/CloudFormationUtility";
jest.mock("../../../src/utilities/CloudFormationUtility");

import { handle } from "../../../src/service-tokens/default-admin-user/DefaultAdminUserHandler";

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

  mockedCreateUserRole.mockImplementationOnce(() => {
    throw error;
  });

  await handle(createEvent, context, undefined);

  assertEventHandlingExpectations(1, 0, 0, 1);
  expect(sendFailedResponse).toHaveBeenCalledWith(error, createEvent, context);
});

const assertEventHandlingExpectations = (
  createCalls: number,
  updateCalls: number,
  deleteCalls: number,
  sendFailedResponseCalls: number
) => {
  expect(createDefaultAdminUser).toHaveBeenCalledTimes(createCalls);
  expect(updateDefaultAdminUser).toHaveBeenCalledTimes(updateCalls);
  expect(deleteDefaultAdminUser).toHaveBeenCalledTimes(deleteCalls);
  expect(sendFailedResponse).toHaveBeenCalledTimes(sendFailedResponseCalls);
};
