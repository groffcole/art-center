import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { updateUserRole } from "../../../../src/service-tokens/user-role/events/Update";

test("updateUserRole should update the user role", async () => {
  // @ts-ignore
  const updateEvent: CloudFormationCustomResourceUpdateEvent = {
    PhysicalResourceId: "the physical resource id",
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id",
    ResponseURL: "the response url"
  };

  await updateUserRole(updateEvent);

  assertCloudFormationUtilityExpectations(updateEvent);
});

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
