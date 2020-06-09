import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { v4 as uuid } from "uuid";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";

export const createDefaultAdminUser = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();

  const defaultAdminUser = await managementClient.createUser({
    email: createEvent.ResourceProperties.EmailAddress,
    email_verified: false,
    verify_email: true,
    connection: createEvent.ResourceProperties.ConnectionName,
    password: uuid()
  });

  await managementClient.assignRolestoUser({ id: defaultAdminUser.user_id }, { roles: createEvent.ResourceProperties.Roles });

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: defaultAdminUser.user_id
    })
  );
};
