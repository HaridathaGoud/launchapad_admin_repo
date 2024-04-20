import React, { useState, useEffect,useReducer } from 'react';
import { useAccount, useConnect} from 'wagmi'
import {MetaMaskConnector} from "wagmi/connectors/metaMask"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate,useParams,Link } from 'react-router-dom';
import { daoCards,InvestorDaoCards, getCardsProposalList, getLookUp } from '../proposalReducer/proposalReducer';
import { connect, useSelector } from "react-redux";
import { Placeholder,Spinner } from 'react-bootstrap';
import FirstPraposal from '../firstpraposal.component/firstpraposal';
import nodata from '../../assets/images/no-data.png'
import Moment from 'react-moment';
import { useContract } from 'src/contract/useContract';
import { ethers } from 'ethers/lib';
import apiCalls from 'src/api/apiCalls';
import { isMobile } from 'react-device-detect';
import Alert from 'react-bootstrap/Alert';
import ToasterMessage from 'src/utils/toasterMessages';
import VotingContract from '../../contract/voting.json';
import moment from 'moment';
import ErrorPage from "../../../src/views/pages/unauthorizederror/unauthorizederror"
import PropTypes from 'prop-types'
import shimmers from '../shimmers/shimmers';

const polygonUrl=process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL:process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL
 
