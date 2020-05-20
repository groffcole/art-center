import { CloudFormationResponse } from "../../../src/utilities/CloudFormationUtility";

test("should do something", () => {
  const uhhhhhhh = undefined;

  const something: CloudFormationResponse = {
    Status: "the status",
    RequestId: "the request id",
    LogicalResourceId: "the logical resource id",
    StackId: "the stack id",
    PhysicalResourceId: "the resource id",
    Data: uhhhhhhh
  };

  console.log(something);

  expect(something.Data).toBeUndefined();
});
