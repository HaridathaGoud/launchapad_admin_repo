import { postAudit } from "src/utils/api";
import apiCalls from "../api/apiCalls";
const USER_EXPIRED = 'redux-oidc/USER_EXPIRED'
const SILENT_RENEW_ERROR = 'redux-oidc/SILENT_RENEW_ERROR'
const USER_EXPIRING = 'redux-oidc/USER_EXPIRING'
const USER_FOUND = 'redux-oidc/USER_FOUND'
const USER_LOG_OUT = "userLogout";
const GET_PROFILE_SUCCESS = "getProfileSuccess";
const SET_DEVICE_TOKEN = "setDeviceToken";
const SET_ADMIN_DETIALS = "setAdminDetails";
const CLEAR_PROFILE = "clearProfile";
const ADMIN_PROFILEIMG = "adminProfileImg";
const ISPROJECT_CARDS_ID = "isProjectCardsId";
const SET_ISSHOW_SETTINGS = 'showSettings';
const SET_FCFS_START_TIME = 'fcfsStartTime';
const FETCH_TRACK_AUDITLOGS = "fetchtrackauditlogs";
const SET_USER_ID = 'setUserID';
const FETCH_PERIOD_TYPE = "fetchperiodtype";
const FETCH_WHITELISTING_DATA = "fetchwhitelistingdata";
const SAVE_WHITELIST_DATA = "savewhitelistdata";
const HANDLE_FETCH_MEMBERPRICE = 'handleFetchMemberPrice';
const HANDLE_FETCH_METADATA = 'handleFetchMetaData';
const HANDLE_FETCH_MEMBERTYPE = 'handleFetchMemberType';
const SET_ISCUSTOMER_REGISTER = "setIscustomerRegister";
const SET_CUSTOMER_REGISTER = "setCustomerRegister";
const SET_CUSROMER_WALLETADDRESS = "setCustomerWalletAddress";
const SET_DAODETAILS_LU = "setDaoDetailsLu";
const FETCH_WHITELISTING_ERROR = "fetchwhitelistingerror";
const SET_DEFAULT_VALUE = "setDefaultDao";
const SET_SETTINGS_LOADER ="setSettingsLoaders";

const userLogout = () => {
  return {
    type: USER_LOG_OUT
  }
};

const fetchtrackauditlogs = (payload) => {
  return {
    type: FETCH_TRACK_AUDITLOGS,
    payload
  }
};
const profileSuccess = (info) => {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: info
  }
}
const setToken = (payload) => {
  return {
    type: SET_DEVICE_TOKEN,
    payload
  }
}
const setAdminDetails = (payload) => {
  return {
    type: SET_ADMIN_DETIALS,
    payload
  }
}

const savewhitelistdata = (payload) => {
  return {
    type: SAVE_WHITELIST_DATA,
    payload
  }
}
const handleFetchMemberPrice = (payload) => {
  return {
    type: HANDLE_FETCH_MEMBERPRICE,
    payload,
  };
};

const handleFetchMetaData = (payload) => {
  return {
    type: HANDLE_FETCH_METADATA,
    payload,
  };
};

const handleFetchMemberType = (payload) => {
  return {
    type: HANDLE_FETCH_MEMBERTYPE,
    payload,
  };
};

const setIscustomerRegister = (payload) => {
  return {
    type: SET_ISCUSTOMER_REGISTER,
    payload,
  };
}

const setCustomerRegister = (payload) => {
  return {
    type: SET_CUSTOMER_REGISTER,
    payload,
  };
}

const setCustomerWalletAddress = (payload) => {
  return {
    type: SET_CUSROMER_WALLETADDRESS,
    payload,
  };
}

const isErrorDispaly = (objValue) => {
  if ((objValue.status > 400 && objValue.status < 500) && objValue.status != 401) {
    return "Something went wrong please try again!";
  } else {
    if (objValue.data && typeof objValue.data === "string") {
      return objValue.data;
    } else if (objValue.data && objValue.data.title && typeof objValue.data.title) {
      return objValue.data.title;
    } else if (
      objValue.originalError &&
      typeof objValue.originalError.message === "string"
    ) {
      return objValue.originalError.message;
    } else {

      return typeof (objValue) === "object" && objValue.reason ? objValue.reason : "Something went wrong please try again!";
    }
  }
};
const fetchwhitelistingerror = (payload) => {
  return {
    type: FETCH_WHITELISTING_ERROR,
    payload,
  };
}

