import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createDefaultAdminUser } from "./events/Create";
import { deleteDefaultAdminUser } from "./events/Delete";
import { updateDefaultAdminUser } from "./events/Update";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createDefaultAdminUser(event);
        break;
      case CloudFormationEvents.UPDATE:
        await updateDefaultAdminUser(event);
        break;
      case CloudFormationEvents.DELETE:
        await deleteDefaultAdminUser(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
