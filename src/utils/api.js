import axios from 'axios';
import { marketApi } from 'src/api';
import { ApiControllers } from 'src/api/config';
const API_END_POINT = process.env.REACT_APP_API_END_POINT;
const API_END_POINT_MARKETPLACE=process.env.REACT_APP_API_MARKETPLACE
const API_VERSION = 'api/v1/';

export function get(url) {
  return axios.get(API_END_POINT + `${API_VERSION}${url}`);
}
export function getMarketPlaceData(url){
  return marketApi.get(API_END_POINT_MARKETPLACE + `${API_VERSION}${ApiControllers.admin}${url}`);
}
export function post(url, obj) {
  return axios.post(API_END_POINT + `${API_VERSION}${url}`, obj);
}
export function postAudit(url, obj) {
  return axios.post(process.env.REACT_APP_API_END_POINT + `/${API_VERSION}${url}`,obj);
}
export function put(url, obj) {
  return axios.put(process.env.REACT_APP_API_END_POINT + `${API_VERSION}${url}`, obj);
}
export const convertUTCToLocalTime = (dateString) => {
  let date = new Date(dateString);
  const milliseconds = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
  const localTime = new Date(milliseconds);
  return localTime.toISOString();
};