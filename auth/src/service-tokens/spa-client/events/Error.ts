import { CloudFormationCustomResourceEventCommon } from "aws-lambda/trigger/cloudformation-custom-resource";
import { Context } from "aws-lambda/handler";

export const handleSpaClientError = async (error: Error, event: CloudFormationCustomResourceEventCommon, context: Context) => {};
