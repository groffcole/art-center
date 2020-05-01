import axios from "axios";
import { mocked } from "ts-jest/utils";

jest.mock("axios");
const mockedAxiosPut = mocked(axios.put, true);

import { sendCloudFormationResponse } from "../../src/utilities/CloudFormationUtility";

const RESPONSE_URL = "the response url";
const RESPONSE_BODY = "the response body";

test("sendCloudFormationResponse should send response", async () => {
  await sendCloudFormationResponse(RESPONSE_URL, RESPONSE_BODY);

  expect(mockedAxiosPut).toHaveBeenCalledTimes(1);
  expect(mockedAxiosPut).toHaveBeenCalledWith(RESPONSE_URL, RESPONSE_BODY, {
    headers: {
      "content-type": "",
      "content-length": RESPONSE_BODY.length
    }
  });
});

test("sendCloudFormationResponse should handle errors", async () => {
  const expectedError = new Error();
  console.error = jest.fn();

  mockedAxiosPut.mockImplementationOnce((): any => {
    throw expectedError;
  });

  try {
    await sendCloudFormationResponse(RESPONSE_URL, RESPONSE_BODY);
  } catch (error) {
    expect(error).toEqual(expectedError);
  }

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledWith(
    `CloudFormationClient.sendCloudFormationResponse axios error: ${JSON.stringify(expectedError)}`
  );
});
