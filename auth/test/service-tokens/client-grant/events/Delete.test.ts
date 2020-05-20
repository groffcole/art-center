import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda";
import { Stages } from "../../../../src/domain/Stages";
import { CloudFormationStatus } from "../../../../src/domain/CloudFormationStatus";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  deleteClientGrant: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { deleteClientGrant } from "../../../../src/service-tokens/client-grant/events/Delete";

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

test("deleteClientGrant should delete the client grant", async () => {
  await deleteClientGrant(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteClientGrant).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteClientGrant).toHaveBeenCalledWith({
    id: DELETE_EVENT.PhysicalResourceId
  });
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteClientGrant should_not delete the client grant for the production stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.PRODUCTION;

  await deleteClientGrant(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteClientGrant).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations(DELETE_EVENT);
});

test("deleteClientGrant should_not delete the client grant for the development stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.DEVELOPMENT;

  await deleteClientGrant(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteClientGrant).toHaveBeenCalledTimes(0);
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
