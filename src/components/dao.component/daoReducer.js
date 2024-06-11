
export const daoInitialState = {
    modalShow: false,
    date:null,
    statusLu:[],
    status: "all",
    dateStatus:false,
    daoDetails:{},
    success:null,
    pageNo:1,
    errorMsg:null,
    lookUpError:false,
    loading:false,
    votingOwner: false,
    proposalCardList:[] ,
    btnLoader:false ,
    txHash: null,
    loadMore:false ,
    hide: false,
    selection: null,
    shimmerLoading:true,

  };


const daoReducers = (state=daoInitialState, action) => {
    switch (action.type) {
        case 'modalShow':
            return { ...state, modalShow: action.payload };
        case 'date':
            return { ...state, date: action.payload };
        case 'statusLu':
            return { ...state, statusLu: action.payload };
        case 'status':
            return { ...state, status: action.payload };
        case 'dateStatus':
            return { ...state, dateStatus: action.payload };
        case 'setDaoDeatils':
            return { ...state, daoDetails: action.payload };
        case 'setSuccess':
            return { ...state, success: action.payload };
        case 'setPageNo':
            return { ...state, pageNo: action.payload };
        case 'setErrorMsg':
            return { ...state, errorMsg: action.payload };
        case 'setLookUpError':
            return { ...state, lookUpError: action.payload };
        case 'setLoading':
            return { ...state, loading: action.payload };
        case 'setVotingOwner':
            return { ...state, votingOwner: action.payload };
        case 'setProposalCardList':
            return { ...state, proposalCardList: action.payload };
        case 'setBtnLoader':
            return { ...state, btnLoader: action.payload };
        case 'setTxHash':
            return { ...state, txHash: action.payload };
        case 'setLoadMore':
            return { ...state, loadMore: action.payload };
        case 'setHide':
            return { ...state, hide: action.payload };
        case 'setSelection':
            return { ...state, selection: action.payload };
        case 'setShimmerLoading':
            return { ...state, shimmerLoading: action.payload };
    }
    return state;
}
export default daoReducers;