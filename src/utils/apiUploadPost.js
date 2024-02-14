import axios from 'axios';
const API_END_POINT = process.env.REACT_APP_API_END_POINT_KYCINFO;
const API_VERSION = '/api/v1/';

const apiUploadPost = async (endpoint, params) => {
  const result = await axios.post(API_END_POINT + `${API_VERSION}` + `${endpoint}`, params, {
    headers: {
      'content-type': 'image/png',
    },
  });
  return result.data;
};

export default apiUploadPost;
