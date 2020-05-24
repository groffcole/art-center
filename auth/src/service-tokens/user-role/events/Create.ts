import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { ManagementClient } from "auth0";

export const createUserRole = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingUserRole = await attemptToGetExistingUserRole(createEvent, managementClient);
  let userRoleId: string;

  if (existingUserRole) {
    userRoleId = existingUserRole.id;
  } else {
    userRoleId = (await createAndReturnUserRole(createEvent, managementClient)).id;
    await addPermissionsInRole(createEvent, userRoleId, managementClient);
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: userRoleId
    })
  );
};

const attemptToGetExistingUserRole = async (createEvent: CloudFormationCustomResourceCreateEvent, managementClient: ManagementClient) => {
  return (await managementClient.getRoles({ name_filter: createEvent.ResourceProperties.UserRoleName })).find(
    (userRole) => userRole.name === createEvent.ResourceProperties.UserRoleName
  );
};

const createAndReturnUserRole = async (createEvent: CloudFormationCustomResourceCreateEvent, managementClient: ManagementClient) => {
  return await managementClient.createRole({ name: createEvent.ResourceProperties.UserRoleName });
};

const addPermissionsInRole = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  userRoleId: string,
  managementClient: ManagementClient
) => {
  await managementClient.addPermissionsInRole(
    {
      id: userRoleId
    },
    {
      permissions: createEvent.ResourceProperties.Permissions
    }
  );
};
