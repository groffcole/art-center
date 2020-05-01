import { CloudFormationCustomResourceCreateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";

export const createSpaClient = async (event: CloudFormationCustomResourceCreateEvent) => {};


// const createSPAClient = async (event, context) => {
//   const managementClient = await InfrastructureUtility.getAuth0ManagementClient();
//   const clients = await managementClient.getClients({ fields: ["client_id", "name"], include_fields: true, app_type: ["spa"] });
//   const foundClient = clients.find((element) => element.name === event.ResourceProperties.SPAClientName);

//   let clientId;

//   if (foundClient) {
//     clientId = foundClient.client_id;
//   } else {
//     const spaClient = await managementClient.createClient({
//       name: event.ResourceProperties.SPAClientName,
//       app_type: "spa",
//       callbacks: event.ResourceProperties.Callbacks,
//       allowed_logout_urls: event.ResourceProperties.AllowedLogoutURLs,
//       web_origins: event.ResourceProperties.WebOrigins,
//       allowed_origins: event.ResourceProperties.AllowedOrigins,
//       oidc_conformant: true,
//       grant_types: ["authorization_code", "implicit", "refresh_token"],
//       token_endpoint_auth_method: "none",
//       jwt_configuration: {
//         alg: "RS256",
//         lifetime_in_seconds: 36000
//       }
//     });
//     clientId = spaClient.client_id;
//   }

//   const createSpaClientResponseBody = {
//     Status: "SUCCESS",
//     RequestId: event.RequestId,
//     LogicalResourceId: event.LogicalResourceId,
//     StackId: event.StackId,
//     PhysicalResourceId: clientId
//   };

//   await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, createSpaClientResponseBody);
// };