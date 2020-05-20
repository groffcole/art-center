import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda";
import { CloudFormationStatus } from "../../../../src/domain/CloudFormationStatus";
import { Stages } from "../../../../src/domain/Stages";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  deleteClient: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { deleteMachToMachClient } from "../../../../src/service-tokens/mach-to-mach-client/events/Delete";

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

test("deleteMachToMachClient should delete the mach to mach client", async () => {
  await deleteMachToMachClient(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteClient).toHaveBeenCalledWith({
    client_id: DELETE_EVENT.PhysicalResourceId
  });
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteMachToMachClient should_not delete the mach to mach client for production stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.PRODUCTION;

  await deleteMachToMachClient(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteClient).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteMachToMachClient should_not delete the mach to mach client for development stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.DEVELOPMENT;

  await deleteMachToMachClient(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteClient).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
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
