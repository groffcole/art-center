import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda";
import { Stages } from "../../../../src/domain/Stages";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  deleteRole: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { deleteUserRole } from "../../../../src/service-tokens/user-role/events/Delete";

const DELETE_EVENT: CloudFormationCustomResourceDeleteEvent = {
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  ResponseURL: "the response url",
  PhysicalResourceId: "the physical resource id",
  //@ts-ignore
  ResourceProperties: {
    Stage: "the stage"
  }
};

test("deleteUserRole should delete the user role", async () => {
  await deleteUserRole(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteRole).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteRole).toHaveBeenCalledWith({
    id: DELETE_EVENT.PhysicalResourceId
  });
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteUserRole should_not delete the user role for the production stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.PRODUCTION;

  await deleteUserRole(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteRole).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteUserRole should_not delete the user role for the development stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.DEVELOPMENT;

  await deleteUserRole(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteRole).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

const assertCommonCloudFormationUtilityExpectations = (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    deleteEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: deleteEvent.RequestId,
      LogicalResourceId: deleteEvent.LogicalResourceId,
      StackId: deleteEvent.StackId,
      PhysicalResourceId: deleteEvent.PhysicalResourceId
    })
  );
};
