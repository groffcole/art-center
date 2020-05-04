import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";
import { getAuth0ManagementClient } from "../../../utilities/Auth0Utility";
import { sendCloudFormationResponse } from "../../../utilities/CloudFormationUtility";
import { ManagementClient } from "auth0";

export const createSpaClient = async (createEvent: CloudFormationCustomResourceCreateEvent) => {
  const managementClient = await getAuth0ManagementClient();
  const existingSpaClient = await attemptToGetExistingSpaClient(createEvent, managementClient);
  let clientId: string;

  if (existingSpaClient) {
    clientId = existingSpaClient.client_id;
  } else {
    clientId = (await createAndReturnNewSpaClient(createEvent, managementClient)).client_id;
  }

  await sendCloudFormationResponse(
    createEvent.ResponseURL,
    JSON.stringify({
      Status: "SUCCESS",
      RequestId: createEvent.RequestId,
      LogicalResourceId: createEvent.LogicalResourceId,
      StackId: createEvent.StackId,
      PhysicalResourceId: clientId
    })
  );
};

const attemptToGetExistingSpaClient = async (createEvent: CloudFormationCustomResourceCreateEvent, managementClient: ManagementClient) => {
  const spaClients = await managementClient.getClients({ fields: ["client_id", "name"], include_fields: true, app_type: ["spa"] });
  return spaClients.find((spaClient) => spaClient.name === createEvent.ResourceProperties.SpaClientName);
};

const createAndReturnNewSpaClient = async (createEvent: CloudFormationCustomResourceCreateEvent, managementClient: ManagementClient) => {
  return await managementClient.createClient({
    name: createEvent.ResourceProperties.SpaClientName,
    app_type: "spa",
    callbacks: createEvent.ResourceProperties.Callbacks,
    allowed_logout_urls: createEvent.ResourceProperties.AllowedLogoutUrls,
    web_origins: createEvent.ResourceProperties.WebOrigins,
    allowed_origins: createEvent.ResourceProperties.AllowedOrigins,
    oidc_conformant: true,
    grant_types: ["authorization_code", "implicit", "refresh_token"],
    token_endpoint_auth_method: "none",
    jwt_configuration: {
      alg: "RS256",
      lifetime_in_seconds: 36000
    }
  });
};
