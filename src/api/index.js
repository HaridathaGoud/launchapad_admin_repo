import { create } from "apisauce";
import store from '../store'
const projectApi = create({
	baseURL: process.env.REACT_APP_API_END_POINT + "/api/v1/",
});
const marketPlaceApi = create({
	baseURL: process.env.REACT_APP_API_MARKETPLACE + "/api/v1/",
});
const kycInfo=create({
	baseURL: process.env.REACT_APP_API_END_POINT_KYCINFO + "/api/v1/",
});
const marketApi=create({
	baseURL: process.env.NEXT_PUBLIC_API_END_POINT + "/api/v1/",
})
const ipRegistry = create({
	baseURL: "https://api.ipstack.com",
});
const mintingApi = create({
	baseURL: process.env.REACT_APP_API_MINTING + "/api/v1/",
})

const daoApi = create({
	baseURL: process.env.REACT_APP_API_DAO_END_POINT + "/api/v1/",
});
const daoApiAdmin = create({
	baseURL: process.env.REACT_APP_API_DAO_END_POINT_ADMIN + "/api/v1/",
});

const launchpadApi=create({
	//baseURL:"https://tstlaunchpadapi.azurewebsites.net/api/v1"
	baseURL:process.env.REACT_APP_API_LAUNCHPAD_POINT +"api/v1"

})
const projectApii = create({
	baseURL: process.env.REACT_APP_API_LAUNCHPAD_POINT + "/api/v1/",
});
projectApii.axiosInstance.interceptors.request.use(async config => {
	const token = store.getState().oidc.user.access_token;
	config.headers.authorization = `Bearer ${token}`;
	return config;
});
launchpadApi.axiosInstance.interceptors.request.use(async config => {
	const token = store.getState().oidc.user.access_token;
	config.headers.authorization = `Bearer ${token}`;
	return config;
});


daoApi.axiosInstance.interceptors.request.use(async config => {
	const token = store.getState().oidc.user.access_token;
	config.headers.authorization = `Bearer ${token}`;
	return config;
});
marketPlaceApi.axiosInstance.interceptors.request.use(async config => {
	const token = store.getState().oidc.user.access_token;
	config.headers.authorization = `Bearer ${token}`;
	return config;
});
kycInfo.axiosInstance.interceptors.request.use(async config => {
	const token = store.getState().oidc.user.access_token;
	config.headers.authorization = `Bearer ${token}`;
	return config;
});
marketApi.axiosInstance.interceptors.request.use(async config => {
	const token = store.getState().oidc.user.access_token;
	config.headers.authorization = `Bearer ${token}`;
	return config;
});
mintingApi.axiosInstance.interceptors.request.use(async config => {
	const token = store.getState().oidc.user.access_token;
	config.headers.authorization = `Bearer ${token}`;
	return config;
});

export {
	projectApi,marketApi,ipRegistry,kycInfo,marketPlaceApi,mintingApi,daoApi,launchpadApi,projectApii,daoApiAdmin
};

