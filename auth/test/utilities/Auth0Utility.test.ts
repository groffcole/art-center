import { ManagementClient } from "auth0";
import SSM from "aws-sdk/clients/ssm";

jest.mock("aws-sdk/clients/ssm");
const ssm = (SSM as unknown) as jest.Mock;
const mockGetParameter = jest.fn();
ssm.mockImplementation(() => ({ getParameter: mockGetParameter }));

jest.mock("auth0");
const managementClient = (ManagementClient as unknown) as jest.Mock;
const expectedManagementClient = jest.fn();
managementClient.mockImplementation(() => expectedManagementClient);

const EXPECTED_CLIENT_ID_PARAMETER_VALUE = "the client id parameter value";
const EXPECTED_CLIENT_SECRET_PARAMETER_VALUE = "the client secret parameter value";
const auth0ManagementClientIdParamName = "auth0 management client id param name";
const auth0ManagementClientSecretParamName = "auth0 management client secret param name";
process.env.AUTH0_MANAGEMENT_CLIENT_ID_PARAM_NAME = auth0ManagementClientIdParamName;
process.env.AUTH0_MANAGEMENT_CLIENT_SECRET_PARAM_NAME = auth0ManagementClientSecretParamName;

import { getAuth0MangementClientId, getAuth0ManagementClient } from "../../src/utilities/Auth0Utility";

test("getAuth0MangementClientId should return client id", async () => {
  mockGetParameter.mockReturnValueOnce({
    promise: () => ({
      Parameter: {
        Value: EXPECTED_CLIENT_ID_PARAMETER_VALUE
      }
    })
  });

  const actualClientId = await getAuth0MangementClientId();

  expect(mockGetParameter).toHaveBeenCalledTimes(1);
  expect(mockGetParameter).toHaveBeenCalledWith({
    Name: auth0ManagementClientIdParamName,
    WithDecryption: true
  });
  expect(actualClientId).toBe(EXPECTED_CLIENT_ID_PARAMETER_VALUE);
});

test("getAuth0ManagementClient should return management client", async () => {
  mockGetParameter
    .mockReturnValueOnce({
      promise: () => ({
        Parameter: {
          Value: EXPECTED_CLIENT_ID_PARAMETER_VALUE
        }
      })
    })
    .mockReturnValueOnce({
      promise: () => ({
        Parameter: {
          Value: EXPECTED_CLIENT_SECRET_PARAMETER_VALUE
        }
      })
    });

  const actualManagementClient = await getAuth0ManagementClient();

  expect(mockGetParameter).toHaveBeenCalledTimes(2);
  expect(mockGetParameter).toHaveBeenCalledWith({
    Name: auth0ManagementClientIdParamName,
    WithDecryption: true
  });
  expect(mockGetParameter).toHaveBeenCalledWith({
    Name: auth0ManagementClientSecretParamName,
    WithDecryption: true
  });
  expect(managementClient).toHaveBeenCalledWith({
    domain: "groffcole.auth0.com",
    clientId: EXPECTED_CLIENT_ID_PARAMETER_VALUE,
    clientSecret: EXPECTED_CLIENT_SECRET_PARAMETER_VALUE
  });
  expect(actualManagementClient).toEqual(expectedManagementClient);
});
