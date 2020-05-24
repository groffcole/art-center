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
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";

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

test("deleteDatabaseConnection should delete the database connection", async () => {
  await deleteDatabaseConnection(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledWith({
    id: DELETE_EVENT.PhysicalResourceId
  });
  assertCommonCloudFormationUtilityExpectations();
});

test("deleteDatabaseConnection should_not delete the database connection for the production stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.PRODUCTION;

  await deleteDatabaseConnection(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledTimes(0);
  assertCommonCloudFormationUtilityExpectations();
});

test("deleteDatabaseConnection should_not delete the database connection for the development stage", async () => {
  DELETE_EVENT.ResourceProperties.Stage = Stages.DEVELOPMENT;

  await deleteDatabaseConnection(DELETE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(0);
  expect(mockedManagementClient.deleteConnection).toHaveBeenCalledTimes(0);
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
