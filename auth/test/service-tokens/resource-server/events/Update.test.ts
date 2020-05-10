import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { mocked } from "ts-jest/utils";

import { getAuth0ManagementClient } from "../../../../src/utilities/Auth0Utility";
jest.mock("../../../../src/utilities/Auth0Utility");
const mockedGetAuth0ManagementClient = mocked(getAuth0ManagementClient);
const mockedManagementClient = {
  updateResourceServer: jest.fn()
};
mockedGetAuth0ManagementClient.mockImplementation((): any => mockedManagementClient);

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { updateResourceServer } from "../../../../src/service-tokens/resource-server/events/Update";

const UPDATE_EVENT: CloudFormationCustomResourceUpdateEvent = {
  PhysicalResourceId: "the physical resource id",
  ResponseURL: "the response url",
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  // @ts-ignore
  ResourceProperties: {
    Scopes: "the scopes",
    Identifier: "the identifier"
  }
};

test("updateResourceServer should update the resource server", async () => {
  await updateResourceServer(UPDATE_EVENT);

  expect(getAuth0ManagementClient).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.updateResourceServer).toHaveBeenCalledTimes(1);
  expect(mockedManagementClient.updateResourceServer).toHaveBeenCalledWith(
    { id: UPDATE_EVENT.PhysicalResourceId },
    { scopes: UPDATE_EVENT.ResourceProperties.Scopes }
  );
  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    UPDATE_EVENT.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: UPDATE_EVENT.RequestId,
      LogicalResourceId: UPDATE_EVENT.LogicalResourceId,
      StackId: UPDATE_EVENT.StackId,
      PhysicalResourceId: UPDATE_EVENT.PhysicalResourceId,
      Data: {
        Identifier: UPDATE_EVENT.ResourceProperties.Identifier
      }
    })
  );
});
