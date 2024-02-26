import { projectApi, marketApi,ipRegistry,kycInfo,marketPlaceApi,mintingApi,daoApi,launchpadApi,projectApii,daoApiAdmin } from ".";
import { ApiControllers } from "./config";
import CryptoJS from "crypto-js";

const getNfts = (useraddress, take, skip, type, searchBy) => {
  return marketApi.get(ApiControllers.user + `GetNfts/${useraddress}/${take}/${skip}/${type}/${searchBy}`)
}
const SaveFavorite = (obj) => {
  return marketApi.get(ApiControllers.user + `SaveFavorite`, obj)
}
const customerDetails = (address) => {
  return kycInfo.get(ApiControllers.adminkyc+ `CustomerDetails/${address}`)
}

const getAllcustomers = (take, skip, searchBy) => {
  return kycInfo.get(ApiControllers.projects + `AllCustomersDetails/${take}/${skip}/${searchBy || null}`)
}

const getKYCInformation = (CustomerId) => {
  return kycInfo.get(ApiControllers.adminkyc + `GetKYCInformation/${CustomerId}`)
}

const getRefferalData = (CustomerId,take,skip)=>{
  return kycInfo.get(ApiControllers.adminkyc + `GetReferralData/${CustomerId}/${take}/${skip}`)
}
const saveAuditLog=(obj)=>{
  return projectApi.get(ApiControllers.projects + `SaveAdminAuditLogs`.obj)
}

const saveAdmin = (obj) => {
  return kycInfo.post(ApiControllers.projects + `SaveProjectOwner`, obj)
}

const adminProfile = (id) => {
  return kycInfo.get(ApiControllers.projects + `ProfileDetails/${id}`)
}

const changePassword = (obj) => {
  return kycInfo.post(ApiControllers.projects + `ChangePassword`, obj)
}

const kycStatus = (obj) => {
  return kycInfo.put(ApiControllers.projects + `KycStatus`, obj)
}

const getProjectDetails = (projectId) => {
  return launchpadApi.get(ApiControllers.projects + `GetProjectDetails/${projectId}`);
};
const getTiers = (projectId) => {
  return launchpadApi.get(ApiControllers.projects + `GetTiers/${projectId}`)
}

const getAllCustomers = (take, skip, searchBy) => {
  return kycInfo.get(ApiControllers.projects + `GetAllCustomers/${take}/${skip}/${searchBy || null}`)
}
const UpdateProjectDetail = (obj) => {
  return launchpadApi.put(ApiControllers.projects + `UpdateProjectDetails`, obj);
}
const idoRequestStateChange = (obj) => {
  return launchpadApi.put(ApiControllers.projects + `ProjectStateChange`, obj);
}
const UpdateProjectPayments = (obj) => {
  return launchpadApi.put(ApiControllers.projects + `UpdateProjectPayment`, obj);
}
const savetiers = (projectId, obj) => {
  return launchpadApi.post(ApiControllers.projects + `savetiers/${projectId}`, obj);
}
const UpdateClaimsAndAllocation = (obj) => {
  return launchpadApi.put(ApiControllers.projects + `UpdateClaimsAndAllocation`, obj);
}
const getProjects = (projectId) => {
  return kycInfo.get(ApiControllers.projects + `GetProjects/${projectId}`)
}

const getStakingTransactions = (take, skip, searchBy) => {
  return kycInfo.get(ApiControllers.projects + `StakingTransactions/${take}/${skip}/${searchBy || null}`)
}

const getInvestorDaoDetails=(investorId,take,skip)=> {
  return daoApiAdmin.get(ApiControllers.projects +`DaoDetails/${investorId}/${take}/${skip}`);
}


const isErrorDispaly = (objValue) => {
  if ((objValue.status > 400 && objValue.status < 500) && objValue.status != 401) {
    return "Something went wrong please try again!";
  } else {
    if (objValue.data && typeof objValue.data === "string") {
      return objValue.data;
    } else if (objValue.data && objValue.data.title && typeof objValue.data.title) {
      return objValue.data.title;
    }else if (objValue.title ) {
      return objValue.title;
    }
    else if (objValue && objValue.shortMessage && typeof objValue.shortMessage) {
      return objValue.shortMessage;
    }
     else if (
      objValue.originalError &&
      typeof objValue.originalError.message === "string"
    ) {
      return objValue.originalError.message;
    } else {

      return typeof (objValue) === "object" && objValue.reason ? objValue.reason : "Something went wrong please try again!";
    }
  }
};
const uploadErrorDisplay = (objValue)=>{
	if ((objValue?.status >= 400 && objValue?.status < 500) && objValue?.status != 401) {
		return "Something went wrong please try again!";
	} else {
		if (objValue?.title && typeof objValue?.title) {
			return objValue?.title;
		}   else {
			return "Something went wrong please try again!";
		}
	}
}
const fetchAdminDetails = (sub) => {
  return kycInfo.get(ApiControllers.projects + `AdminInfo/${sub}`)
}

