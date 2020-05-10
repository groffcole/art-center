import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
// import { createMach2MachClient } from "./events/Create";
// import { deleteMach2MachClient } from "./events/Delete";
// import { updateMach2MachClient } from "./events/Update";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        // await createMach2MachClient(event);
        break;
      case CloudFormationEvents.UPDATE:
        // await updateMach2MachClient(event);
        break;
      case CloudFormationEvents.DELETE:
        // await deleteMach2MachClient(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
