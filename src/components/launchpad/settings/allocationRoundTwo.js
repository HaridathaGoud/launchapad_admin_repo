import React, { useEffect, useState,useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useSelector,connect } from 'react-redux';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import apiCalls from '../../../api/apiCalls';
import project from '../../../contract/project.json';
import Alert from 'react-bootstrap/Alert';
import ToasterMessage from 'src/utils/toasterMessages';
import { showSettings } from 'src/reducers/authReducer';
import store from 'src/store/index';
import { useAccount,useNetwork } from 'wagmi'
import { useConnectWallet } from 'src/hooks/useConnectWallet';
import { switchNetwork } from 'wagmi/actions';
import PropTypes from 'prop-types'
import useEthers from 'src/utils/useEthers';
import { useContract } from 'src/contract/useContract';
import { projectDetailsData } from '../launchpadReducer/launchpadReducer';
import shimmers from 'src/components/shimmers/shimmers';
import TiersData from './tiersdata';
import { initialState,settingsReducer,fetchTiersData } from './settingsReducer';
const polygonUrl=process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL:process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL
const stakingAdress  = process.env.REACT_APP_STAKING_CONTRACT;

const AllocationRoundTwo = (props) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const navigate = useNavigate();
  const params = useParams();
  const { isConnected } = useAccount()
  const { connectWallet } = useConnectWallet();
  const {getTotalStakers,getPoolDeatails,isRound1AllocationEnd,isRound2AllocationEnd} = useEthers()
  const { totalstakescount,pooldetails,roundoneallocation,roundtwoallocation} = useContract();
  const isAdmin = useSelector(stateinfo => stateinfo.oidc?.adminDetails);
  const userId = sessionStorage.getItem('userId');
  const { chain } = useNetwork();
  const [pageloader, setPageloader] =  useState(true);
  const tiersData = useSelector((statedata) => statedata.settings?.allTiersData)

  useEffect(() => {
    setPageloader(true);
    props.fetchAllTiersData()
    props.projectDetailsReducerData(params?.pId, (callback) => {
      dispatch({ type: 'setData', payload: callback.data })
      setPageloader(false);
      getDetails(callback.data?.projectsViewModel)
    })
  }, [params?.pId])
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
      dispatch({ type: 'setBtnLoader', payload: false })
      dispatch({ type: 'setErrorMgs', payload: "User Rejected Transaction." })
      throw new Error("User Rejected Transaction.");
    }
  }
  const getWalletAddress = async () => {
    dispatch({ type: 'setErrorMgs', payload: null })
    dispatch({ type: 'setBtnLoader', payload: true })
    try {
      if (isConnected) {
        await handleNetwork();
      } else {
        await connectWallet();
      }
      updateData();
    } catch (error) {
      dispatch({ type: 'setErrorMgs', payload: "User Rejected Transaction." })
      dispatch({ type: 'setBtnLoader', payload: false })
    }
  }
  const updateData = async () => {
    dispatch({ type: 'setErrorMgs', payload: null })
    try {
      dispatch({ type: 'setSuccess', payload: null })
      dispatch({ type: 'setBtnLoader', payload: true })
      dispatch({ type: 'setTxHash', payload: null })
      const projectAddress = await apiCalls.getAllocation(params?.pId)
      if (projectAddress.ok) {
        const provider = new ethers.providers.Web3Provider(window?.ethereum)
        const factory = new ethers.Contract(state.data?.projectsViewModel?.contractAddress, project.abi, provider.getSigner());
        const res = await factory.allocationRoundTwo({gasLimit:900000,gasPrice:300000});

        dispatch({ type: 'setTxHash', payload: res.hash })
        res.wait().then(async (receipt) => {
          dispatch({ type: 'setSuccess', payload: "Allocated Successfully." })
          dispatch({ type: 'setIsTransactionSuccess', payload: true})
          setTimeout(function () {
            dispatch({ type: 'setIsTransactionSuccess', payload: false})
            getDetails(state.data?.projectsViewModel)
          }, 4000);
          dispatch({ type: 'setBtnLoader', payload: false })
        }).catch(() => {
          dispatch({ type: 'setBtnLoader', payload: false })
          dispatch({ type: 'setErrorMgs', payload: apiCalls.isErrorDispaly(res) })
        })
      } else {
        dispatch({ type: 'setBtnLoader', payload: false })
        dispatch({ type: 'setErrorMgs', payload: apiCalls.isErrorDispaly(projectAddress) })
      }
    } catch (error) {
      dispatch({ type: 'setBtnLoader', payload: false })
      dispatch({ type: 'setErrorMgs', payload: apiCalls.isErrorDispaly(error) })
    }
  }

  const redirection=()=>{
    store.dispatch(showSettings(false));
    navigate(`/launchpad/projects/${isAdmin?.id||userId}`)
  }

  const getDetails = async (Details) => {
    setPageloader(true);
    let detailsToUpdate = state.detailsFromContract ? state.detailsFromContract : {};
    const stakersInfo = await getTotalStakers(totalstakescount, stakingAdress);
    if(Details.tokenType ==="ERC-20"){
      const round1allocation = await isRound1AllocationEnd(roundoneallocation, Details.contractAddress)
      const round2allocation = await isRound2AllocationEnd(roundtwoallocation, Details.contractAddress)
      updateRoud1Allocation(detailsToUpdate,round1allocation)
      updateRoud2Allocation(detailsToUpdate,round2allocation)
    }
    const { poolInfo, tierParticipants, poolInfoError } = await getAllPoolDetails();
    setPageloader(false);
    updateStakersCount(detailsToUpdate, stakersInfo);
    
    if (poolInfo?.length > 0) {
      detailsToUpdate = {
        ...detailsToUpdate,
        poolInfo: poolInfo,
        ...tierParticipants
      };
    } else {
      dispatch({ type: 'setErrorMgs', payload: poolInfoError !==0 ?poolInfoError:'' })
    }
    if (Object.keys(detailsToUpdate)?.length > 0) {
      dispatch({ type: 'setDetailsFromContract', payload: detailsToUpdate })
    }
  };

  const getAllPoolDetails = async () => {
    let poolInfo = [];
    let poolInfoError = null;
    let tier1Participants = 0;
    let tier2Participants = 0;
    let tier3Participants = 0;
    let tier4Participants = 0;
    let tier5Participants = 0;
    let tier6Participants = 0;

    for (let tierId = 1; tierId <= 6; tierId++) {
      let tierParticipants = 0;
      for (let poolLevel = 1; poolLevel <= 3; poolLevel++) {
        const poolData = await getPoolDeatails(pooldetails, stakingAdress, tierId, poolLevel);
        if (poolData?.poolInfo !== null || poolData?.poolInfo === 0) {
          tierParticipants += poolData?.poolInfo;
          poolInfo.push({ tierId, poolLevel, participants: poolData?.poolInfo });
        } else {
          poolInfoError = poolData?.poolInfoError;
        }
      }

      if (tierId === 1) {
        tier1Participants = tierParticipants;
      } else if (tierId === 2) {
        tier2Participants = tierParticipants;
      } else if (tierId === 3) {
        tier3Participants = tierParticipants;
      } else if (tierId === 4) {
        tier4Participants = tierParticipants;
      } else if (tierId === 5) {
        tier5Participants = tierParticipants;
      }else if (tierId === 6) {
        tier6Participants = tierParticipants;
      }
    }

    return { poolInfo, tierParticipants: { 
      tier1Participants, tier2Participants, tier3Participants,tier4Participants, tier5Participants, tier6Participants
     }, poolInfoError };
  };
  
  const updateStakersCount = (detailsToUpdate, stakersInfo) => {
    const stakersCount = stakersInfo?.stakersCount;
    const stakersCountError = stakersInfo?.stakersCountError;
    if (stakersCount) {
      detailsToUpdate.stakersCount = stakersCount;
    } else {
      dispatch({ type: 'setErrorMgs', payload: stakersCountError !==0?stakersCountError:'' })
    }
  };
  const updateRoud1Allocation = (detailsToUpdate, round1allocation) => {
    const isAllocated = round1allocation?.isallocationEnd;
    if (isAllocated) {
      detailsToUpdate.isAllocated = isAllocated;
    } else {
      dispatch({ type: 'setErrorMgs', payload: 'Round one allocation not yet completed' })
    }
  };
  const updateRoud2Allocation = (detailsToUpdate, round2allocation) => {
    const isAllocated = round2allocation?.isround2allocationEnd;
    if (isAllocated) {
      detailsToUpdate.isround2allocationEnd = isAllocated;
      dispatch({ type: 'setErrorMgs', payload: 'Round two allocation completed' })
    }
  };
  const clearErrorMsg=()=>{
    dispatch({ type: 'setErrorMgs', payload: null }) 
  }
  return (
    <div>

      {pageloader &&
          <div className='mt-4 mb-4'>
            <shimmers.TiersCardsShimmer count={6} />
          </div>
        }
      {!pageloader &&
        <>
          <CBreadcrumb>
            <CBreadcrumbItem>
              <CLink href="#" onClick={() => redirection()}>Projects</CLink>
            </CBreadcrumbItem>
            <CBreadcrumbItem>
              Settings
            </CBreadcrumbItem>
            <CBreadcrumbItem active>Round Two Allocation</CBreadcrumbItem>
          </CBreadcrumb>
          {state.errorMgs && (
            <Alert variant="danger">
            <div className='d-flex gap-4'>
              <div className='d-flex gap-2 flex-1'>
                <span className='icon error-alert'></span>
                <p className='m1-2' style={{ color: 'red' }}>{state.errorMgs}</p>
              </div>
              {state.txHash && <div className='text-end'>
                <Link className='text-end hyper-text' to={`${polygonUrl}${state.txHash}`} target="_blank" >
                  Click here </Link>
                <span className='mr-25 mb-0 ' style={{ color: 'red', }}>to see details</span>
              </div>}
              <span className='icon close-red' onClick={clearErrorMsg}></span>
            </div>
          </Alert>
          )}
           
          <TiersData tiersData={tiersData?.data} detailsFromContract={state.detailsFromContract} projectData={state.data}/>
          <div className='text-end pb-4 pe-5' >
          <Button className='filled-btn' onClick={() => getWalletAddress()}
            disabled={
              (state.data.projectsViewModel.tokenType === "ERC-20" && state.detailsFromContract?.isAllocated !== 1)||
               (state.detailsFromContract?.isround2allocationEnd === 'true'||state.detailsFromContract?.isround2allocationEnd ===1) || 
               state.btnLoader}>
            {state.btnLoader &&
              <Spinner size='sm' className={`${state.btnLoader ? "text-black" : "text-light"}`} />}
            Allocate
          </Button>
          {state.isTransactionSuccess && (
            <div >
              <ToasterMessage isShowToaster={state.isTransactionSuccess} success={state.success}></ToasterMessage>
            </div>
          )}
        </div>
        </>
      }
    </div>
  )
}
AllocationRoundTwo.propTypes = {
  fetchAllTiersData: PropTypes.any,
  projectDetailsReducerData: PropTypes.any,
}
const connectStateToProps = ({ oidc, launchpad, settings }) => {
  return { oidc: oidc, launchpad: launchpad, settings: settings };
};
const connectDispatchToProps = (dispatch) => {
  return {
    fetchAllTiersData: () => {
      dispatch(fetchTiersData())
    },
    projectDetailsReducerData: (id, callback) => {
      dispatch(projectDetailsData(id, callback))
    },
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(AllocationRoundTwo);

