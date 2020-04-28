import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createSpaClient } from "./events/Create";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case "Create":
        await createSpaClient(event, context);
        break;
      // case "Update":
      //   await updateSPAClient(event, context);
      //   break;
      // case "Delete":
      //   await deleteSPAClient(event, context);
      //   break;
    }
  } catch (error) {
    // await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
    //   Status: "FAILED",
    //   Reason: error.message,
    //   RequestId: event.RequestId,
    //   LogicalResourceId: event.LogicalResourceId,
    //   StackId: event.StackId,
    //   PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
    // });
  }
};

// export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
//   try {
//     switch (event.RequestType) {
//       case "Create":
//         await createSPAClient(event, context);
//         break;
//       case "Update":
//         await updateSPAClient(event, context);
//         break;
//       case "Delete":
//         await deleteSPAClient(event, context);
//         break;
//     }
//   } catch (error) {
//     await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//       Status: "FAILED",
//       Reason: error.message,
//       RequestId: event.RequestId,
//       LogicalResourceId: event.LogicalResourceId,
//       StackId: event.StackId,
//       PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
//     });
//   }
// };

// const updateSPAClient = async (event, context) => {
//   const managementClient = await InfrastructureUtility.getAuth0ManagementClient();
//   await managementClient.updateClient(
//     {
//       client_id: event.PhysicalResourceId
//     },
//     {
//       callbacks: event.ResourceProperties.Callbacks,
//       allowed_logout_urls: event.ResourceProperties.AllowedLogoutURLs,
//       web_origins: event.ResourceProperties.WebOrigins,
//       allowed_origins: event.ResourceProperties.AllowedOrigins
//     }
//   );

//   await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//     Status: "SUCCESS",
//     RequestId: event.RequestId,
//     LogicalResourceId: event.LogicalResourceId,
//     StackId: event.StackId,
//     PhysicalResourceId: event.PhysicalResourceId
//   });
// };

// const deleteSPAClient = async (event, context) => {
//   if (event.ResourceProperties.Stage === "dev" || event.ResourceProperties.Stage === "prod") {
//   } else {
//     const managementClient = await InfrastructureUtility.getAuth0ManagementClient();
//     await managementClient.deleteClient({ client_id: event.PhysicalResourceId });
//   }

//   await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//     Status: "SUCCESS",
//     RequestId: event.RequestId,
//     LogicalResourceId: event.LogicalResourceId,
//     StackId: event.StackId,
//     PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
//   });
// };

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
