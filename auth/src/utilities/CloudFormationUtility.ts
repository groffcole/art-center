import axios from "axios";

export const sendCloudFormationResponse = async (responseUrl: string, responseBody: string): Promise<void> => {
  try {
    await axios.put(responseUrl, responseBody, {
      headers: {
        "content-type": "",
        "content-length": responseBody.length
      }
    });
  } catch (error) {
    console.error(`CloudFormationClient.sendCloudFormationResponse axios error: ${JSON.stringify(error)}`);
    throw error;
  }
};
