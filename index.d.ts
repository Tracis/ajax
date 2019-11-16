import { RequestInit } from 'node-fetch';


export interface BaseAjaxParams extends RequestInit {
  url: string;
  body?: any;
  credentials?: "same-origin" | "omit" | "include";
  toast?: any;
  showAlert?: any;
  alwaysShowErrorAlert?: boolean;
  checkSuccess?: any;
}

export interface AjaxParams extends BaseAjaxParams {
  // Allows any extra properties to be defined in an params.
  [key: string]: any;
}

declare let ajax: (params: AjaxParams) => any;

export default ajax;