import apiCalls from "../../api/apiCalls";
const DAO_CARDS = "setDaoCards";
const LOOKUP_CALL = "lookUp";
const PROPOSAL_VIEW_DATA = "setProposalViewData"
const CON_DETAILS_DATA = "setConDetailsData";
const PROPOSAL_DETAILS_LIST = "proposalDetailsList";
const PROPOSAL_DATA = "proposalData";
const SAVE_PROPOSAL ="saveProposal";
const PROPOSALVIEW="proposalview";
const FETCH_VOTERS_DATA = "fetchVotersData";
const ISCHECKSEEMORE = "isCheckSeeMore";
const setDaoCards = (payload) => {
  return {
    type: DAO_CARDS,
    payload,
  };
}

const lookUp = (payload) => {
  return {
    type: LOOKUP_CALL,
    payload
  }
};
const  isCheckSeeMore= (payload) => {
  return {
      type: ISCHECKSEEMORE,
      payload
  }
};

const setProposalViewData = (payload) => {
  return {
    type: PROPOSAL_VIEW_DATA,
    payload
  }
};
const setConDetailsData = (payload) => {
  return {
    type: CON_DETAILS_DATA,
    payload
  }
};

const  proposalDetailsList= (payload) => {
  return {
      type: PROPOSAL_DETAILS_LIST,
      payload
  }
};
const  proposalData= (payload) => {
  return {
      type: PROPOSAL_DATA,
      payload
  }
};
const  proposalview= (payload) => {
  return {
      type: PROPOSALVIEW,
      payload
  }
};
const  fetchVotersData= (payload) => {
  return {
      type: FETCH_VOTERS_DATA,
      payload
  }
};
const  saveProposal= (payload) => {
  return {
      type: SAVE_PROPOSAL,
      payload
  }
};
const contractDetailsData = (dao) => {
  return async (dispatch) => {
    dispatch(setConDetailsData({ key: "contractDetails", loading: true, data: null }));
    const response = await apiCalls.getContractDetails(dao.id);
    dispatch(setConDetailsData({ key: "contractDetails", loading: false, data: response.data, error: null }));
    if (response.data) {
      dispatch(setConDetailsData(response.data))
    } else {
      dispatch(setConDetailsData({
        key: "contractDetails",
        loading: false, data: null,
        error: apiCalls.isErrorDispaly(response)
      }));
    }

  }
}
const proposalViewData = (proposalId) => {
  return async (dispatch) => {
    dispatch(setProposalViewData({ key: "proViewData", loading: true, data: null }));
    const response = await apiCalls.getProposalView(proposalId);
    dispatch(setProposalViewData({ key: "proViewData", loading: false, data: response.data, error: null }));
    if (response.data) {
      dispatch(setProposalViewData(response.data))
    } else {
      dispatch(setProposalViewData({
        key: "proViewData",
        loading: false, data: null,
        error: apiCalls.isErrorDispaly(response)
      }));
    }

  }
}
const clearDaos = () => {
  return (dispatch) => {
    dispatch(setDaoCards({ loading: false, data: null, nextPage: 1 }))
  }
}
const daoCards = (information) => {
  const { take, page, data } = information;
  const skip = take * (page) - take;
  return async (dispatch) => {
    dispatch(setDaoCards({ key: 'daoCards', loading: true, data: data }));
    try{
      const res = await apiCalls.getDaoDetails(take, skip);
      if (res.status === 200) {
        dispatch(setDaoCards({ key: 'daoCards', loading: false, data: data ? [...data, ...res.data] : res.data, error: null, nextPage: page + 1 }));
      } else {
        dispatch(
          setDaoCards({
            key: 'daoCards',
            loading: false,
            data: data,
            error: res,
          }),
        );
      }
    }catch(error){
      dispatch(
        setDaoCards({
          key: 'daoCards',
          loading: false,
          data: data,
          error: error,
        }),
      );
    }
 
  };
}

const InvestorDaoCards = (information, inverstorId) => {
  const { take, page, data } = information;
  const skip = take * (page) - take;
  return async (dispatch) => {
    dispatch(setDaoCards({ key: 'daoCards', loading: true, data: data }));
    try {
      const res = await apiCalls.getInvestorDaoDetails(inverstorId, take, skip);
      if (res.status === 200) {
        dispatch(setDaoCards({ key: 'daoCards', loading: false, data: data ? [...data, ...res.data] : res.data, error: null, nextPage: page + 1 }));
      } else {
        dispatch(
          setDaoCards({
            key: 'daoCards',
            loading: false,
            data: data,
            error: res,
          }),
        );
      }
    } catch (error) {
      dispatch(
        setDaoCards({
          key: 'daoCards',
          loading: false,
          data: data,
          error: error,
        }),
      );
    }
  };
}

const getLookUp = (getLookUp) => {
  return async (dispatch) => {
    dispatch(lookUp({ key: 'lookUp', loading: true, data: {},error:null }));
    const response = await apiCalls.getStatusLu();
    if (response.data) {
      dispatch(lookUp(response.data));
      dispatch(lookUp({ key: 'lookUp', loading: false, data: response.data,error:null }));
      getLookUp ? getLookUp(response.data) : ""
    }

  }
}

