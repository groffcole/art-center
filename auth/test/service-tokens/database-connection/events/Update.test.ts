import { CloudFormationCustomResourceUpdateEvent } from "aws-lambda/trigger/cloudformation-custom-resource";

import { sendCloudFormationResponse } from "../../../../src/utilities/CloudFormationUtility";
jest.mock("../../../../src/utilities/CloudFormationUtility");

import { updateDatabaseConnection } from "../../../../src/service-tokens/database-connection/events/Update";
import { CloudFormationStatus } from "../../../../src/domain/CloudFormationStatus";

const UPDATE_EVENT: CloudFormationCustomResourceUpdateEvent = {
  ResponseURL: "the response url",
  RequestId: "the request id",
  LogicalResourceId: "the logical resource id",
  StackId: "the stack id",
  PhysicalResourceId: "the physical resource id",
  // @ts-ignore
  ResourceProperties: {
    DatabaseConnectionName: "the database connection name"
  }
};

test("updateDatabaseConnection should only send a cloudformation response", async () => {
  await updateDatabaseConnection(UPDATE_EVENT);

  expect(sendCloudFormationResponse).toHaveBeenCalledTimes(1);
  expect(sendCloudFormationResponse).toHaveBeenCalledWith(
    UPDATE_EVENT.ResponseURL,
    JSON.stringify({
      Status: CloudFormationStatus.SUCCESS,
      RequestId: UPDATE_EVENT.RequestId,
      LogicalResourceId: UPDATE_EVENT.LogicalResourceId,
      StackId: UPDATE_EVENT.StackId,
      PhysicalResourceId: UPDATE_EVENT.PhysicalResourceId,
      Data: {
        Name: UPDATE_EVENT.ResourceProperties.DatabaseConnectionName
      }
    })
  );
});