let auditInfo = null
const getIpRegisteryData = (id) => {
  return async (dispatch) => {
    await apiCalls.getIpRegistery().then((res) => {
      if (res.ok) {
        auditInfo = res.data
        if (res.data) {
          dispatch(getAdminDetails(id))
          dispatch(fetchtrackauditlogs(res.data));
        }
      }
    });
  }
}


const getDaoCardDetailsLu = (obj) => {
  return async (dispatch) => {
    dispatch(setDaoDetailsLu({ key: "periodsData", loading: true, data: null }));
    const response = await apiCalls.getPeriodsData(obj);
    dispatch(setDaoDetailsLu({ key: "periodsData", loading: false, data: response.data, error: null }));
    if(response?.data?.length>0){
      if (response.data) {
        dispatch(setDefaultDao(response.data[0]))
         dispatch(setDaoDetailsLu(response.data))  
      } else {
        dispatch(setDaoDetailsLu({
          key: "periodsData",
          loading: false, data: null,
          error: apiCalls.isErrorDispaly(response)
        }));
      }
    }else{
      dispatch(setDefaultDao(null))
      dispatch(setDaoDetailsLu({
        key: "periodsData",
        loading: false, data: null,
        error: apiCalls.isErrorDispaly(response)
      }));
    }
   

  }
}
const getAdminDetails = (sub) => {
  return async (dispatch) => {
    if (sub) {
      const response = await apiCalls.fetchAdminDetails(sub);
      if (response.ok) {
        if (response.data) {
          dispatch(setUserID(response.data));
          dispatch(setAdminDetails(response.data));
        }
      }
    }

  }
}
const getPeriodsType = () => {
  return async (dispatch) => {
    const response = await apiCalls.getPeriodType();
    if (response.ok) {
      if (response.data) {
        dispatch(fetchperiodtype(response.data))
      } else {
        dispatch(fetchperiodtype({
          key: "fetchperiodtype",
          loading: false, data: null,
          error: apiCalls.isErrorDispaly(response)
        }));
      }
    }

  }
}

const getWhiteListedData = (whitelistedId, callback) => {
  return async (dispatch) => {
    dispatch(savewhitelistdata({ key: 'savewhitelistdata', loading: true, data: null, error: null, status: null }));
    dispatch(fetchwhitelistingdata({ key: 'fetchwhitelistingdata', loading: true, data: null, error: null }));
    dispatch(fetchwhitelistingerror({
      key: "fetchwhitelistingerror",
      loading: false, data: null,
      error: null
    }));
    const response = await apiCalls.getWhiteListeddata(whitelistedId);
    if (response.ok) {
      if (response.data) {
        dispatch(fetchwhitelistingdata({ key: 'fetchwhitelistingdata', loading: false, data: response.data, error: null }));
        callback ? callback(response.data) : ""
      }

    } else {
      dispatch(fetchwhitelistingdata({ key: 'fetchwhitelistingdata', loading: false, data: null, error: null }));
      dispatch(fetchwhitelistingerror({
        key: "fetchwhitelistingerror",
        loading: false, data: apiCalls.isErrorDispaly(response),
        error: apiCalls.isErrorDispaly(response)
      }));
    }
  }
}
const saveWhitelist = (obj) => {
  return async (dispatch) => {
    dispatch(savewhitelistdata({ key: 'savewhitelistdata', loading: true, data: obj, error: null, status: obj.status }));
    const response = await apiCalls.saveWhitelist(obj);
    if (response.ok) {
      if (response.data) {
        dispatch(savewhitelistdata({ key: 'savewhitelistdata', loading: false, data: response.data, error: null, status: null }));
      } else {
        dispatch(savewhitelistdata({ key: 'savewhitelistdata', error: apiCalls.isErrorDispaly(response), loading: false, data: null }))
      }
    } else {
      dispatch(savewhitelistdata({ key: 'savewhitelistdata', error: apiCalls.isErrorDispaly(response), loading: false, data: null }))
    }
  }

}

const saveAuditLogs = async (id) => {
  let obj = {
    projectOwnerId: id,
    feature: 'sign In',
    Type: "Admin",
    info: JSON.stringify(auditInfo),
    createdDate: new Date()
  }
  let response = await postAudit(`Projects/SaveAdminAuditLogs`, obj)
}

