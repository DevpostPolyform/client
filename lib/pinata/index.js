import axios from "axios";
import NodeFormData from "form-data";
import { baseUrl, pinFileToIpfsEndpoint } from "./baseConfig";

export function uploadFile(pinataApiOptions, file, jwt) {
  return new Promise((resolve, reject) => {
    const data = new NodeFormData();
    data.append("file", file);

    const endpoint = `${baseUrl}${pinFileToIpfsEndpoint}`;

    if (pinataApiOptions) {
      if (pinataApiOptions.pinataMetadata) {
        data.append(
          "pinataMetadata",
          JSON.stringify(pinataApiOptions.pinataMetadata)
        );
      }
      if (pinataApiOptions.pinataOptions) {
        data.append(
          "pinataOptions",
          JSON.stringify(pinataApiOptions.pinataOptions)
        );
      }
    }

    axios
      .post(endpoint, data, {
        withCredentials: true,
        maxContentLength: "Infinity",
        maxBodyLength: "Infinity",
        headers: {
          "Content-type": `multipart/form-data; boundary= ${data._boundary}`,
          authorization: `Bearer ${jwt}`,
        },
      })
      .then((result) => {
        if (result.status !== 200) {
          reject(
            new Error(
              `Unknown server response while pinning File to IPFS: ${result}`
            )
          );
        }
        resolve(result.data);
      })
      .catch((error) => reject(error));
  });
}
