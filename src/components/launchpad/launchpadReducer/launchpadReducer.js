import apiCalls from "../../../api/apiCalls";
const PROJECT_DETAILS_DATA = "setProjectDetails";
const SUPERADMIN_DETAILS = "setSuperAdminDetails";
const UPCOMMING_PROJECT_DETAILS = "setUpcomingProjectDetails";
const ADMIN_DASHBOARD_DETAILS = "setAdminDashboardDetails";
const SET_VIEWED_PROJECT = 'viewedProjects';
const SET_PROJECT_SAVED = "projectedSaved"
const SET_PROJECT_PAYMENT = "projectePayment"
const PROJECT_DETAILS_SAVE = "projectDetailsSave";
const USER_DETAILS = "userDetailsData";
const SET_CAST_CREW_ROLES_LU="setcastCrewRolesLu";

const userDetailsData = (payload) => {
  return {
    type: USER_DETAILS,
    payload,
  };
};


const viewedProjects = (payload) => {
  return {
    type: SET_VIEWED_PROJECT,
    payload,
  };
};
const projectDetailsSave = (payload) => {
  return {
    type: PROJECT_DETAILS_SAVE,
    payload
  }
};
const projectedSaved = (payload) => {
  return {
    type: SET_PROJECT_SAVED,
    payload,
  };
};

const projectePayment = (payload) => {
  return {
    type: SET_PROJECT_PAYMENT,
    payload,
  };
};


const setProjectDetails = (payload) => {
  return {
    type: PROJECT_DETAILS_DATA,
    payload
  }
};

const setcastCrewRolesLu = (payload) => {
  return {
    type: SET_CAST_CREW_ROLES_LU,
    payload
  }
};

const setUpcomingProjectDetails = (payload) => {
  return {
    type: UPCOMMING_PROJECT_DETAILS,
    payload
  }
};
const setAdminDashboardDetails = (payload) => {
  return {
    type: ADMIN_DASHBOARD_DETAILS,
    payload
  }
};
const setSuperAdminDetails = (payload) => {
  return {
    type: SUPERADMIN_DETAILS,
    payload
  }
};
const projectDetailsData = (id, callback) => {
  return async (dispatch) => {
    dispatch(setProjectDetails({ key: "projectDetails", loader: true, data: null }));
    let response = await apiCalls.getProjectDetails(id);
    dispatch(setProjectDetails({ key: "projectDetails", loader: false, data: response.data, errorMgs: null }));
    if (response.data) {
      dispatch(setProjectDetails(response.data))
      if (callback) {
        callback({ loading: false, data: response.data, error: null });
      }
    } else {
      dispatch(setProjectDetails({
        key: "projectDetails",
        loader: false, data: null,
        errorMgs: apiCalls.isErrorDispaly(response)
      }));
    }

  }
}


const SuperAdminDetails = (callback) => {
  return async (dispatch) => {
    dispatch(setSuperAdminDetails({ key: "superAdminDetails", loader: true, data: null }));
    let response = await apiCalls.getSuperAdminDetails()
    dispatch(setSuperAdminDetails({ key: "superAdminDetails", loader: false, data: response.data, errorMsg: null }));
    if (response.data) {
      if (callback) {
        callback({ loading: false, data: response.data, error: null });
      }
      dispatch(setSuperAdminDetails(response.data))
    } else {
      dispatch(setSuperAdminDetails({
        key: "superAdminDetails",
        loader: false, data: null,
        errorMsg: apiCalls.isErrorDispaly(response)
      }));
    }

  }
}

const UpComingProjectDetails = (id) => {
  return async (dispatch) => {
    dispatch(setUpcomingProjectDetails({ key: "upComingProjectsDetails", loader: true, data: null }));
    let response = await apiCalls.getUpcomingProjects()
    dispatch(setUpcomingProjectDetails({ key: "upComingProjectsDetails", loader: false, data: response.data, errorMsg: null }));
    if (response.data) {
      dispatch(setUpcomingProjectDetails(response.data))
    } else {
      dispatch(setUpcomingProjectDetails({
        key: "upComingProjectsDetails",
        loader: false, data: null,
        errorMsg: apiCalls.isErrorDispaly(response)
      }));
    }

  }
}

const getAdminDashboardDetails = (AdminId) => {
  return async (dispatch) => {
    dispatch(setAdminDashboardDetails({ key: "adminDashboardDetails", loader: true, data: null }));
    let response = await apiCalls.getAdminDashboarDataK(AdminId)
    dispatch(setAdminDashboardDetails({ key: "adminDashboardDetails", loader: false, data: response.data, errorMsg: null }));
    if (response.data) {
      dispatch(setAdminDashboardDetails(response.data))
    } else {
      dispatch(setAdminDashboardDetails({
        key: "adminDashboardDetails",
        loader: false, data: null,
        errorMsg: apiCalls.isErrorDispaly(response)
      }));
    }

  }
}
const fetchCastCrewRolesData = () => {
  return async (dispatch) => {
    dispatch(setcastCrewRolesLu({ key: "castCrewRolesLuData", loader: true, data: [] }));
      let response = await apiCalls.getCastCrewRolesLu();
   if(response.data){
    dispatch(setcastCrewRolesLu({ key: "castCrewRolesLuData", loader: false, data: response.data, errorMsg: null }));
   }else{
    dispatch(setcastCrewRolesLu({ key: "castCrewRolesLuData", loader: false, data: null, errorMsg: apiCalls.isErrorDispaly(response) }));
   }
  };
};
let initialState = {
  projectDetails: {},
  superAdminDetails: {},
  upComingProjectsDetails: {},
  adminDashboardDetails: {},
  viewedProject: {},
  userData: {},
  projectedSaved: false,
  projectePayment: {},
  projectSaveDetails: {},
  castCrewRolesLuData: [],

};


function handleDetailsCase(state, action) {
  return {
    ...state,
    [action.payload.key]: {
      data: action.payload.data,
      errorMsg: action.payload.error,
      loader: action.payload.loading,
    },
  };
}

const launchPadReducer = (state, action) => {
  if (!state) {
    state = {
      ...initialState,
      ...state
    }
  }
  switch (action.type) {
    case PROJECT_DETAILS_DATA:
      return {
        ...state, [action.payload.key]: {
          data: action.payload.data,
          errorMsg: action.payload.error,
          loader: action.payload.loading,
        },
      };
    case SUPERADMIN_DETAILS:
      return handleDetailsCase(state, action);

    case UPCOMMING_PROJECT_DETAILS:
      return handleDetailsCase(state, action);

    case SET_VIEWED_PROJECT:
      state = { ...state, viewedProject: action.payload };
      return state;
    case USER_DETAILS:
      state = { ...state, userData: action.payload };
      return state;
    case SET_PROJECT_SAVED:
      state = { ...state, projectedSaved: action.payload };
      return state;
    case PROJECT_DETAILS_SAVE:
      state = { ...state, projectSaveDetails: action.payload }
      return state;
    case SET_PROJECT_PAYMENT:
      state = { ...state, projectePayment: action.payload };
      return state;
    case SET_CAST_CREW_ROLES_LU:
      return { ...state, castCrewRolesLuData: action.payload };
    case ADMIN_DASHBOARD_DETAILS:
      return handleDetailsCase(state, action);
    default:
      return state;
  }
}
export default launchPadReducer;
export { projectDetailsSave, projectDetailsData, SuperAdminDetails, UpComingProjectDetails, getAdminDashboardDetails, viewedProjects, userDetailsData, projectedSaved, projectePayment,fetchCastCrewRolesData };