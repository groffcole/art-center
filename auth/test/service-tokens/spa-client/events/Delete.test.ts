import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const MANAGEMENT_CLIENT = {
  deleteClient: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => MANAGEMENT_CLIENT);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { deleteSpaClient } from "../../../../src/service-tokens/spa-client/events/Delete";
import { Stages } from "../../../../src/utilities/domain/Stages";

test("deleteSpaClient should delete the client", async () => {
  const deleteEvent: CloudFormationCustomResourceDeleteEvent = createDeleteEvent("the stage");

  await deleteSpaClient(deleteEvent);

  expect(MANAGEMENT_CLIENT.deleteClient).toHaveBeenCalledTimes(1);
  expect(MANAGEMENT_CLIENT.deleteClient).toHaveBeenCalledWith({
    client_id: deleteEvent.PhysicalResourceId
  });
  assertCloudFormationUtilityExpectations(deleteEvent);
});

test("deleteSpaClient should_not delete the client for production stage", async () => {
  const deleteEvent: CloudFormationCustomResourceDeleteEvent = createDeleteEvent(Stages.PRODUCTION);
  await deleteSpaClient(deleteEvent);

  expect(MANAGEMENT_CLIENT.deleteClient).toHaveBeenCalledTimes(0);
  assertCloudFormationUtilityExpectations(deleteEvent);
});

test("deleteSpaClient should_not delete the client for development stage", async () => {
  const deleteEvent: CloudFormationCustomResourceDeleteEvent = createDeleteEvent(Stages.DEVELOPMENT);

  await deleteSpaClient(deleteEvent);

  expect(MANAGEMENT_CLIENT.deleteClient).toHaveBeenCalledTimes(0);
  assertCloudFormationUtilityExpectations(deleteEvent);
});

const createDeleteEvent = (stage: string): CloudFormationCustomResourceDeleteEvent => {
  return {
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id",
    ResponseURL: "the response url",
    PhysicalResourceId: "the physical resource id",
    //@ts-ignore
    ResourceProperties: {
      Stage: stage
    }
  };
};

const assertCloudFormationUtilityExpectations = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
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
