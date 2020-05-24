import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createUserRole } from "./events/Create";
import { deleteUserRole } from "./events/Delete";
import { updateUserRole } from "./events/Update";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createUserRole(event);
        break;
      case CloudFormationEvents.UPDATE:
        await updateUserRole(event);
        break;
      case CloudFormationEvents.DELETE:
        await deleteUserRole(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
