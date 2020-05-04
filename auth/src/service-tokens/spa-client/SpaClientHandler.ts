import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createSpaClient } from "./events/Create";
import { deleteSpaClient } from "./events/Delete";
import { updateSpaClient } from "./events/Update";
import { handleSpaClientError } from "./events/Error";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";

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
    await handleSpaClientError(error, event, context);
  }
};
