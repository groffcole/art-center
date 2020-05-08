import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { createDatabaseConnection } from "./events/Create";

export const handle: CloudFormationCustomResourceHandler = async (event) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createDatabaseConnection(event);
        break;
      case CloudFormationEvents.UPDATE:
        // await updateDatabaseConnection(event);
        break;
      case CloudFormationEvents.DELETE:
        // await deleteDatabaseConnection(event);
        break;
    }
  } catch (error) {
    // await handleDatabaseConnectionError(error, event, context);
  }
};

// const deleteDatabaseConnection = async (event, context) => {
//   try {
//     if (event.ResourceProperties.DatabaseConnectionStage === "dev" || event.ResourceProperties.DatabaseConnectionStage === "prod") {
//     } else {
//       const managementClient = await InfrastructureUtility.getAuth0ManagementClient();
//       await managementClient.deleteConnection({
//         id: event.PhysicalResourceId
//       });
//     }

//     await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//       Status: "SUCCESS",
//       RequestId: event.RequestId,
//       LogicalResourceId: event.LogicalResourceId,
//       StackId: event.StackId,
//       PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
//     });
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
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const updateDatabaseConnection = async (event, context) => {
//   try {
//     // in the update you'll want to be able to update the client ids
//     //
//     // if the OldResourceProperties.DatabaseConnectionName != ResourceProperties.DatabaseConnectionName
//     // fail the update
//     await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//       Status: "SUCCESS",
//       RequestId: event.RequestId,
//       LogicalResourceId: event.LogicalResourceId,
//       StackId: event.StackId,
//       PhysicalResourceId: event.PhysicalResourceId,
//       Data: {
//         Name: event.ResourceProperties.DatabaseConnectionName
//       }
//     });
//   } catch (error) {
//     await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//       Status: "FAILED",
//       Reason: error.Message,
//       RequestId: event.RequestId,
//       LogicalResourceId: event.LogicalResourceId,
//       StackId: event.StackId,
//       PhysicalResourceId: event.PhysicalResourceId
//     });
//   }
// };

// // options: {
// //   passwordPolicy: 'excellent',
// //   disable_signup: true,
// //   requires_username: false,
// //   brute_force_protection: true,
// //   strategy_version: 2,
// //   password_no_personal_info: {
// //     enable: false
// //   },
// //   password_dictionary: {
// //     enable: true,
// //     dictionary: []
// //   },
// //   password_history: {
// //     enable: true,
// //     size: 5
// //   },
// //   password_complexity_options: {
// //     min_length: 8
// //   }
// // }

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
