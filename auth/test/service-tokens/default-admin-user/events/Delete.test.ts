import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda";
import { Stages } from "../../../../src/domain/Stages";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  deleteUser: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { deleteDefaultAdminUser } from "../../../../src/service-tokens/default-admin-user/events/Delete";

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

test("deleteDefaultAdminUser should delete the default admin user", async () => {
  await deleteDefaultAdminUser(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteUser).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteUser).toHaveBeenCalledWith({
    id: DELETE_EVENT.PhysicalResourceId
  });
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteDefaultAdminUser should_not delete the default admin user the production stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.PRODUCTION;

  await deleteDefaultAdminUser(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteUser).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteDefaultAdminUser should_not delete the default admin user for the development stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.DEVELOPMENT;

  await deleteDefaultAdminUser(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteUser).toHaveBeenCalledTimes(0);
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
