import React, { useState, useEffect,useReducer,useMemo } from 'react';
import { useAccount,useNetwork} from 'wagmi'
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
import { useConnectWallet } from '../../hooks/useConnectWallet';
import { switchNetwork } from 'wagmi/actions';
import useEthers from '../../utils/useEthers'
import ConvertLocalFormat from 'src/utils/convertToLocal';
import daoReducers, { daoInitialState } from './daoReducer';
const polygonUrl=process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL:process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL

const take = 8;
const Dao = (props) => {
    const params = useParams() 
    const pageSize = 10;
    const search = null
    const [state, dispatch] = useReducer(daoReducers, daoInitialState);
    const startDate="";
    const endDate = "";
    const router = useNavigate();
    const { voteCalculation ,readRewardBalance, getOwner,mintedCountt,getDaoOwner} = useContract();
    const isAdmin = useSelector(reducerState => reducerState.oidc?.adminDetails)
    const proposalData = useSelector((reducerState) => reducerState?.proposal?.proposalDetailsList);
    const loadData = useSelector((reducerState) => reducerState.proposal?.isCheckSeeMore);
    const UserInfo = useSelector(reducerState => reducerState.oidc?.profile?.profile)
    const DaoDetail =  useSelector((state) => state?.proposal?.daoCards?.data);
    const { address, isConnected } = useAccount()
    const { connectWallet } = useConnectWallet();
    const { chain } = useNetwork();
    const {getRewardBalance,getOwnerAddress,getmintedCount,getDaoOwnerAddress} = useEthers()
    const [userDetailsFromContract, setUserDetailsFromContract] =useState(null);
    async function handleNetwork() {
      try {
        if (chain?.id !== Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID)) {
          await switchNetwork({
            chainId: Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID) || 0,
          });
        } else {
          return true;
        }
      } catch (error) {
        dispatch({ type: 'setErrorMsg', payload: "User rejected transaction." })
        throw new Error('User rejected transaction.');
      }
    }
    useEffect(()=>{
        connectCheck()
    },[isConnected, address])

    const connectCheck=async()=>{
        if (isConnected) {
           await handleNetwork();
         } else {
           await connectWallet();
         }
    }
    useEffect(() => {
        getApprovedProposalData(state?.status)
        dispatch({ type: 'setLoading', payload: true })
        props?.lookUp((callback) => {
            dispatch({ type: 'statusLu', payload: callback })
            dispatch({ type: 'setLoading', payload: false })
            window.scrollTo(0,0)
        })
        if (isAdmin?.isInvestor === true) {
           getInvestorDaosList(null,1);
         }else{
            getDaosList(null,1);            
        }
        getDaoItem();
    }, [isAdmin?.id])
   
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
        const updatedList = proposalData.map((item) => {
            const currentDate =  moment(new Date()).utc().format("YYYY-MM-DDTHH:mm:ss");
            const apiDateObj = moment(new Date(item.endDate)).format("X")
            const presentDate=moment(currentDate).format("X")
            const isCurrentGreater = presentDate > apiDateObj;
            return { ...item, dateEnded: isCurrentGreater };
          });
          dispatch({ type: 'setProposalCardList', payload: updatedList })
    }, [proposalData])

    const getDaoItem = async () => {
        let daoData = DaoDetail?.find((item) => item?.daoId == params.id?.toLocaleLowerCase())
        dispatch({ type: 'setDaoDeatils', payload: daoData })
        if(isConnected&& daoData){
            await connectCheck()
           await getDetails(daoData)
           await getVotingOwner(daoData)
        }else{
            await connectCheck() ;
            await getDetails(daoData);
            await getVotingOwner(daoData);
        }
    }
    async function getVotingOwner(daoData) {
      let contractAddress=daoData?.contractAddress;
        try {
            const _connector = window?.ethereum;
            const _provider = new ethers.providers.Web3Provider(_connector);
            const _contract = new ethers.Contract(contractAddress, VotingContract.abi, _provider);
            const _owner = await _contract.owner();
            const _ownerAddress = _owner.toLocaleLowerCase();
            if(_ownerAddress){
                dispatch({ type: 'setVotingOwner', payload: true })
            }else{
                dispatch({ type: 'setVotingOwner', payload: false })
            }
            return _ownerAddress
        } catch (error) {  
        }
    }
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
          dispatch({ type: 'setShimmerLoading', payload: false})
        }
      }

      function handleSecondCallback(callback) {
        if (callback?.ok) {
          dispatch({ type: 'setLoadMore', payload: false})
          dispatch({ type: 'setHide', payload: false})
          dispatch({ type: 'setShimmerLoading', payload: false})
        }
      }

    const getApprovedProposalData = (e) => {
        dispatch({ type: 'setShimmerLoading', payload: true})
        let data;
        if (e == "all") {
            data = e;
        } else {
            data = e?.target?.value;
            dispatch({ type: 'setStatus', payload: data })
            dispatch({ type: 'setPageNo', payload: 2 })
        }
        dispatch({ type: 'status', payload: data })
        if(state?.lookUpError){
            dispatch({ type: 'setErrorMsg', payload: "Start date cannot be greater than the end date." })
            dispatch({ type: 'setShimmerLoading', payload: false})
        }else if (data) {
            dispatch({ type: 'setShimmerLoading', payload: true})
            if (!state?.dateStatus && data !== "all") {
                let pageNo = 1
                props?.proposalDetailsList(pageNo, pageSize, params.id, data?.toLowerCase(), search, startDate, endDate,handleCallback)
                dispatch({ type: 'setShimmerLoading', payload: false})
            } else if( state?.dateStatus){
                let pageNo = 1
                props?.proposalDetailsList(pageNo, pageSize, params.id, data?.toLowerCase(), search, state?.date, state?.dateStatus,handleCallback)
                dispatch({ type: 'setShimmerLoading', payload: false})
            }else {
                let pageNo = 1
                props?.proposalDetailsList(pageNo, pageSize, params.id, data?.toLowerCase(), search, startDate, endDate,handleCallback)
                let _pageNo = pageNo + 1;
                dispatch({ type: 'setPageNo', payload: _pageNo })
                dispatch({ type: 'setShimmerLoading', payload: false})
            }
        }
    }    
    const getStartDateProposalData = (e) => {
        dispatch({ type: 'setLookUpError', payload: false })
        let stData = e.target.value;
        dispatch({ type: 'date', payload: stData })
        if(stData &&  state.dateStatus < stData){
            dispatch({ type: 'setErrorMsg', payload: "Start date cannot be greater than the end date." })
            dispatch({ type: 'setLookUpError', payload: true })
            window.scroll(0,0);
            dispatch({ type: 'setShimmerLoading', payload: false})
          }else if(stData && state?.dateStatus){
            dispatch({ type: 'setShimmerLoading', payload: true})
            dispatch({ type: 'setErrorMsg', payload: null})
            dispatch({ type: 'setPageNo', payload: 2 })
            props.proposalDetailsList(1, pageSize, params.id, state?.status, search, stData, state.dateStatus,handleCallback)
        }else if(!stData && state?.dateStatus){
            props.proposalDetailsList(1, pageSize, params.id,  state?.status, search, stData, state.dateStatus,handleCallback)
        }
    }
    const getEndDateProposalData = (e) => {
        dispatch({ type: 'setShimmerLoading', payload: true})
        dispatch({ type: 'setLookUpError', payload: false })
        let endData = e.target.value;
        dispatch({ type: 'dateStatus', payload: endData })
        if( endData &&  endData < state?.date){
            dispatch({ type: 'setErrorMsg', payload: "Start date cannot be greater than the end date."})
            dispatch({ type: 'setLookUpError', payload: true })
            window.scroll(0,0);
            dispatch({ type: 'setShimmerLoading', payload: false})
          }else if (state?.date && endData &&  state?.status) {
            dispatch({ type: 'setErrorMsg', payload: null})
            dispatch({ type: 'setPageNo', payload: 2 })
            props.proposalDetailsList(1, pageSize, params.id,  state?.status, search, state?.date, endData,handleCallback)
            if (proposalData) {
                dispatch({ type: 'dateStatus', payload: endData })
            }
        }else if(!endData &&  state?.status){
            dispatch({ type: 'setShimmerLoading', payload: false})
            props.proposalDetailsList(1, pageSize, params.id,  state?.status, search, state?.date, endData,handleCallback)
        }
    }

    const addProposalList = () => {     
        dispatch({ type: 'setShimmerLoading', payload: true}) 
        dispatch({ type: 'setLoadMore', payload: true})
        dispatch({ type: 'setHide', payload: true})
        if(state?.date && state?.dateStatus){
            let _pageNo = state?.pageNo + 1;
            dispatch({ type: 'setPageNo', payload: _pageNo })
            props.proposalDetailsList(state?.pageNo, pageSize, params.id,  state?.status?.toLowerCase(), search, state?.date, state?.dateStatus,handleSecondCallback)
           
        }else{
            let _pageNo = state?.pageNo + 1;
            dispatch({ type: 'setPageNo', payload: _pageNo })
            dispatch({ type: 'setLoadMore', payload: true})
            props.proposalDetailsList(state?.pageNo, pageSize, params.id,  state?.status?.toLowerCase(), search, startDate, endDate,handleSecondCallback)
        } 
    };

    const handleCalculateVote=async(item)=>{
        dispatch({ type: 'setErrorMsg', payload: null})
        dispatch({ type: 'setSelection', payload: item?.proposalId})
         dispatch({ type: 'setBtnLoader', payload: true})
    try {
      if (isConnected) {
        await handleNetwork();
      } else {
        await connectWallet();
      }
      await  handleVote(item);
    } catch (error) {
      dispatch({ type: 'setErrorMsg', payload: "User rejected transaction."})
      dispatch({ type: 'setBtnLoader', payload: false})
    }
      }
    const handleVote = async (item) => {
        dispatch({ type: 'setSuccess', payload: null })
        dispatch({ type: 'setErrorMsg', payload: null})
        dispatch({ type: 'setTxHash', payload: null})
        try {
            const response = await voteCalculation(state?.daoDetails?.votingContractAddress, item.titleHash);
            const _connector = window?.ethereum;
            const provider = new ethers.providers.Web3Provider(_connector);
            const txResponse = await provider.waitForTransaction(response.hash);
            dispatch({ type: 'setTxHash', payload: (response.hash)})
            if (txResponse && txResponse.status === 0) {
                dispatch({ type: 'setErrorMsg', payload: 'Transaction failed'})
                dispatch({ type: 'setBtnLoader', payload: false})
            } else {
                dispatch({ type: 'setSuccess', payload: "Vote calculated successfully." })
                dispatch({ type: 'setBtnLoader', payload: false})
                window.scroll(0, 0);
                props.proposalDetailsList(1, pageSize, params.id,  state?.status?.toLowerCase(), search, startDate, endDate,
                    handleCallback)
                setTimeout(function () {
                    dispatch({ type: 'setSuccess', payload: null })
                }, 2000);
            }
        } catch (error) {
            dispatch({ type: 'setErrorMsg', payload:apiCalls.isErrorDispaly((error))})
            dispatch({ type: 'setBtnLoader', payload: false})
            window.scroll(0, 0);
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


    const getDetails = async (data) => {
        dispatch({ type: 'setLoading', payload: true })
        let detailsToUpdate = userDetailsFromContract || {};
        let amount, balanceError, ownerAddress, ownerError, mintedCount, mintedCountError, daoownerAddress, daoownerError;
        
        const ownerInfo = await getOwnerAddress(getOwner, data?.contractAddress);
        ownerAddress = ownerInfo.ownerAddress;

        const daoownerInfo = await getDaoOwnerAddress(getDaoOwner, data?.votingContractAddress);
        daoownerAddress = daoownerInfo.daoownerAddress;
        daoownerError = daoownerInfo.error;

        ownerError = ownerInfo.error;
        if (data.tokenType === 'ERC-20') {
            const rewardBalance = await getRewardBalance(readRewardBalance, data?.contractAddress,address);
            amount = rewardBalance.amount;
            balanceError = rewardBalance.balanceError;

        } else {
            const mintedInfo = await getmintedCount(mintedCountt, data?.contractAddress);
            mintedCount = mintedInfo.mintedCount;
            mintedCountError = mintedInfo.mintedCountError;
        }
        if (amount) {
            detailsToUpdate = { ...detailsToUpdate, balance: amount };
            setUserDetailsFromContract({ ...detailsToUpdate, balance: amount });
        } else {
            dispatch({ type: 'setErrorMsg', payload: balanceError })
        }
        if (ownerAddress) {
            detailsToUpdate = { ...detailsToUpdate, owner: ownerAddress };
        } else {
            dispatch({ type: 'setErrorMsg', payload: ownerError })
        }
        if (daoownerAddress) {
            detailsToUpdate = { ...detailsToUpdate, daoowner: daoownerAddress };
        } else {
            dispatch({ type: 'setErrorMsg', payload: daoownerError })
        }
        if (mintedCount) {
            detailsToUpdate = { ...detailsToUpdate, mintedCount: mintedCount };
        } else {
            dispatch({ type: 'setErrorMsg', payload: mintedCountError })
        }
        if (Object.keys(detailsToUpdate).length > 0) {
            setUserDetailsFromContract(detailsToUpdate);
        }
        dispatch({ type: 'setLoading', payload: false })
    };
    const isEligibleForProposal = useMemo(() => {
        return (
            isConnected &&
            address &&
            isAdmin?.isInvestor &&
            state?.daoDetails?.contractAddress &&
            (userDetailsFromContract?.owner === address ||
                (state?.daoDetails?.tokenType === 'ERC-20' && userDetailsFromContract?.balance >=
                    Number(state.daoDetails?.proposalCreationBalance)) ||
                (state?.daoDetails?.tokenType === 'ERC-721' && userDetailsFromContract?.mintedCount >=
                    Number(state.daoDetails?.proposalCreationBalance)))
        )
    }, [address, isConnected, userDetailsFromContract, state?.daoDetails, isAdmin?.isInvestor]);
 
    return (
        <>{params.id == "null" ? <ErrorPage /> :
            <>
                {state?.loading && 
                <shimmers.ProposalsShimmer  count={3}/>
                }
                {!state?.loading && <div className='dao-mt'>
                    {state?.errorMsg && (
                        <Alert variant="danger" className="cust-alert-design">
                            <div className='d-flex align-items-center justify-content-between mobile-d-block'>
                                <p style={{ color: 'red', }} className="d-flex align-items-start error-align mb-0">
                                    <span className="icon error-alert me-2 alert-error mt-0"></span>
                                    {state?.errorMsg}
                                </p>
                                {state?.txHash &&
                                    <div>
                                        <Link className='text-end hyper-text' to={`${polygonUrl}${state?.txHash}`} >
                                            Click here </Link>
                                        <span className='mr-25 mb-0 ' style={{ color: 'red', }}>to see details</span></div>}
                            </div>
                        </Alert>
                    )}
                    {(state?.proposalCardList != "" && state?.status?.toLocaleLowerCase() == "all"
                        || state?.status?.toLocaleLowerCase() == "approved"
                        || state?.status?.toLocaleLowerCase() == "declined"
                        || state?.status?.toLocaleLowerCase() == "pending"
                        || state?.status?.toLocaleLowerCase() == "closed"
                        || state?.status?.toLocaleLowerCase() =="publishing"
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

                                        {(userDetailsFromContract?.owner===address ||isEligibleForProposal) && <Button className='filled-btn sm-m-2 c-pointer' onClick={handleRedirect}>Create Proposal</Button>}
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
                                {state?.success &&<div className="text-center toster-placement toaster-cust">
                                    <ToasterMessage isShowToaster={state?.success} success={state?.success}></ToasterMessage>
                                </div>
                                }
                                {state?.proposalCardList != "" &&
                                    <>
                                        {state?.proposalCardList?.map((item) => (
                                            <Col sm={12} xs={12} md={12} lg={12} xl={12} xxl={12} className='mb-4' key={item?.id}>

                                                {state?.shimmerLoading ?
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
                                                                Start Date: <b>{ConvertLocalFormat(item?.startDate)}</b>
                                                            </p>
                                                            <p className='para-text mt-3 me-3'>
                                                                End Date: <b> {ConvertLocalFormat(item?.endDate)}</b>
                                                            </p>
                                                        </div>
                                                        <div className='option-style'>
                                                            {item?.options?.map((data) => (<div className='option-display card-op-diply db-crds-option status-cards-opt' key={data?.recorder}>
                                                                <p className='para-text mt-3 me-3'>{getRecorderValue(data.recorder)}. {data?.option} {`(${data?.votersCount || "0"})`}
                                                                </p>
                                                            </div>))}
                                                        </div>

                                                        {userDetailsFromContract?.daoowner===address && UserInfo.role ==="Admin" && item.status == "Closed" && item?.dateEnded &&
                                                         <div className='text-end'>
                                                             <Button
                                                        disabled={state?.btnLoader}
                                                        className='justify-content-end filled-btn' onClick={() => handleCalculateVote(item)}>
                                                        <span>{(state?.selection == item?.proposalId) && state?.btnLoader && <Spinner size="sm" />}  </span>  Calculate Vote</Button>
                                                         </div>
                                                       }
                                                    </div>
                                                }
                                            </Col>))}
                                        <span className='text-center'>{state?.loadMore && <Spinner size="sm" />}</span>
                                        {loadData && (
                                                <div className='addmore-title' onClick={addProposalList} role="button"><span className='c-pointer'>
                                                    {!state?.hide && (<> <p className='mb-0 addmore-title'>See More</p><span className='icon-dao double-arrowblue'></span></>)}
                                                </span></div>
                                            )}
                                    </>}
                                    {state?.proposalCardList == "" &&<div className='text-center'>
                                        <img src={nodata} width={60} alt=''/>
                                        <h4 className="text-center no-data-text">No Data Found</h4>
                                    </div>
                                }
                            </Row>
                        </div> : <FirstPraposal handleRedirect={handleRedirect} isEligibleForProposal={ isConnected && userDetailsFromContract?.owner=== address ||isEligibleForProposal} />}
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