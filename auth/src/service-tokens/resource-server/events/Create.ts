import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationStatuses } from "../../../domain/CloudFormationStatuses";
import { ManagementClient } from "auth0";

export const createResourceServer = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingResourceServer = await attemptToGetExistingResourceServer(createEvent, managementClient);
  let resourceServerId: string;

  if (existingResourceServer) {
    resourceServerId = existingResourceServer.id;
  } else {
    resourceServerId = (await createAndReturnNewResourceServer(createEvent, managementClient)).id;
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatuses.SUCCESS,
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: resourceServerId,
      Data: {
        Identifier: createEvent.ResourceProperties.Identifier
      }
    })
  );
};

const attemptToGetExistingResourceServer = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  managementClient: ManagementClient
) => {
  return (await managementClient.getResourceServers()).find(
    (resourceServer) => resourceServer.name === createEvent.ResourceProperties.ResourceServerName
  );
};

const createAndReturnNewResourceServer = async (
  createEvent: CloudFormationCustomResourceCreateEvent,
  managementClient: ManagementClient
) => {
  return await managementClient.createResourceServer({
    name: createEvent.ResourceProperties.ResourceServerName,
    identifier: createEvent.ResourceProperties.Identifier,
    signing_alg: "RS256",
    scopes: createEvent.ResourceProperties.Scopes,
    allow_offline_access: false,
    skip_consent_for_verifiable_first_party_clients: false,
    token_lifetime: 86400,
    token_lifetime_for_web: 7200,
    enforce_policies: true,
    token_dialect: "access_token"
  });
};
