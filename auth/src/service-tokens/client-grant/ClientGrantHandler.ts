import { CloudFormationCustomResourceHandler } from "aws-lambda";
import "source-map-support/register";
import { createClientGrant } from "./events/Create";
import { deleteClientGrant } from "./events/Delete";
import { updateClientGrant } from "./events/Update";
import { CloudFormationEvents } from "../../domain/CloudFormationEvents";
import { sendFailedResponse } from "../../utilities/CloudFormationUtility";

export const handle: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    switch (event.RequestType) {
      case CloudFormationEvents.CREATE:
        await createClientGrant(event);
        break;
      case CloudFormationEvents.UPDATE:
        await updateClientGrant(event);
        break;
      case CloudFormationEvents.DELETE:
        await deleteClientGrant(event);
        break;
    }
  } catch (error) {
    await sendFailedResponse(error, event, context);
  }
};
