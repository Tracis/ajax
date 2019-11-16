"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ajax;

require("whatwg-fetch");

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

var _downloadfile = _interopRequireDefault(require("./downloadfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ajax(params) {
  var options = Object.assign({
    method: "GET",
    body: {},
    dataType: "json",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json; charset=utf-8"
    },
    credentials: "same-origin"
  }, params);
  var body = options.body,
      method = options.method;

  if (method === "GET") {
    var urlObject = _url["default"].parse(options.url);

    urlObject.query = Object.assign({}, urlObject.query || {}, body);
    options.url = _url["default"].format(urlObject);
    delete options.body;
  } else {
    options.body = JSON.stringify(body);
  }

  var url = options.url,
      showAlert = options.showAlert,
      alwaysShowErrorAlert = options.alwaysShowErrorAlert,
      checkSuccess = options.checkSuccess,
      pathPrefix = options.pathPrefix,
      otherOptions = _objectWithoutPropertiesLoose(options, ["url", "showAlert", "alwaysShowErrorAlert", "checkSuccess", "pathPrefix"]);

  var dataType = options.dataType;
  return fetch(_path["default"].join(pathPrefix || "", url), otherOptions).then(function (response) {
    if (!response.ok) {
      var error = new Error(response.statusText); // @ts-ignore

      error.response = response;
      throw error;
    }

    var contentDisposition = response.headers.get("Content-Disposition");

    if (dataType === "blob") {
      if (contentDisposition) {
        return (0, _downloadfile["default"])(response);
      } else {
        dataType = "json";
      }
    }

    return response[dataType]();
  }).then(function (result) {
    if (dataType === "json" && typeof checkSuccess === "function") {
      checkSuccess(result);
    }

    return result;
  })["catch"](function (error1) {
    if (alwaysShowErrorAlert && showAlert) {
      showAlert({
        type: "error",
        message: typeof error1 === "string" ? error1 : error1.message || "Unkonwn Error"
      });
    }

    throw error1;
  });
}