const encryptValue = (msg, key) => {
	msg = typeof msg == "object" ? JSON.stringify(msg) : msg;
	let salt = CryptoJS.lib.WordArray.random(128 / 8);

	let key1 = CryptoJS.PBKDF2(key, salt, {
		keySize: 256 / 32,
		iterations: 10,
	});

	let iv = CryptoJS.lib.WordArray.random(128 / 8);

	let encrypted = CryptoJS.AES.encrypt(msg, key1, {
		iv: iv,
		padding: CryptoJS.pad.Pkcs7,
		mode: CryptoJS.mode.CBC,
	});
	return salt.toString() + iv.toString() + encrypted.toString();
};

const getPeriodsData=(obj)=>{
  return mintingApi.post(ApiControllers.admin+`daoLu`,obj)
}
 const createInvestors=(obj)=>{
  return kycInfo.post(ApiControllers.projects + `UserDetails`,obj)
 }

 const getLaunchpadProjectDetails = (pid, userId) => {
  return projectApi.get(ApiControllers.user + `TokenInformation/${pid}/${userId}`)
}
 const getTokenInfo=(pid,userId)=>{
  return launchpadApi.get(ApiControllers.projects+ `TokenInformation/${pid}/${userId}`)
}
const getProjectFeed = (pid) => {
  return launchpadApi.get(ApiControllers.projects + `ProjectFeed/${pid}`)
}

const getAllocationDetails = (pid,userId) => {
  return launchpadApi.get(ApiControllers.projects + `Allocations/${pid}/${userId}`)
}
const getAllocation = (pid,userId) => {
  return launchpadApi.get(ApiControllers.projects + `CustomerAddresses/${pid}`)
}
const getClames = (pid,userId) => {
  return launchpadApi.get(ApiControllers.projects + `Claims/${pid}/${userId}`)
}
const getsocialwebsites = () => {
  return launchpadApi.get(ApiControllers.projects + `getsocialwebsites`)
}
const getLaunchPadProjectData=(id,type,take,skip,search)=>{
  return launchpadApi.get(ApiControllers.projects+ `GetProjects/${id}/${type}/${take}/${skip}/${search}`)
}

const getAdminDashboarData=()=>{
  return marketPlaceApi.get(ApiControllers.admin + `GetAdminDashboardKPIs`)
}
const getAdminDashboarDataK=(projectOwnerId)=>{
  return launchpadApi.get(ApiControllers.projects + `AdminDashboardDetails/${projectOwnerId}`)
}
const getIdoRequest = (take, skip, search) => {
  return launchpadApi.get(ApiControllers.projects + `IdosRequests/${take}/${skip}/${search || null}`)
}
const getProjectOwners = (take, skip, searchBy) => {
  return launchpadApi.get(ApiControllers.projects + `ProjectOwners/${take}/${skip}/${searchBy || null}`)
}

const getOwnerProjects = (projectId,role, take, skip, searchBy) => {
  return launchpadApi.get(ApiControllers.projects + `ProjectOwnerProjects/${projectId}/${role}/${take}/${skip}/${searchBy || null}`)
}
const getMArketplaceDashboard =()=>{
  return projectApi.get(ApiControllers.projects + `GetAdminDashboardKPIs`)
}

const getWalletAddressDetails = async (walletAddress, take, skip, searchBy) => {
  return kycInfo.get(ApiControllers.projects + `GetProjects/42D3F760-FCAE-4A22-9B6B-845C42925416/${take}/${skip}/${searchBy || null}`)
}
const getSuperAdminDetails = () => {
  return launchpadApi.get(ApiControllers.projects + `GetSuperAdminDashboard`)
}
const getUpcomingProjects = () => {
  return launchpadApi.get(ApiControllers.projects + `UpcomingProject`)
}
const getProjectDetailsPreview = async (projectId) => {
  return launchpadApi.get(ApiControllers.projects + `ProjectDetailsPreview/${projectId}`)
}
const updateContractAddressStatus = (obj) => {
  return launchpadApi.put(ApiControllers.projects + `UpdateProjectContractAddressAndStatus`, obj)
}
const adminOrSuperAdminDetails = (address) => {
  return launchpadApi.get(ApiControllers.projects + `ProfileDetails/${address}`)
}
const getlaunchpadProjects = (id, take, skip, search) => {
  return projectApi.get(ApiControllers.user + `CustomerProjects/${id}/${take}/${skip}/${search || null}`)
}

