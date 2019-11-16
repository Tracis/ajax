import "whatwg-fetch";
import Path from "path";
import Url from "url";
import downloadFile from "./downloadfile";

export default function ajax(params) {
  const options = Object.assign(
    {
      method: "GET",
      body: {},
      dataType: "json",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "same-origin",
    },
    params,
  );
  const { body, method } = options;

  if (method === "GET") {
    const urlObject = Url.parse(options.url);
    urlObject.query = Object.assign({}, urlObject.query || {}, body);
    options.url = Url.format(urlObject);
    delete options.body;
  } else {
    options.body = JSON.stringify(body);
  }

  const {
    url,
    showAlert,
    alwaysShowErrorAlert,
    checkSuccess,
    pathPrefix,
    ...otherOptions
  } = options;

  let {
    dataType,
  } = options;

  return fetch(Path.join(pathPrefix || "", url), otherOptions)
    .then((response) => {
      if (!response.ok) {
        const error = new Error(response.statusText);
        // @ts-ignore
        error.response = response;
        throw error;
      }
      const contentDisposition = response.headers.get("Content-Disposition");
      if (dataType === "blob") {
        if (contentDisposition) {
          return downloadFile(response);
        } else {
          dataType = "json";
        }
      }
      return response[dataType]();
    })
    .then((result) => {
      if (dataType === "json" && typeof checkSuccess === "function") {
        checkSuccess(result);
      }
      return result;
    })
    .catch((error1) => {
      if (alwaysShowErrorAlert && showAlert) {
        showAlert({
          type: "error",
          message:
            typeof error1 === "string"
              ? error1
              : error1.message || "Unkonwn Error",
        });
      }
      throw error1;
    });
}
