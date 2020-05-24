import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";

export const updateResourceServer = async (updateEvent: CloudFormationCustomResourceUpdateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  await managementClient.updateResourceServer(
    {
      id: updateEvent.PhysicalResourceId
    },
    {
      scopes: updateEvent.ResourceProperties.Scopes
    }
  );

  await sendCloudFormationResponse(
    updateEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: updateEvent.RequestId,
      LogicalResourceId: updateEvent.LogicalResourceId,
      StackId: updateEvent.StackId,
      PhysicalResourceId: updateEvent.PhysicalResourceId,
      Data: {
        Identifier: updateEvent.ResourceProperties.Identifier
      }
    })
  );
};
