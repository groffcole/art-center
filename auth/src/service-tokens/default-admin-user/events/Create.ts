// @ts-ignore
export const createDefaultAdminUser = async (createEvent: CloudFormationCustomResourceCreateEvent) => {}

// const createDefaultAdminUser = async (event) => {
//   const managementClient = await InfrastructureUtility.getAuth0ManagementClient();

//   const user = await managementClient.createUser({
//     email: event.ResourceProperties.EmailAddress,
//     email_verified: false,
//     verify_email: true,
//     connection: event.ResourceProperties.ConnectionName,
//     password: uuidv4()
//   });
//   console.log(`user: ${JSON.stringify(user)}`);

//   // assign admin role
//   await managementClient.assignRolestoUser({ id: user.user_id }, { roles: event.ResourceProperties.Roles });

//   await InfrastructureUtility.sendCloudFormationResponse(event.ResponseURL, {
//     Status: "SUCCESS",
//     RequestId: event.RequestId,
//     LogicalResourceId: event.LogicalResourceId,
//     StackId: event.StackId,
//     PhysicalResourceId: user.user_id
//   });
// };