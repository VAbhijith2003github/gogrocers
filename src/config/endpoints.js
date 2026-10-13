const trimSlash = (url) => (url ? url.replace(/\/+$/, "") : "");

const BASE_URL = trimSlash(
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  ""
);

export const USER_SERVICE = trimSlash(process.env.REACT_APP_USER_SERVICE_URL) || BASE_URL;
export const CART_SERVICE = trimSlash(process.env.REACT_APP_CART_SERVICE_URL) || BASE_URL;
export const ORDER_SERVICE = trimSlash(process.env.REACT_APP_ORDER_SERVICE_URL) || BASE_URL;
export const QUERY_SERVICE = trimSlash(process.env.REACT_APP_QUERY_SERVICE_URL) || BASE_URL;

