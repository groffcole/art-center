import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";

export const updateDefaultAdminUser = async (updateEvent: CloudFormationCustomResourceUpdateEvent) => {
  await sendCloudFormationResponse(
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
