import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { CloudFormationStatus } from "../../../domain/CloudFormationStatus";

// @ts-ignore
export const createResourceServer = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingResourceServers = await managementClient.getResourceServers();
  const existingResourceServer = existingResourceServers.find(
    (resourceServer) => resourceServer.name === createEvent.ResourceProperties.ResourceServerName
  );

  let resourceServerId: string;

  if (existingResourceServer) {
    resourceServerId = existingResourceServer.id;
  } else {
    const resourceServer = await managementClient.createResourceServer({
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
    resourceServerId = resourceServer.id;
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
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
