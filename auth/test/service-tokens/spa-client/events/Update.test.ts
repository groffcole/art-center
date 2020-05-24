import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  updateClient: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { updateSpaClient } from "../../../../src/service-tokens/spa-client/events/Update";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";

test("updateSpaClient should update the spa client", async () => {
  const updateEvent: CloudFormationCustomResourceUpdateEvent = {
    PhysicalResourceId: "the physical resource id",
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id",
    ResponseURL: "the response url",
    // @ts-ignore
    ResourceProperties: {
      Callbacks: [],
      AllowedLogoutURLs: [],
      WebOrigins: [],
      AllowedOrigins: []
    }
  };

  await updateSpaClient(updateEvent);

  assertManagementClientExpectations(updateEvent);
  assertCloudFormationUtilityExpectations(updateEvent);
});

const assertManagementClientExpectations = (updateEvent: CloudFormationCustomResourceUpdateEvent) => {
  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.updateClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.updateClient).toHaveBeenCalledWith(
    {
      client_id: updateEvent.PhysicalResourceId
    },
    {
      callbacks: updateEvent.ResourceProperties.Callbacks,
      allowed_logout_urls: updateEvent.ResourceProperties.AllowedLogoutURLs,
      web_origins: updateEvent.ResourceProperties.WebOrigins,
      allowed_origins: updateEvent.ResourceProperties.AllowedOrigins
    }
  );
};

const assertCloudFormationUtilityExpectations = (updateEvent: CloudFormationCustomResourceUpdateEvent) => {
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    updateEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: updateEvent.RequestId,
      LogicalResourceId: updateEvent.LogicalResourceId,
      StackId: updateEvent.StackId,
      PhysicalResourceId: updateEvent.PhysicalResourceId
    })
  );
};
