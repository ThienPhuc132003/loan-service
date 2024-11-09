// src/network/Api.js
import { METHOD_TYPE } from "./methodType";
import axiosClient from "./axiosClient";
import { parseQuery } from "./queryParser";

const Api = ({
  domain = "",
  endpoint,
  method = METHOD_TYPE.GET,
  data,
  query,
}) => {
  const url = `${domain}${endpoint}${parseQuery(query)}`;
  console.log(`API URL axi: ${url}`);

  switch (method) {
    case METHOD_TYPE.POST:
      return axiosClient.post(endpoint, data);
    case METHOD_TYPE.PUT:
      return axiosClient.put(endpoint, data);
    case METHOD_TYPE.DELETE:
      return axiosClient.delete(endpoint, { data });
    default:
      return axiosClient.get(url);
  }
};

export default Api;