const getMetaDataDetails = (daoId,count, callback) => {
  return async (dispatch) => {
    dispatch(handleFetchMetaData({ key: 'metaDataDetails', loading: true, data: [] }));
    const res = await apiCalls.metaDataDetails(daoId,count);
    if (res) {
      dispatch(handleFetchMetaData({ key: 'metaDataDetails', loading: false, data: res.data, error: null }));
      callback(res.data);
    } else {
      dispatch(
        handleFetchMetaData({
          key: 'metaDataDetails',
          loading: false,
          data: [],
          error: isErrorDispaly(res),
        }),
      );
    }

  };
};

const getMemberTypes = (daoId,callback) => {
  return async (dispatch) => {
    dispatch(handleFetchMemberType({ key: 'memberType', loading: true, data: [], error: null }));
    const res = await apiCalls.memberTypes(daoId);
    if (res) {
      dispatch(handleFetchMemberType({ key: 'memberType', loading: false, data: res.data, error: null }));
      if (callback)
        callback({ loading: false, data: res.data, error: null });
    } else {
      dispatch(
        handleFetchMemberType({
          key: 'memberType',
          loading: false,
          data: [],
          error: isErrorDispaly(res),
        }),
      );
    }
  };
};
const getMemberPrice = (crypto, selectedId, count) => {
  return async (dispatch) => {
    dispatch(handleFetchMemberPrice({ key: 'memberPrice', loading: true, data: [] }));
    const res = await apiCalls.memberPrice(crypto, selectedId, count);
    if (res) {
      dispatch(handleFetchMemberPrice({ key: 'memberPrice', loading: false, data: res.data, error: null }));
    } else {
      dispatch(
        handleFetchMemberPrice({
          key: 'memberPrice',
          loading: false,
          data: [],
          error: isErrorDispaly(res),
        }),
      );
    }
  };
};

const walletAddressChecking = (walletAddress, callback) => {
  return async (dispatch) => {
    dispatch(setCustomerWalletAddress({ key: 'getWalletAddressChecking', loading: true, data: {} }));
    const res = await apiCalls.customerWalletAddressChecking(walletAddress);
    if (res) {
      dispatch(setCustomerWalletAddress({ key: 'getWalletAddressChecking', loading: false, data: res.data, error: null }));
      callback ? callback(res.data) : ""
    } else {
      dispatch(
        setCustomerWalletAddress({
          key: 'getWalletAddressChecking',
          loading: false,
          data: {},
          error: isErrorDispaly(res),
        }),
      );
    }
  };
}
const clearProfile = () => {
  return {
    type: CLEAR_PROFILE
  }
}

const adminProfileImg = (payload) => {
  return {
    type: ADMIN_PROFILEIMG,
    payload
  }
}

const setUserID = (payload) => {
  return {
    type: SET_USER_ID,
    payload,
  };
};
const setDaoDetailsLu = (payload) => {
  return {
    type: SET_DAODETAILS_LU,
    payload,
  };
};
const setDefaultDao = (payload) => {
  return {
    type: SET_DEFAULT_VALUE,
    payload,
  };
};
const isProjectCardsId = (payload) => {
  return {
    type: ISPROJECT_CARDS_ID,
    payload
  }
}

const showSettings = (payload) => {
  return {
    type: SET_ISSHOW_SETTINGS,
    payload,
  };
};
const setSettingsLoaders = (payload) => {
  return {
    type: SET_SETTINGS_LOADER,
    payload
  }
}
const fcfsStartTime = (payload) => {
  return {
    type: SET_FCFS_START_TIME,
    payload,
  };
};
const fetchperiodtype = (payload) => {
  return {
    type: FETCH_PERIOD_TYPE,
    payload,
  };
};
const fetchwhitelistingdata = (payload) => {
  return {
    type: FETCH_WHITELISTING_DATA,
    payload,
  };
};
let initialState = {
  user: null,
  custUser: null,
  deviceToken: null,
  adminDetails: null,
  adminProfileImg: null,
  isProjectCardsId: null,
  isShowSettings: false,
  isSettingsLoading:false,
  isFcfsStartDate: null,
  trackAuditLogData: {},
  fetchperiodtype: [],
  // fetchwhitelistingdata:{},
  fetchwhitelistingdata: { loading: false, data: {}, },
  savewhitelistdata: {},
  metaDataDetails: null,
  memberType: null,
  memberPrice: null,
  customerRegisterDetails: null,
  setCustomerRegisterDetails: null,
  getWalletAddressChecking: {},
  periodsLuData: { loading: false, data: [] },
  defaultData: {},
  fetchwhitelistingerror: {},
};//loading:false,data:null,error:null

