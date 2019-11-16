// https://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
const downloadFile = (response) => {
  let filename = "";
  const headers = response.headers;
  const contentDisposition = headers.get("Content-Disposition");

  if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
    let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      filename = new Buffer(matches[1], "ascii")
        .toString("utf-8")
        .replace(/['"]/g, "");
    }
  }

  response.blob &&
    response.blob().then((blob) => {
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
      } else {
        let URL = window.URL || window.webkitURL;
        let downloadUrl = URL.createObjectURL(blob);
        if (filename) {
          // use HTML5 a[download] attribute to specify filename
          let a = document.createElement("a");
          // safari doesn't support this yet
          if (typeof a.download === "undefined") {
            window.location = downloadUrl;
          } else {
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        } else {
          window.location = downloadUrl;
        }
        setTimeout(function() {
          URL.revokeObjectURL(downloadUrl);
        }, 100); // cleanup
      }
    });

  return response;
};

export default downloadFile;
