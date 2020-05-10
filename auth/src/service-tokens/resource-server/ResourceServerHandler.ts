import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createResourceServer } from "./events/Create";
import { deleteResourceServer } from "./events/Delete";
import { updateResourceServer } from "./events/Update";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createResourceServer(event);
        break;
      case CloudFormationEvents.UPDATE:
        await updateResourceServer(event);
        break;
      case CloudFormationEvents.DELETE:
        await deleteResourceServer(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