const authReducer = (state, action) => {  
  if (!state) {
    state = {
      ...initialState,
      ...state
    }
  }
  switch (action.type) {
    case SET_USER_ID:
      state = { ...state, custUser: action.payload };
      return state;
    case USER_FOUND:
      return { ...state, user: action.payload }
    case USER_EXPIRING:
      return state;
    case USER_LOG_OUT:
      return { user: null, profile: null, adminDetails: null };
    case USER_EXPIRED:
      return { user: null, profile: null, adminDetails: null };
    case GET_PROFILE_SUCCESS:
      return { ...state, profile: action.payload };
    case SET_DEVICE_TOKEN:
      return { ...state, deviceToken: action.payload };
    case SILENT_RENEW_ERROR:
      return state;
    case SET_ADMIN_DETIALS:
      state = { ...state, adminDetails: action.payload };
      return state;
    case CLEAR_PROFILE:
      return { user: null, profile: null, adminDetails: null, trackAuditLogData: {} };
    case ADMIN_PROFILEIMG:
      state = { ...state, adminProfileImg: action.payload };
      return state;
    case ISPROJECT_CARDS_ID:
      state = { ...state, isProjectCardsId: action.payload };
      return state;
    case SET_ISSHOW_SETTINGS:
      state = { ...state, isShowSettings: action.payload };
      return state;
      case SET_SETTINGS_LOADER:
        state = { ...state, isSettingsLoading: action.payload };
        return state;
    case SET_FCFS_START_TIME:
      state = { ...state, isFcfsStartDate: action.payload };
      return state;
    case FETCH_TRACK_AUDITLOGS:
      state = { ...state, trackAuditLogData: action.payload }
      return state;
    case FETCH_PERIOD_TYPE:
      state = { ...state, fetchperiodtype: action.payload }
      return state;
    case FETCH_WHITELISTING_DATA:
      //state = { ...state, fetchwhitelistingdata: action.payload }
      state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
      return state;
    case SAVE_WHITELIST_DATA:
      state = { ...state, savewhitelistdata: action.payload }
      return state;
    case SET_DAODETAILS_LU:
      state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
      return state;
    case SET_DEFAULT_VALUE:
      state = { ...state, defaultData: action.payload };
      return state;

    case HANDLE_FETCH_MEMBERPRICE:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          error: action.payload.error,
          isLoading: action.payload.loading,
        },
      };
    case HANDLE_FETCH_METADATA:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          error: action.payload.error,
          isLoading: action.payload.loading,
        },
      };
    case HANDLE_FETCH_MEMBERTYPE:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          error: action.payload.error,
          isLoading: action.payload.loading,
        },
      };
    case SET_ISCUSTOMER_REGISTER:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          error: action.payload.error,
          isLoading: action.payload.loading,
        },
      };
    case SET_CUSTOMER_REGISTER:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          error: action.payload.error,
          isLoading: action.payload.loading,
        },
      };
    case SET_CUSROMER_WALLETADDRESS:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          error: action.payload.error,
          isLoading: action.payload.loading,
        },
      };
    case FETCH_WHITELISTING_ERROR:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          error: action.payload.error,
          loading: action.payload.loading,
        },
      };
    default:
      return state;
  }
}

export default authReducer;
export {
  setUserID, userLogout, profileSuccess, setToken, getAdminDetails, clearProfile, adminProfileImg, isProjectCardsId,
  showSettings,setSettingsLoaders, fcfsStartTime, getIpRegisteryData, fetchtrackauditlogs, fetchperiodtype, getPeriodsType, getWhiteListedData, saveWhitelist, getMemberPrice, setDaoDetailsLu, getDaoCardDetailsLu, setDefaultDao,
  handleFetchMemberPrice, getMetaDataDetails, handleFetchMetaData, getMemberTypes, handleFetchMemberType,
  setIscustomerRegister, setCustomerRegister, walletAddressChecking, setCustomerWalletAddress
};


