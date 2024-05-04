import apiCalls from "src/api/apiCalls";
const SET_ALL_TIERS_DATA = "setAllTiersData";
const setAllTiersData = (payload) => {
    return {
      type: SET_ALL_TIERS_DATA,
      payload
    }
  };
  const fetchTiersData = () => {
    return async (dispatch) => {
      dispatch(setAllTiersData({ key: "allTiersData", loader: true, data: [] }));
        let response = await apiCalls.getAllTiers();
     if(response.data){
      dispatch(setAllTiersData({ key: "allTiersData", loader: false, data: response.data, errorMsg: null }));
     }else{
      dispatch(setAllTiersData({ key: "allTiersData", loader: false, data: null, errorMsg: apiCalls.isErrorDispaly(response) }));
     }
    };
  };
 export const initialState = {
    errorMgs: null,
    settingValue:null,
    btnLoader:false,
    validated:false,
    isTransactionSuccess:false,
    success:null,
    allTiersData:{ loading: false, data: []}
  };
  
   const settingsReducer = (state=initialState, action) => {
    switch (action.type) {
      case "setErrorMgs":
        state = { ...state, errorMgs: action.payload };
        break;
      case "setSettingValue":
        state = { ...state, settingValue: action.payload };
        break;
      case "setBtnLoader":  
        state = { ...state, btnLoader: action.payload };
        break;
        case "setValidated":
        state = { ...state, validated: action.payload };
        break;
      case "setIsTransactionSuccess":
        state = { ...state, isTransactionSuccess: action.payload };
        break;
        case "setSuccess":
        state = { ...state, success: action.payload };
        break;
      case SET_ALL_TIERS_DATA:
        state = { ...state, allTiersData: action.payload };
        break;
      default:
        state = { ...state };
    }
    return state;
  };
  export default settingsReducer;
export {fetchTiersData}