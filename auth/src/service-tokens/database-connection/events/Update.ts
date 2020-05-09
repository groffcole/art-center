import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationStatus } from "../../../domain/CloudFormationStatus";

export const updateDatabaseConnection = async (updateEvent: CloudFormationCustomResourceUpdateEvent) => {
  await sendCloudFormationResponse(
    updateEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: updateEvent.RequestId,
      LogicalResourceId: updateEvent.LogicalResourceId,
      StackId: updateEvent.StackId,
      PhysicalResourceId: updateEvent.PhysicalResourceId,
      Data: {
        Name: updateEvent.ResourceProperties.DatabaseConnectionName
      }
    })
  );
};
