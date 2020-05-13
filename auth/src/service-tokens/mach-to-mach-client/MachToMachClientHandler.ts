import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createMachToMachClient } from "./events/Create";
import { deleteMachToMachClient } from "./events/Delete";
import { updateMachToMachClient } from "./events/Update";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createMachToMachClient(event);
        break;
      case CloudFormationEvents.UPDATE:
        await updateMachToMachClient(event);
        break;
      case CloudFormationEvents.DELETE:
        await deleteMachToMachClient(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
