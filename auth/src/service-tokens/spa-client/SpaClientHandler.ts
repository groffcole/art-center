import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createSpaClient } from "./events/Create";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case "Create":
        await createSpaClient(event);
        break;
      case "Update":
        await updateSpaClient(event);
        break;
      case "Delete":
        await deleteSpaClient(event);
        break;
    }
  } catch (error) {
    await handleSpaClientError(error, event, context);
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

