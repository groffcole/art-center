import { CloudFormationCustomResourceDeleteEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";
import { Stages } from "../../../../src/domain/Stages";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  deleteResourceServer: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { deleteResourceServer } from "../../../../src/service-tokens/resource-server/events/Delete";

const DELETE_EVENT: CloudFormationCustomResourceDeleteEvent = {
  PhysicalResourceId: "the physical resource id",
  ResponseURL: "the response url",
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    Stage: "the stage"
  }
};

test("deleteResourceServer should delete the resource server", async () => {
  await deleteResourceServer(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteResourceServer).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteResourceServer).toHaveBeenCalledWith({
    id: DELETE_EVENT.PhysicalResourceId
  });
  assertCommonCloudFormationUtilityExpectations();
});

test("deleteResourceServer should_not delete the resource server for the development stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.PRODUCTION;

  await deleteResourceServer(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteResourceServer).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations();
});

test("deleteResourceServer should_not delete the resource server for the development stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.DEVELOPMENT;

  await deleteResourceServer(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteResourceServer).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations();
});

const assertCommonCloudFormationUtilityExpectations = () => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    DELETE_EVENT.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: DELETE_EVENT.RequestId,
      LogicalResourceId: DELETE_EVENT.LogicalResourceId,
      StackId: DELETE_EVENT.StackId,
      PhysicalResourceId: DELETE_EVENT.PhysicalResourceId
    })
  );
};
