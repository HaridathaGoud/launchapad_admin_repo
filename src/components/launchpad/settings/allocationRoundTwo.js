import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
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
const polygonUrl=process.env.REACT_APP_ENV==="production"?process.env.REACT_APP_CHAIN_MAIN_POLYGON_SCAN_URL:process.env.REACT_APP_CHAIN_MUMBAI_POLYGON_SCAN_URL

const AllocationRoundTwo = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isConnected } = useAccount()
  const { connectWallet } = useConnectWallet();
  const projectContractDetails = useSelector((store) => store.launchpad.projectDetails?.data?.projectsViewModel)
  const projectItem= useSelector(reducerstate =>  reducerstate.projectDetails?.project)
  const isAdmin = useSelector(state => state.oidc?.adminDetails);
  const userId = sessionStorage.getItem('userId');
  const [btnLoader, setBtnLoader] = useState(false);
  const [errorMgs, setErrorMgs] = useState(null);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [success, setSuccess] = useState(null);
  const [txHash,setTxHash]=useState(null);
  const { chain } = useNetwork();

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
      const projectAddress = await apiCalls.getAllocation(params?.pId)
      if (projectAddress.ok) {
        const provider = new ethers.providers.Web3Provider(window?.ethereum)
        const factory = new ethers.Contract(projectContractDetails.contractAddress, project.abi, provider.getSigner());
        const res = await factory.allocationRoundTwo({gasLimit:900000,gasPrice:300000});
        setTxHash(res.hash)
        res.wait().then(async (receipt) => {
          setSuccess("Allocated successfully");
          setIsTransactionSuccess(true)
          setTimeout(function () {
            setIsTransactionSuccess(false)
          }, 5000);
          setBtnLoader(false);
        }).catch(() => {
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

  const redirection=()=>{
    store.dispatch(showSettings(false));
    navigate(`/launchpad/projects/${isAdmin?.id||userId}`)
  }

  return (
    //{loader && <div className="text-center"><Spinner ></Spinner></div> }
    <div>
      <CBreadcrumb>
        <CBreadcrumbItem>
          <CLink href="#" onClick={() => redirection()}>Projects</CLink>
        </CBreadcrumbItem>
        <CBreadcrumbItem>
          Settings
        </CBreadcrumbItem>
        <CBreadcrumbItem active>Round Two Allocation</CBreadcrumbItem>
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

      <Button className='filled-btn' onClick={() => getWalletAddress()} disabled={btnLoader} >{btnLoader && <Spinner size='sm' className={`${btnLoader ? "text-black" : "text-light"}`} />} Allocate</Button>
      {isTransactionSuccess && (
        <div >
          <ToasterMessage isShowToaster={isTransactionSuccess} success={success}></ToasterMessage>
        </div>
      )}
    </div>
  )

}

export default AllocationRoundTwo;
