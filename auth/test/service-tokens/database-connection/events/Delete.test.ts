import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { mocked } from "ts-jest/utils";
import { Stages } from "../../../../src/domain/Stages";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  deleteConnection: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { deleteDatabaseConnection } from "../../../../src/service-tokens/database-connection/events/Delete";
import { CloudFormationStatus } from "../../../../src/domain/CloudFormationStatus";

test("deleteDatabaseConnection should delete the database connection", async () => {
  const deleteEvent = createDeleteEvent("the stage");

  await deleteDatabaseConnection(deleteEvent);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledWith({
    id: deleteEvent.PhysicalResourceId
  });
  assertCommonCloudFormationUtilityExpectations(deleteEvent);
});

test("deleteDatabaseConnection should_not delete the database connection for production stage", async () => {
  const deleteEvent = createDeleteEvent(Stages.PRODUCTION);

  await deleteDatabaseConnection(deleteEvent);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(deleteEvent);
});

test("deleteDatabaseConnection should_not delete the database connection for development stage", async () => {
  const deleteEvent = createDeleteEvent(Stages.DEVELOPMENT);

  await deleteDatabaseConnection(deleteEvent);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(deleteEvent);
});

const assertCommonCloudFormationUtilityExpectations = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    deleteEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: deleteEvent.RequestId,
      LogicalResourceId: deleteEvent.LogicalResourceId,
      StackId: deleteEvent.StackId,
      PhysicalResourceId: deleteEvent.PhysicalResourceId
    })
  );
};

const createDeleteEvent = (stage: string): CloudFormationCustomResourceDeleteEvent => {
  return {
    PhysicalResourceId: "the physical resource id",
    ResponseURL: "the response url",
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id",
    // @ts-ignore
    ResourceProperties: {
      Stage: stage
    }
  };
};
