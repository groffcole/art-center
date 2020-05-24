import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { CloudFormationStatuses } from "../../../../src/domain/CloudFormationStatuses";

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { updateMachToMachClient } from "../../../../src/service-tokens/mach-to-mach-client/events/Update";

test("updateMachToMachClient should update the mach to mach client", async () => {
  // @ts-ignore
  const updateEvent: CloudFormationCustomResourceUpdateEvent = {
    PhysicalResourceId: "the physical resource id",
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id",
    ResponseURL: "the response url"
  };

  await updateMachToMachClient(updateEvent);

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
