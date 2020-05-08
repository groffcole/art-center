import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createSpaClient } from "./events/Create";
import { deleteSpaClient } from "./events/Delete";
import { updateSpaClient } from "./events/Update";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createSpaClient(event);
        break;
      case CloudFormationEvents.UPDATE:
        await updateSpaClient(event);
        break;
      case CloudFormationEvents.DELETE:
        await deleteSpaClient(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
