// @ts-ignore
export const deleteDefaultAdminUser = async (deleteEvent: CloudFormationCustomResourceDeleteEvent) => {};

// const deleteDefaultAdminUser = async (event) => {
//   if (event.ResourceProperties.Stage === "dev" || event.ResourceProperties.Stage === "prod") {
//   } else {
//     const managementClient = await InfrastructureUtility.getAuth0ManagementClient();
//     await managementClient.deleteUser({ id: event.PhysicalResourceId });
//   }

//   await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//     Status: "SUCCESS",
//     RequestId: event.RequestId,
//     LogicalResourceId: event.LogicalResourceId,
//     StackId: event.StackId,
//     PhysicalResourceId: event.PhysicalResourceId || context.logStreamName
//   });
// };
