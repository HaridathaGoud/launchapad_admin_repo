import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Image, Spinner } from 'react-bootstrap';
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
import platinum from '../../../assets/images/platinum.svg'
import daimond from '../../../assets/images/daimond.svg'
import TiersData from './tiersdata';
import { projectDetailsData } from '../launchpadReducer/launchpadReducer';
import { fetchTiersData, } from './settingsReducer';
import PropTypes from 'prop-types'
const polygonUrl = process.env.REACT_APP_ENV === "production" ? process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL : process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL


const PeojectAllocation = (props) => {
  const { isConnected } = useAccount()
  const { connectWallet } = useConnectWallet();
  const navigate = useNavigate();
  const params = useParams();
  const userId = sessionStorage.getItem('userId');
  const isAdmin = useSelector(reducerstate => reducerstate.oidc?.adminDetails);
  const tiersData = useSelector((state) => state.settings?.allTiersData)
  const [btnLoader, setBtnLoader] = useState(false);
  const [errorMgs, setErrorMgs] = useState(null);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [success, setSuccess] = useState(null);
  const [txHash, setTxHash] = useState(null)
  const { chain } = useNetwork();
  const [data, setData] = useState();
  const [pageloader, setPageLoader] = useState(false);
  useEffect(() => {
    setPageLoader(true);
    props.fetchAllTiersData()
    props.projectDetailsReducerData(params?.pId, (callback) => {
      setData(callback.data)
      setPageLoader(false);
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
      setBtnLoader(false)
      setErrorMgs("User rejected transaction.");
      throw new Error('User rejected transaction.');
    }
  }
  const getWalletAddress = async () => {
    setErrorMgs(null);
    setBtnLoader(true);
    try {
      if (isConnected) {
        await handleNetwork();
      } else {
        await connectWallet();
      }
      updateData();
    } catch (error) {
      setErrorMgs("User rejected transaction.");
      setBtnLoader(false);
    }
  }
  const updateData = async () => {
    setErrorMgs(null);
    try {
      setSuccess(null);
      setBtnLoader(true)
      setTxHash(null)
      const projectAddress = await apiCalls.getAllocation(params?.pId, isAdmin.id)
      if (projectAddress.ok) {
        const provider = new ethers.providers.Web3Provider(window?.ethereum)
        const factory = new ethers.Contract(data?.projectsViewModel?.contractAddress, project.abi, provider.getSigner());
        const address = [...projectAddress.data];
        const res = await factory.allocation(address, { gasLimit: 5000000 });//gasLimit:900000,gasPrice:300000
        setTxHash(res.hash)
        res.wait().then(async () => {
          setSuccess("Allocated Successfully");
          setIsTransactionSuccess(true)
          setTimeout(function () {
            setIsTransactionSuccess(false)
          }, 5000);
          setBtnLoader(false);
        }).catch((err) => {
          setErrorMgs(apiCalls.isErrorDispaly(res));
          setBtnLoader(false)
        })
      } else {
        setBtnLoader(false);
        setErrorMgs(apiCalls.isErrorDispaly(projectAddress));
      }
    } catch (error) {
      setBtnLoader(false);
      setErrorMgs(apiCalls.isErrorDispaly(error));
    }
  }

  const redirection = () => {
    store.dispatch(showSettings(false));
    navigate(`/launchpad/projects/${isAdmin?.id || userId}`)
  }
  return (<>
    {pageloader && <div className="text-center"><Spinner ></Spinner></div>}
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
        {errorMgs && (
          <Alert variant="danger" className='d-lg-flex justify-content-between mobile-block'>
            <div className="d-flex align-items-center flex-1">
              <span className="icon error-alert me-2 alert-error mt-0"></span>
              <p style={{ color: 'red', }} className="error-align mb-0 allocation-error">
                {errorMgs}
              </p>
            </div>
            {txHash && <div className='text-end'>
              <Link className='text-end hyper-text' to={`${polygonUrl}${txHash}`} target="_blank" >
                Click here </Link>
              <span className='mr-25 mb-0 ' style={{ color: 'red', }}>to see details</span>
            </div>}
          </Alert>
        )}

        {/* <div className='text-end'> */}

          <Button className='filled-btn' onClick={() => getWalletAddress()} disabled={btnLoader} >{btnLoader && <Spinner size='sm' className={`${btnLoader ? "text-black" : "text-light"}`} />} Allocate</Button>
          {/* <TiersData tiersData={tiersData?.data} /> */}

          {isTransactionSuccess && (
            <div >
              <ToasterMessage isShowToaster={isTransactionSuccess} success={success}></ToasterMessage>
            </div>
          )}
        {/* </div> */}
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