const getUserProfile= (id) => {
  return projectApi.get(ApiControllers.user + `UserProfile/${id}`)
}
const getCastCrewRolesLu = () => {
  return projectApii.get(ApiControllers.projects + `roleslu`)
}
const getIpRegistery = () => {
  return ipRegistry.get(`/check?access_key=`+process.env.REACT_APP_IPREGISTERY_KEY);
};
const getPeriodType = () => {
  return mintingApi.get(ApiControllers.admin + `periodsLu`)
}
const getWhiteListeddata=(whitelistedId)=>{
  return mintingApi.get(ApiControllers.admin + `membertasks/${whitelistedId}`)
}
const saveWhitelist=(obj)=>{
  return mintingApi.put(ApiControllers.admin + `savetask`,obj)
}
const apiUploadPost = async (endpoint, params) => {
  const result = await kycInfo.post(`${endpoint}`, params, {
    headers: {
      'content-type': 'image/png',
    },
  });
  return result.data;
};

const totalBonus = async (daoId)=>{
  return mintingApi.get(ApiControllers.admin + `totalbonusdata/${daoId}`)
}
const metaDataDetails = async (daoId,count)=>{
  return mintingApi.get(ApiControllers.admin + `mintfiles/${daoId}/${count}`)
}
const memberTypes = async (daoId)=>{
  return mintingApi.get(ApiControllers.admin + `GetMemberShipType/${daoId}`)
}

const memberPrice = async (crypto,selectedId,count)=>{
  return mintingApi.get(ApiControllers.admin + `GetMemberShipPrice/${crypto}/${selectedId}/${count}`)
}
const customerWalletAddressChecking = async (walletAddress)=>{
  return mintingApi.get(ApiControllers.admin + `customerkycstatus/${walletAddress}`)
}
//devmintingapi.minnapad.com/api/v1/Admin/updatereferralbonusstatus
const updateRefferal = async (obj)=>{
  return mintingApi.put(ApiControllers.admin + `updatereferralbonusstatus`,obj)
}
const updateTransaction = async (obj)=>{
  return mintingApi.put(ApiControllers.admin + `updatetransactionhash`, obj)
}
//--------------------------------

const daoContractAddress=async(daoId)=>{
  return daoApi.get(ApiControllers.admin + `/daodata/${daoId}`)
}

const getProposalView=(proposalId,customerId)=> {
  return daoApi.get(ApiControllers.admin +`proposalview/${proposalId}/${customerId ? customerId : ""}`);
 
}
const postCreateProposal=(obj)=> {
  return daoApi.post(ApiControllers.admin +`proposalcreation`,obj);
 
}
const getProposalList=(take,skip,daoId,status,searchBy,startDate,endDate)=> {
  return daoApi.get(ApiControllers.admin +`ProposalsList/${take}/${skip}/${daoId}/${status}/${searchBy}/${startDate}/${endDate}`) 
}
const getStatusLu = ()=>{
  return daoApi.get(ApiControllers.admin +`StatusLu`);
}

const getDaoDetails=(take,skip)=> {
  return daoApi.get(ApiControllers.admin +`DaoDetails/${take}/${skip}`);
}

const getContractDetails=(daoId)=> {
  return daoApi.get(ApiControllers.admin +`ContractDetails/${daoId}`);
  
}
const getProposalVoters=(take,skip,proposalId)=> {
  return daoApi.get(ApiControllers.admin +`proposalvoters/${take}/${skip}/${proposalId}`);

}
const updateVotingContractAddress=(obj)=> {
  return daoApi.put(ApiControllers.admin +`updatedaocontractaddress`,obj);

}

let apiCalls = {idoRequestStateChange,createInvestors,getAdminDashboarDataK,
  getLaunchPadProjectData,getTokenInfo,getClames,getAllocation,getAllocationDetails,
totalBonus,updateRefferal,getProposalView,postCreateProposal,getProposalList,getStatusLu,getDaoDetails,getContractDetails,daoContractAddress,
  saveAuditLog,customerDetails, getAllcustomers, isErrorDispaly, getKYCInformation, saveAdmin, adminProfile, changePassword, fetchAdminDetails, encryptValue,
  kycStatus,   SaveFavorite, getNfts,getIpRegistery,getRefferalData, getAdminDashboarData, getIdoRequest, getProjectOwners, getProjectDetails, getOwnerProjects, getAllCustomers, getStakingTransactions,
  getMArketplaceDashboard, getWalletAddressDetails, getProjectDetailsPreview, UpdateProjectDetail, UpdateProjectPayments
  , savetiers, UpdateClaimsAndAllocation, getProjects, getTiers, getSuperAdminDetails, getUpcomingProjects,
  updateContractAddressStatus, adminOrSuperAdminDetails, getlaunchpadProjects, getLaunchpadProjectDetails, getProjectFeed,getUserProfile,
  apiUploadPost,metaDataDetails,memberTypes,memberPrice,updateTransaction,
  getPeriodType,getWhiteListeddata,saveWhitelist,getPeriodsData,memberTypes,customerWalletAddressChecking,getProposalVoters,uploadErrorDisplay,getCastCrewRolesLu,getInvestorDaoDetails,updateVotingContractAddress}

export default apiCalls