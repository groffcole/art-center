// @ts-ignore
export const updateDefaultAdminUser = async (updateEvent: CloudFormationCustomResourceUpdateEvent) => {}

// const updateDefaultAdminUser = async (event, context) => {
//   await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//     Status: "SUCCESS",
//     RequestId: event.RequestId,
//     LogicalResourceId: event.LogicalResourceId,
//     StackId: event.StackId,
//     PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
//   });
// };