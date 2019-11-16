"use strict";

exports.__esModule = true;
exports["default"] = void 0;

// https://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
var downloadFile = function downloadFile(response) {
  var filename = "";
  var headers = response.headers;
  var contentDisposition = headers.get("Content-Disposition");

  if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    var matches = filenameRegex.exec(contentDisposition);

    if (matches != null && matches[1]) {
      filename = new Buffer(matches[1], "ascii").toString("utf-8").replace(/['"]/g, "");
    }
  }

  response.blob && response.blob().then(function (blob) {
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing the URL has been freed."
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var URL = window.URL || window.webkitURL;
      var downloadUrl = URL.createObjectURL(blob);

      if (filename) {
        // use HTML5 a[download] attribute to specify filename
        var a = document.createElement("a"); // safari doesn't support this yet

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

      setTimeout(function () {
        URL.revokeObjectURL(downloadUrl);
      }, 100); // cleanup
    }
  });
  return response;
};

var _default = downloadFile;
exports["default"] = _default;