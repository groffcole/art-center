import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";

export const updateSpaClient = async (updateEvent: CloudFormationCustomResourceUpdateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  await managementClient.updateClient(
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

  await sendCloudFormationResponse(
    updateEvent.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: updateEvent.RequestId,
      LogicalResourceId: updateEvent.LogicalResourceId,
      StackId: updateEvent.StackId,
      PhysicalResourceId: updateEvent.PhysicalResourceId
    })
  );
};
