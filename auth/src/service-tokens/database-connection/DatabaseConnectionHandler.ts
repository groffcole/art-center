import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { createDatabaseConnection } from "./events/Create";
import { updateDatabaseConnection } from "./events/Update";
import { deleteDatabaseConnection } from "./events/Delete";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createDatabaseConnection(event);
        break;
      case CloudFormationEvents.UPDATE:
        await updateDatabaseConnection(event);
        break;
      case CloudFormationEvents.DELETE:
        await deleteDatabaseConnection(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