const reducers = (state, action) => {
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
        case 'votingContractAddress':
            return { ...state, votingContractAddress: action.payload };
    }
}
const take = 8;
const Dao = (props) => {
    const params = useParams()
    const pageSize = 10;
    const search = null
    const [success, setSuccess] = useState(null);
    const startDate="";
    const endDate = "";
    const [status, setStatus] = useState("all")
    const [pageNo, setPageNo] = useState(1);
    const [errorMsg, setErrorMsg] = useState(null)
    const [lookUpError,setLookUpError] = useState(false);
    const proposalData = useSelector((reducerState) => reducerState?.proposal?.proposalDetailsList);
    const loadData = useSelector((reducerState) => reducerState.proposal?.isCheckSeeMore);
    const UserInfo = useSelector(reducerState => reducerState.oidc?.profile?.profile)
    const  DaoDetail =  useSelector((state) => state?.proposal?.daoCards?.data);
    const [loading, setLoading]=useState(false)
    const [state, dispatch] = useReducer(reducers, { modalShow: false, status: "all", statusLu: [],
     date: null, dateStatus: false,votingContractAddress:'' })
        const [votingOwner,setVotingOwner]=useState(false)
    const { voteCalculation } = useContract();
    const [proposalCardList,setProposalCardList]=useState([])
        const [btnLoader, setBtnLoader] = useState(false);
    const [txHash,setTxHash]=useState(null)
    const isAdmin = useSelector(reducerState => reducerState.oidc?.adminDetails)
    const [loadMore,setLoadMore] = useState(false)
    const [hide,setHide] = useState(false)
    const [selection, setSelection]=useState(null);
        const { address, isConnected } = useAccount()
    const [shimmerLoading,setShimmerLoading] = useState(true)
    const { connect } = useConnect({
      connector: new MetaMaskConnector(),
    })
    useEffect(()=>{
        if(UserInfo?.role=="Admin" && !isAdmin.isInvestor){
            connect()
        }      
        window.scrollTo(0,0)
    },[address])

    const getDaosList = async (data,page) => {
        await props.trackWallet({
          page: page,
          take: take,
          data: data,
        });
      };
      const getInvestorDaosList = async (data,page) => {
        await props.trackDaoWallet({
          page: page,
          take: take,
          data: data ,
        },isAdmin?.id);
      };
    useEffect(() => {
        getApprovedProposalData(status)
        setLoading(true)
        props?.lookUp((callback) => {
            dispatch({ type: 'statusLu', payload: callback })
            setLoading(false)
            window.scrollTo(0,0)
        })
        if (isAdmin?.isInvestor === true) {
           getInvestorDaosList(null,1);
         }else{
            getDaosList(null,1);            
        }
    }, [address,txHash])


    useEffect(() => {
        const updatedList = proposalData.map((item) => {
            const currentDate =  moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
            const apiDateObj = moment(new Date(item.endDate)).format("X")
            const presentDate=moment(currentDate).format("X")
            const isCurrentGreater = presentDate > apiDateObj;
            return { ...item, dateEnded: isCurrentGreater };
          });
          setProposalCardList(updatedList);
          getDaoItem();
    }, [proposalData])

    const getDaoItem = () => {
        let daoData = DaoDetail?.find((item) => item?.daoId == params.id?.toLocaleLowerCase())
        dispatch({ type: 'votingContractAddress', payload: daoData?.contractAddress })
        getVotingOwner()
    }

    async function getVotingOwner() {
      let contractAddress=state.votingContractAddress;
        try {
            const _connector = window?.ethereum;
            const _provider = new ethers.providers.Web3Provider(_connector);
            const _contract = new ethers.Contract(contractAddress, VotingContract.abi, _provider);
            const _owner = await _contract.owner();
            const _ownerAddress = _owner.toLocaleLowerCase();
            if(_ownerAddress){
                setVotingOwner(true);
            }else{
                setVotingOwner(false);
            }
           
            return _ownerAddress
        } catch (error) {  
        }
    }
    const router = useNavigate();
    const handleRedirect = () => {
        router(`/dao/createpraposal/${params.id}`)

    }

    const handletest = (item) => {
        router(`/dao/proposalviewstatus/${item?.proposalId}/${params.id}`)

    }
    const handledashboard = () => {
           router('/dao/dashboard')
    }
    function handleCallback(callback) {
        if (callback.ok) {
          setShimmerLoading(false);
        }
      }

      function handleSecondCallback(callback) {
        if (callback?.ok) {
          setLoadMore(false);
          setHide(false);
          setShimmerLoading(false);
        }
      }

    const getApprovedProposalData = (e) => {
        setShimmerLoading(true)
        let data;
        if (e == "all") {
            data = e;
        } else {
            data = e?.target?.value;
            setStatus(data)
              setPageNo(2);
        }
        dispatch({ type: 'status', payload: data })
        if(lookUpError){
            setErrorMsg("Start date cannot be greater than the end date.")
            setShimmerLoading(false)
        }else if (data) {
            if (!state?.dateStatus && data != "all") {
                let pageNo = 1
                props?.proposalDetailsList(pageNo, pageSize, params.id, data?.toLowerCase(), search, startDate, endDate,handleCallback)
               
            } else if( state?.dateStatus){
                let pageNo = 1
                props?.proposalDetailsList(pageNo, pageSize, params.id, data?.toLowerCase(), search, state?.date, state?.dateStatus,handleCallback
                )
              
            }else {
                props?.proposalDetailsList(pageNo, pageSize, params.id, data?.toLowerCase(), search, startDate, endDate,handleCallback)
                let _pageNo = pageNo + 1;
                setPageNo(_pageNo);
               
            }
        }
    }    
    const getStartDateProposalData = (e) => {
        setLookUpError(false);
        let stData = e.target.value;
        dispatch({ type: 'date', payload: stData })
        if(stData &&  state.dateStatus < stData){
            setErrorMsg("Start date cannot be greater than the end date.")
            setLookUpError(true);
            window.scroll(0,0);
            setShimmerLoading(false)
          }else if(state?.dateStatus){
            setShimmerLoading(true)
            setErrorMsg(null)
            setPageNo(2)
            props.proposalDetailsList(1, pageSize, params.id, status, search, stData, state.dateStatus,handleCallback)
        }else if(!stData && state?.dateStatus){
            props.proposalDetailsList(1, pageSize, params.id, status, search, stData, state.dateStatus,handleCallback)
        }
    }

   

    const getEndDateProposalData = (e) => {
        setShimmerLoading(true)
        setLookUpError(false);
        let endData = e.target.value;
        dispatch({ type: 'dateStatus', payload: endData })
        if( endData &&  endData < state?.date){
            setErrorMsg("Start date cannot be greater than the end date.");
            setLookUpError(true);
            window.scroll(0,0);
            setShimmerLoading(false)
          }else if (state?.date && endData && status) {
            setErrorMsg(null)
            setPageNo(2)
            props.proposalDetailsList(1, pageSize, params.id, status, search, state?.date, endData,handleCallback)
            if (proposalData) {
                dispatch({ type: 'dateStatus', payload: endData })
            }
        }else if(!endData && status){
            setShimmerLoading(false)  
            props.proposalDetailsList(1, pageSize, params.id, status, search, state?.date, endData,handleCallback)
        }
    }

    const addProposalList = () => {     
        setShimmerLoading(true)    
        setLoadMore(true)
        setHide(true)
        if(state?.date && state?.dateStatus){
            let _pageNo = pageNo + 1;
            setPageNo(_pageNo);
            props.proposalDetailsList(pageNo, pageSize, params.id, status?.toLowerCase(), search, state?.date, state?.dateStatus,handleSecondCallback)
           
        }else{
            let _pageNo = pageNo + 1;
            setPageNo(_pageNo);
            setLoadMore(true)
            props.proposalDetailsList(pageNo, pageSize, params.id, status?.toLowerCase(), search, startDate, endDate,handleSecondCallback)
        } 
    };
    const handleCalculateVote=async(item)=>{
        setErrorMsg(null)
        setSelection(item?.proposalId)
         setBtnLoader(true)
        if (isConnected) {
            handleVote(item);
        }
        else {
            try {
                handleVote(item);
                setBtnLoader(false)
                setErrorMsg(null)
            } catch (error) {
                setErrorMsg(error?.reason);
                 setBtnLoader(false)
            }
        
        }
      }
    const handleVote=async(item)=>{
        setSuccess(null);
        setErrorMsg(null)
        setTxHash(null)
        try {
        const response = await voteCalculation(state?.votingContractAddress,item.titleHash);
        const _connector = window?.ethereum;
        const provider = new ethers.providers.Web3Provider(_connector);
            const txResponse = await provider.waitForTransaction(response.hash);
            setTxHash(response.hash)
            if (txResponse && txResponse.status === 0) {
                setErrorMsg('Transaction failed');
                setBtnLoader(false)
            } else {
                setSuccess("Vote calculated successfully");
                 setBtnLoader(false)
                 window.scroll(0,0);
                 props.proposalDetailsList(1, pageSize, params.id, status?.toLowerCase(), search, startDate, endDate,
                 handleCallback)
                 setTimeout(function () {
                    setSuccess(null);
                 }, 2000);
               
                                
            }
        } catch (error) {
            setErrorMsg(apiCalls.isErrorDispaly((error)));
            setBtnLoader(false)
            window.scroll(0,0);
                    }
        
    }
    const getRecorderValue = (recorder) => {
        const recorderValues = ["A", "B", "C", "D", "E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        return recorderValues[recorder - 1];
      };

    let startDateClass = "form-control form-select bg-none cust-br-style";

    if (isMobile) {
        if (!state?.date) {
            startDateClass += " mobile";
        } else if (state?.date) {
            startDateClass += " mobie-icon";
        } 
    }
    let endDateClass = "form-control bg-none form-select";

        if (isMobile) {
            if (!state?.dateStatus) {
                endDateClass += " mobile";
            } else if (state?.dateStatus) {
                endDateClass += " mobie-icon";
            }
        }

        const statusClassMapping = {
            Approved: 'icon-dao success-icon',
            Pending: 'icon pending-icon',
            Publishing: 'icon pending-icon',
            default: 'icon failed-close',
          };
         
          const statusTwoClassMapping = {
            Pending: "pending-text",
            Publishing: "pending-text",
            default: "close-text",
          };

    return (
        <>{params.id == "null" ? <ErrorPage /> :
            <>
                {loading && 
                <shimmers.ProposalsShimmer  count={3}/>
                }
                {!loading && <div className='dao-mt'>
                    
                    {errorMsg && (
                        <Alert variant="danger" className="cust-alert-design">
                            <div className='d-flex align-items-center justify-content-between mobile-d-block'>
                                <p style={{ color: 'red', }} className="d-flex align-items-start error-align mb-0">
                                    <span className="icon error-alert me-2 alert-error mt-0"></span>
                                    {errorMsg}
                                </p>
                                {txHash &&
                                    <div>
                                        <Link className='text-end hyper-text' to={`${polygonUrl}${txHash}`} >
                                            Click here </Link>
                                        <span className='mr-25 mb-0 ' style={{ color: 'red', }}>to see details</span></div>}
                            </div>
                        </Alert>
                    )}
                    {(proposalCardList != "" && state?.status?.toLocaleLowerCase() == "all"
                        || state?.status?.toLocaleLowerCase() == "approved"
                        || state?.status?.toLocaleLowerCase() == "declined"
                        || state?.status?.toLocaleLowerCase() == "pending"
                        || state?.status?.toLocaleLowerCase() == "closed"
                        || state?.dateStatus) ?

                        <div>

                            <Row>

                                <Col sm={12} xs={12} md={12} lg={12} xl={12} xxl={12} className='text-end'>
                                    <div className='md-d-flex justify-content-between align-items-center'>
                                        <div className='d-flex align-items-center title-width-fit'><span 
                                        className={`icon-dao back mr-2 cursor-pointer  ${UserInfo?.role == "Super Admin" && "c-pointer"}`} 
                                        onClick={handledashboard}></span>
                                            <span 
                                            className={`mb-0 ms-2 back-text cursor-pointer ${UserInfo?.role == "Super Admin" && "c-pointer"}`}
                                             onClick={handledashboard}>Proposals</span></div>

                                        {(UserInfo?.role == "Admin" ) && <Button className='filled-btn sm-m-2 c-pointer' onClick={handleRedirect}>Create Proposal</Button>}
                                    </div>

                                </Col>

                                <Col sm={12} xs={12} md={12} lg={12} xl={12} xxl={12}>
                                    <div className='kpi-list'>
                                        <Row className='align-items-center'>
                                            <Col sm={12} xs={12} md={2} lg={2} xl={2} xxl={2} className='col-mobile-p'>
                                                <Form.Select aria-label="Default select example" className='c-pointer text-white bg-select' onChange={(e) => getApprovedProposalData(e)} >
                                                    
                                                    {state?.statusLu?.map((item) => (
                                                        <option value={item?.name} key={item?.id}>{item?.name}</option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                            <Col sm={12} xs={12} md={8} lg={6} xl={6} xxl={6} className='col-mobile-p'>
                                                <div className='custom-datepicker'>
                                                    <Form.Group className="d-flex-1 position-relative" controlId="formBasicPassword">
                                                        <input type="date" 
                                                        className={startDateClass}
                                                          placeholder='Start Date' onChange={(e) => getStartDateProposalData(e)} />
                                                        <span></span>
                                                    </Form.Group>
                                                    <Form.Group className="d-flex-1 position-relative" controlId="formBasicPassword">
                                                        <input type="date" disabled={!state.date}
                                                         className={endDateClass} 
                                                         placeholder='End date' onChange={(e) => getEndDateProposalData(e)} />
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                        </Row>

                                    </div>


                                </Col>

                            </Row>

                            <Row className='mt-5'>
                                {success &&<div className="text-center toster-placement toaster-cust">
                                    <ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
                                </div>
                                }

                                {proposalCardList != "" &&
                                    <>
                                        {proposalCardList?.map((item) => (
                                            <Col sm={12} xs={12} md={12} lg={12} xl={12} xxl={12} className='mb-4' key={item?.id}>

                                                {shimmerLoading ?
                                                    <div className='status-section card-pading'>

                                                        <Col xs={12} className='d-flex align-items-center justify-content-between'>
                                                            <Placeholder xs={6} as='span' animation="glow">
                                                                <Placeholder xs={4} />
                                                            </Placeholder>
                                                            <Placeholder xs={6} as='span' animation="glow" className="text-end">
                                                                <Placeholder xs={4} />
                                                            </Placeholder>
                                                        </Col>
                                                        <Placeholder xs={6} as='span' animation="glow">
                                                            <Placeholder xs={6} />
                                                        </Placeholder>
                                                        <Placeholder xs={6} as='span' animation="glow">
                                                            <Placeholder xs={12} />
                                                        </Placeholder>
                                                        <Placeholder xs={6} as='span' animation="glow">
                                                            <Placeholder xs={12} />
                                                        </Placeholder>
                                                    </div>
                                                    : <div className='status-section card-pading'>
                                                        <div className='d-flex align-items-center justify-content-between mobile-d-block'>
                                                            <div className='d-flex align-items-center'>
                                                                <span className='icon-dao proposalicon mr-2'></span><h4 className='mb-0 ms-2 proposal-text text-primary c-pointer' onClick={() => handletest(item)}>{item?.title}</h4>
                                                            </div>
                                                            <div className='mobile-mt d-flex align-items-center'>
                                                                <span className={statusClassMapping[item?.status] || statusClassMapping.default}></span>
                                                                <span className={statusTwoClassMapping[item?.status] || statusTwoClassMapping.default}>{item?.status}</span>
                                                                {/* <span className={`${(item?.status == "Pending" || item?.status == "Publishing") ? "pending-text" : "close-text"}`}>{item?.status}</span> */}
                                                            </div>

                                                        </div>

                                                        <p className='para-text mt-3'>
                                                            {item?.description}</p>
                                                        <div className='d-flex align-items-center mb-block'>
                                                            <p className='para-text mt-3 me-3'>
                                                                Start Date: <b><Moment format={"DD/MM/YYYY HH:mm"}>{item?.startDate}</Moment></b>
                                                            </p>
                                                            <p className='para-text mt-3 me-3'>
                                                                End Date: <b> <Moment format={"DD/MM/YYYY HH:mm"}>{item?.endDate}</Moment></b>
                                                            </p>
                                                        </div>
                                                        <div className='option-style'>
                                                            {item?.options?.map((data) => (<div className='option-display card-op-diply db-crds-option status-cards-opt' key={data?.recorder}>
                                                                <p className='para-text mt-3 me-3'>{getRecorderValue(data.recorder)}. {data?.option} {`(${data?.votersCount || "0"})`}
                                                                </p>
                                                            </div>))}
                                                        </div>
                                                        {/* {UserInfo?.role == "Super Admin" ? "" : <>
                                                            {item.status == "Closed" ? "" : <>
                                                                {item?.dateEnded && <Button
                                                                    disabled={btnLoader}
                                                                    className='ustify-content-end' onClick={() => handleCalculateVote(item)}>
                                                                    <span>{(selection == item?.proposalId) && btnLoader && <Spinner size="sm" />}  </span>  Calculate Vote</Button>}
                                                            </>}</>} */}

                                                        {UserInfo.role ==="Super Admin" && item.status == "Closed" && item?.dateEnded &&
                                                         <div className='text-end'>
                                                             <Button
                                                        disabled={btnLoader}
                                                        className='justify-content-end filled-btn' onClick={() => handleCalculateVote(item)}>
                                                        <span>{(selection == item?.proposalId) && btnLoader && <Spinner size="sm" />}  </span>  Calculate Vote</Button>
                                                         </div>
                                                       }
                                                    </div>
                                                }
                                            </Col>))}
                                        <span className='text-center'>{loadMore && <Spinner size="sm" />}</span>
                                        {loadData && (
                                                <div className='addmore-title' onClick={addProposalList} role="button"><span className='c-pointer'>
                                                    {!hide && (<> <p className='mb-0 addmore-title'>See More</p><span className='icon-dao double-arrowblue'></span></>)}
                                                </span></div>
                                            )}
                                    </>}

                                    {proposalCardList == "" &&<div className='text-center'>
                                        <img src={nodata} width={60} alt=''/>
                                        <h4 className="text-center no-data-text">No Data Found</h4>
                                    </div>
                                }

                            </Row>

                        </div> : <FirstPraposal handleRedirect={handleRedirect} votingOwner={votingOwner} />}

                </div>}
            </>
        }</>
    );
}
Dao.propTypes = {
    lookUp: PropTypes.any,
    trackWallet: PropTypes.any,
    trackDaoWallet: PropTypes.any,
    proposalDetailsList: PropTypes.any,

  }

const connectDispatchToProps = (dispatch) => {
    return {
        proposalDetailsList: (pageNo,pageSize, params, status, search, startDate, endDate,callback) => {
            dispatch(getCardsProposalList(pageNo,pageSize, params, status, search, startDate, endDate,callback));
        },
        lookUp: (callback) => {
            dispatch(getLookUp(callback))
        },
        // trackWallet: (callback) => {
        //     dispatch(daoCards(callback));
        // },
        // trackWalletDao: (callback,inverstorId) => {
        //     dispatch(InvestorDaoCards(callback,inverstorId));
        // },
        trackWallet: (information) => {
            dispatch(daoCards(information));
          },
          trackDaoWallet: (information, inverstorId) => {
            dispatch(InvestorDaoCards(information, inverstorId));
          },
          clearDaos: () => {
            dispatch(clearDaos());
          },
    }
}

export default connect(null, connectDispatchToProps)(Dao);