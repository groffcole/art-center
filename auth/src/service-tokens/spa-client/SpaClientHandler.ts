import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createSpaClient } from "./events/Create";
import { deleteSpaClient } from "./events/Delete";
import { updateSpaClient } from "./events/Update";
import { handleSpaClientError } from "./events/Error";

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