const getCardsProposalList = (pageNo,pageSize,dao,status,search,startDate,endDate,callback) => {
  const skip = pageNo * pageSize - pageSize;
      const take = pageSize;
    return async (dispatch) => {

      dispatch({ type: 'isCheckSeeMore', payload:null,loading:true  });
         const response = await apiCalls.getProposalList(take,skip,dao,status,search,startDate,endDate);
         if (response.ok) {
          if(callback ){
            callback(response)
          }
          let MergeGridData = [...response.data];
          dispatch({ type: 'proposalDetailsList', payload: MergeGridData,pageNo,loading:false });
          dispatch({ type: 'isCheckSeeMore', payload:response.data?.length>=5 ? true : false,loading:false  }); 
         } else {
          dispatch(
            proposalDetailsList({
              key: 'proposalDetailsList',
              loading: false,
              data: null,
              error: response,
            }),
          );
        }
     }
  }

const saveProposalCall = (saveObj,callback)=>{
  return async (dispatch) => {
      dispatch (saveProposal({ key: 'saveProposal', loading: true, data: null,error:null }))
      const obj = {
        id: "00000000-0000-0000-0000-000000000000",
        customerId: saveObj?.customerId,
        daoId: saveObj?.daoId,
        title: saveObj?.title,
        description:saveObj?.description,
        titleHash: saveObj.titleHash,
        startTime: saveObj?.startTime,
        endTime: saveObj?.endTime,
        proposalType:saveObj?.proposalType,
        CreatorAddress:saveObj?.CreatorAddress,
        image: saveObj?.image,
        creatorImage: saveObj?.creatorImage,
        proposalOptionDetails:saveObj?.proposalOptionDetails
      }
      let response = await apiCalls.postCreateProposal(obj)
      if(response.ok){
          dispatch (saveProposal({ key: 'saveProposal', loading: false, data: response.data,error:null }));
          callback ? callback(response.data) : ""
      }else{
          dispatch(saveProposal({ key: 'saveProposal', loading: false, data: null}));
          callback ? callback(response.data) : ""
      }
  }
  }
const getProposalViewData =(proposalId)=>{
  return async (dispatch) => {
      const response = await apiCalls.getProposalView(proposalId);
      if (response.ok) {
          dispatch(proposalview({ key: 'proposalview', loading: false, data: response.data,error:null }));
      }else{
        dispatch(proposalview({ key: 'proposalview', loading: false, data:{},error:apiCalls.isErrorDispaly(response)}));
      }
  }
}
const proposalVotersData = (pageNo, pageSize,id,callback) => {
  const skip = pageNo * pageSize - pageSize;
  const take = pageSize;
  return async (dispatch) => {
          let response = await apiCalls.getProposalVoters(take, skip,id)
          if(response.ok){
              if(response.data){ 
                  let MergeGridData = pageNo === 1 ? [...response.data] : [...response.data];
                  dispatch({ type: 'fetchVotersData', payload: MergeGridData,pageNo,loading:false });
                  } 
          }else{
              callback ? callback(response) : ""
          }
   }
}
let initialState = {
  daoCards: { loading: true, data: null, nextPage: 1 },
  lookUp: {},
  contractDetails: {},
  proViewData: {},
  proposalDetailsList:[],
  proposalDetails:{},
  saveProposal:{},
  proposalview:{},
  fetchVotersData:[],
  isCheckSeeMore:false

};

const proposalReducer = (state, action) => {
  if (!state) {
    state = {
      ...initialState,
      ...state
    }
  }


  switch (action.type) {
    case DAO_CARDS:
      return {
        ...state, daoCards: {
          data: action.payload.data,
          error: action.payload.error,
          loading: action.payload.loading,
          nextPage: action.payload.nextPage || state?.['daoCards'].nextPage
        },
      };
    case LOOKUP_CALL:
      state = { ...state, [action.payload]:{ ...state[action?.payload.key], ...action.payload }}//loading:action.payload,error:action.payload
      return state;
    case PROPOSAL_VIEW_DATA:
      state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
      return state;
    case CON_DETAILS_DATA:
      state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
      return state;
    case PROPOSAL_DETAILS_LIST:
        state = { ...state, proposalDetailsList:(action?.pageNo === 1 ? [...action?.payload] : [...state.proposalDetailsList,...action?.payload])}//loading:action.payload,error:action.payload
        return state;
    case PROPOSAL_DATA:
          state = { ...state, proposalDetails: action.payload }
          return state;
          case ISCHECKSEEMORE:
                          state = { ...state, isCheckSeeMore: action.payload }
                          return state;  
          case SAVE_PROPOSAL:
            state = { ...state, saveProposal: action.payload }
             return state;
          case PROPOSALVIEW:
            return {
              ...state, [action.payload.key]: {
                data: action.payload.data,
                error: action.payload.error,
                isLoading: action.payload.loading,
              },
            };
            case FETCH_VOTERS_DATA:
              state = { ...state, fetchVotersData:(action.pageNo === 1 ? [...action.payload] : [...state.fetchVotersData,...action.payload])}//loading:action.payload,error:action.payload
              return state; 
    default:
      return state;
  }
}



export default proposalReducer;
export { daoCards, setDaoCards,InvestorDaoCards,clearDaos, getLookUp, proposalViewData, contractDetailsData,getCardsProposalList,proposalData,getProposalViewData,fetchVotersData,proposalVotersData,saveProposalCall,isCheckSeeMore,proposalDetailsList };
