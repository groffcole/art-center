import { ManagementClient } from "auth0";
import SSM from "aws-sdk/clients/ssm";

export const getAuth0MangementClientId = async (): Promise<string> => {
  const ssm = new SSM();
  return (
    await ssm
      .getParameter({
        Name: process.env.AUTH0_MANAGEMENT_CLIENT_ID_PARAM_NAME,
        WithDecryption: true
      })
      .promise()
  ).Parameter.Value;
};

export const getAuth0ManagementClient = async (): Promise<ManagementClient> => {
  const ssm = new SSM();
  const clientIdSSMResponse = await ssm
    .getParameter({
      Name: process.env.AUTH0_MANAGEMENT_CLIENT_ID_PARAM_NAME,
      WithDecryption: true
    })
    .promise();

  const clientSecretSSMResponse = await ssm
    .getParameter({
      Name: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET_PARAM_NAME,
      WithDecryption: true
    })
    .promise();

  return new ManagementClient({
    domain: "groffcole.auth0.com",
    clientId: clientIdSSMResponse.Parameter.Value,
    clientSecret: clientSecretSSMResponse.Parameter.Value
    // scope:
    //   "create:connections delete:connections read:connections update:connections create:clients delete:clients read:clients update:clients"
  });
};
