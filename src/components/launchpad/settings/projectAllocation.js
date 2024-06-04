import React, { useEffect, useState,useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useSelector, connect } from 'react-redux';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import apiCalls from '../../../api/apiCalls';
import project from '../../../contract/project.json';
import Alert from 'react-bootstrap/Alert';
import ToasterMessage from 'src/utils/toasterMessages';
import { showSettings } from 'src/reducers/authReducer';
import store from 'src/store';
import { useConnectWallet } from 'src/hooks/useConnectWallet';
import { useAccount, useNetwork } from 'wagmi'
import { switchNetwork } from 'wagmi/actions';
import TiersData from './tiersdata';
import { projectDetailsData } from '../launchpadReducer/launchpadReducer';
import { fetchTiersData,settingsReducer,initialState } from './settingsReducer';
import PropTypes from 'prop-types'
import useEthers from 'src/utils/useEthers';
import { useContract } from 'src/contract/useContract';
import shimmers from 'src/components/shimmers/shimmers';
const polygonUrl = process.env.REACT_APP_ENV === "production" ? process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL : process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL
const stakingAdress  = process.env.REACT_APP_STAKING_CONTRACT;

const PeojectAllocation = (props) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { isConnected } = useAccount()
  const {getTotalStakers,getPoolDeatails} = useEthers()
  const { connectWallet } = useConnectWallet();
  const { totalstakescount,pooldetails} = useContract();
  const navigate = useNavigate();
  const params = useParams();
  const userId = sessionStorage.getItem('userId');
  const isAdmin = useSelector(reducerstate => reducerstate.oidc?.adminDetails);
  const tiersData = useSelector((state) => state.settings?.allTiersData)
  const [pageloader, setPageloader] = useState(false);
  const { chain } = useNetwork();

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
      const projectAddress = await apiCalls.getAllocation(params?.pId, isAdmin.id)
      if (projectAddress.ok) {
        const provider = new ethers.providers.Web3Provider(window?.ethereum)
        const factory = new ethers.Contract(data?.projectsViewModel?.contractAddress, project.abi, provider.getSigner());
        const address = [...projectAddress.data];
        const res = await factory.allocation(address, { gasLimit: 5000000 });//gasLimit:900000,gasPrice:300000

        dispatch({ type: 'setTxHash', payload: res.hash })
        res.wait().then(async () => {
          dispatch({ type: 'setSuccess', payload: "Allocated Successfully" })
          dispatch({ type: 'setIsTransactionSuccess', payload: true })
          setTimeout(function () {
            setIsTransactionSuccess(false)
            dispatch({ type: 'setIsTransactionSuccess', payload: false })
          }, 5000);
          dispatch({ type: 'setBtnLoader', payload: false })
        }).catch((err) => {
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

  const redirection = () => {
    store.dispatch(showSettings(false));
    navigate(`/launchpad/projects/${isAdmin?.id || userId}`)
  }

  const getDetails = async (Details) => {
    setPageloader(true);
    let detailsToUpdate = state.detailsFromContract ? state.detailsFromContract : {};
    const stakersInfo = await getTotalStakers(totalstakescount, stakingAdress);
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
      dispatch({ type: 'setErrorMgs', payload: poolInfoError })
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
      dispatch({ type: 'setErrorMgs', payload: stakersCountError })
    }
  };

  return (<>

    {pageloader &&
          <div className='mt-4 mb-4'>
            <shimmers.DaoCardShimmer count={6} />
          </div>
        }
    {!pageloader &&
      <div>
        <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => redirection()}>Projects</CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem>
            Settings
          </CBreadcrumbItem>
          <CBreadcrumbItem active>Allocation</CBreadcrumbItem>
        </CBreadcrumb>
        {state.errorMgs && (
          <Alert variant="danger" className='d-lg-flex justify-content-between mobile-block'>
            <div className="d-flex align-items-center flex-1">
              <span className="icon error-alert me-2 alert-error mt-0"></span>
              <p style={{ color: 'red', }} className="error-align mb-0 allocation-error">
                {state.errorMgs}
              </p>
            </div>
            {state.txHash && <div className='text-end'>
              <Link className='text-end hyper-text' to={`${polygonUrl}${state.txHash}`} target="_blank" >
                Click here </Link>
              <span className='mr-25 mb-0 ' style={{ color: 'red', }}>to see details</span>
            </div>}
          </Alert>
        )}

        <div className='text-end'>

          <Button className='filled-btn' onClick={() => getWalletAddress()} disabled={state.btnLoader} >{state.btnLoader && <Spinner size='sm' className={`${state.btnLoader ? "text-black" : "text-light"}`} />} Allocate</Button>
          <TiersData tiersData={tiersData?.data} detailsFromContract={state.detailsFromContract}/>

          {state.isTransactionSuccess && (
            <div >
              <ToasterMessage isShowToaster={state.isTransactionSuccess} success={state.success}></ToasterMessage>
            </div>
          )}

        </div>
      </div>}
  </>
  )

}
PeojectAllocation.propTypes = {
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
export default connect(connectStateToProps, connectDispatchToProps)(PeojectAllocation);
