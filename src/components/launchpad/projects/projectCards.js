import React, { useState, useEffect, useReducer } from 'react';
import { ethers } from 'ethers';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { useNavigate, useParams } from "react-router-dom";
import apiCalls from 'src/api/apiCalls';
import { connect, useSelector } from 'react-redux';
import nodata from "../../../assets/images/no-data.png"
import DeployFactory from '../../../contract/deploye.json';
import MintFactory from '../../../contract/mintFactory.json';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import { CBreadcrumb, CBreadcrumbItem, CLink, } from '@coreui/react'
import store from 'src/store/index';
import { isProjectCardsId } from 'src/reducers/authReducer';
import defaultLogo from '../../../assets/images/default-avatar.jpg';
import UseCopyToClipboard from '../../../utils/copyClipboard';
import { projectDetailsSave, projectePayment } from "src/components/launchpad/launchpadReducer/launchpadReducer"
import ToasterMessage from "src/utils/toasterMessages";
import { useConnectWallet } from '../../../hooks/useConnectWallet';
import { useAccount,useNetwork } from 'wagmi'
import shimmers from 'src/components/shimmers/shimmers';
import { switchNetwork } from 'wagmi/actions';
import ConvertLocalFormat from 'src/utils/convertToLocal';
import { useContract } from 'src/contract/useContract';

const reducer = (state, action) => {
  switch (action.type) {
    case "errorMgs":
      return { ...state, errorMgs: action.payload };
    case "show":
      return { ...state, show: action.payload };
    case "ownerProjects":
      return { ...state, ownerProjects: action.payload };
    case "detailsPreview":
      return { ...state, detailsPreview: action.payload };
    case "tireWeight":
      return { ...state, tireWeight: action.payload };
    case "btnLoader":
      return { ...state, btnLoader: action.payload };
    case "loader":
      return { ...state, loader: action.payload };
    case "previewErrorMsg":
      return { ...state, previewErrorMsg: action.payload };
    case "previewLoader":
      return { ...state, previewLoader: action.payload };
    case "projectSearch":
      return { ...state, projectSearch: action.payload };
    case "loadMore":
      return { ...state, loadMore: action.payload };
    case "hide":
      return { ...state, hide: action.payload };
    case "successMessage":
      return { ...state, successMessage: action.payload };
    case "success":
      return { ...state, success: action.payload };
    default:
      return state;
  }
}
const initialState = {
  errorMgs: null,
  show: false,
  ownerProjects: [],
  detailsPreview: {},
  tireWeight: [],
  btnLoader: false,
  loader: false,
  previewErrorMsg: null,
  previewLoader: false,
  projectSearch: null,
  loadMore: false,
  hide: false,
  successMessage: null,
  success: false
};

const ProjectCards = () => {
  const { isConnected,address } = useAccount()
  const { connectWallet } = useConnectWallet();
  const { chain } = useNetwork();
  const {balnceTransferToClaimable} = useContract();
  const params = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const pageSize = 8;
  const isAdmin = useSelector(reducerstate => reducerstate.oidc?.adminDetails?.isAdmin);
  const AdminDetails = useSelector((state)=>state.oidc?.adminDetails)
  const role = useSelector(reducerstate => reducerstate?.oidc?.user?.profile?.role)
  const walletAddress = useSelector((reducerstate) => reducerstate.walletAddress?.walletAddress)
  const selectedProject = useSelector(state => state.projectDetails.project);
  const userName = sessionStorage.getItem('userName');
  const prjctName = selectedProject?.name || userName?.split(/\s+/).filter(Boolean).join(' ');
  const projectName = AdminDetails?.isAdmin ? prjctName :AdminDetails?.firstName?.replace(/\s+/g, '')+' '+AdminDetails?.lastName?.replace(/\s+/g, '');
  const [pageNo, setPageNo] = useState(1);
  const [success, setSuccess] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [hide, setHide] = useState(false);
  const [search, setSearch] = useState();


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
      dispatch({ type: 'btnLoader', payload: false })
      dispatch({ type: 'previewErrorMsg', payload: "User rejected transaction." })
      throw new Error('User rejected transaction.');
    }
  }
  useEffect(() => {
    window.scroll(0, 0);
    store.dispatch(projectDetailsSave(null));
    store.dispatch(projectePayment(null))
    getOwenersProjects(1, 8, null);
  }, [])

  const handleShow = () => {
    dispatch({ type: 'show', payload: true })
  }

  const getProjectDetails = (projectId) => {
    getProjectDetailsPreview(projectId);
    dispatch({ type: 'btnLoader', payload: false })
    handleShow();
  };

  const getOnePersonDetailsBasedOnId = (val) => {
      navigate(`/launchpad/investors/projects/${val.id}/projectsDetails`)
      store.dispatch(isProjectCardsId(params?.projectId))
  }

  const getOwenersProjects = async (pageNum, pageListSize, searchProject) => {
    setHide(false)
    dispatch({ type: 'errorMgs', payload: null })
    if (state.ownerProjects?.length === 0) {
      dispatch({ type: 'loader', payload: true })
    }
    const skip = pageNum * pageListSize - pageListSize;
    const take = pageListSize;
    let response = params?.projectId ? await apiCalls.getOwnerProjects(params?.projectId, role, take, skip, searchProject) :
      await apiCalls.getWalletAddressDetails(walletAddress, take, skip, searchProject);
    if (response.ok) {
      dispatch({ type: 'loader', payload: false })
      let _pageNo = pageNum + 1;
      setPageNo(_pageNo);
      let mergeData = pageNum === 1 ? [...response.data] : [...state.ownerProjects, ...response.data];
      dispatch({ type: 'ownerProjects', payload: mergeData })
      if (response?.data?.length >=8) {
        setHide(true)
        setLoadMore(false)
      }
    }
    else {
      dispatch({ type: 'loader', payload: false })
      dispatch({ type: 'errorMgs', payload: apiCalls.isErrorDispaly(response) })
    }
  }

  const addProposalList = () => {
    if (state.ownerProjects?.length > 0) {
      fetchMoreData(role, pageNo, pageSize, (search || null));
    }

  };

  const fetchMoreData = async (projectRole, pageNum, pageListSize, searchProject) => {
    setLoadMore(true)
    setHide(true)
    const skip = pageNum * pageListSize - pageListSize;
    const take = pageListSize;
    let response = params?.projectId ? await apiCalls.getOwnerProjects(params?.projectId, projectRole, take, skip, searchProject) :
      await apiCalls.getWalletAddressDetails(walletAddress, 60, 0, searchProject);
    if (response.ok) {
      dispatch({ type: 'loader', payload: false })
      let _pageNo = pageNum + 1;
      setPageNo(_pageNo);
      let mergeData = pageNum === 1 ? [...response.data] : [...state.ownerProjects, ...response.data];
      dispatch({ type: 'ownerProjects', payload: mergeData })
      if (response?.data?.length == 0 || response?.data?.length >=8) {
        setHide(true)
        setLoadMore(false)
      } else {
        setLoadMore(false)
        setHide(false)
      }
    }
    else {
      dispatch({ type: 'loader', payload: false })
      dispatch({ type: 'errorMgs', payload: apiCalls.isErrorDispaly(response) })
    }

  }

  const getProjectDetailsPreview = async (projectId) => {
    dispatch({ type: 'errorMgs', payload: null })
    dispatch({ type: 'previewErrorMsg', payload: null })
    dispatch({ type: 'previewLoader', payload: true })
    let res = await apiCalls.getProjectDetailsPreview(projectId);
    if (res.ok) {
      dispatch({ type: 'previewLoader', payload: false })
      dispatch({ type: 'detailsPreview', payload: res.data })
      dispatch({ type: 'tireWeights', payload: res?.data?.tierWeights })
    }
    else {
      dispatch({ type: 'previewErrorMsg', payload: apiCalls.isErrorDispaly(res) })
      dispatch({ type: 'previewLoader', payload: false })
    }
  };

  const convertDateToMinutesUTC = (someDateTime) => {
    return Math.floor(moment.utc(someDateTime).valueOf() / 1000);
}

  const redirectToProject = async () => {
    if (isConnected) {
      navigate(`/launchpad/investors/addProjectdetails/${'00000000-0000-0000-0000-000000000000'}`)
    }
    else {
      try {
        navigate(`/launchpad/investors/addProjectdetails/${'00000000-0000-0000-0000-000000000000'}`)
        dispatch({ type: 'previewErrorMsg', payload: null })
      } catch (error) {

        dispatch({ type: 'previewErrorMsg', payload: error?.details || error?.reason })

      }

    }

  };

  const handleDeployContract = async () => {
    dispatch({ type: 'previewErrorMsg', payload: null })
    if (isConnected) {
      dispatch({ type: 'btnLoader', payload: true })
      await handleNetwork();
      if (state.detailsPreview?.tokenType == 'ERC-20') {
        deployErc20Contract();
      } else {
        deployErc721Contract();
      }
    }
    else {
      try {
        dispatch({ type: 'btnLoader', payload: true })
        await connectWallet();
        if (state.detailsPreview?.tokenType == 'ERC-20') {
          deployErc20Contract();
        } else {
          deployErc721Contract();
        }
        dispatch({ type: 'previewErrorMsg', payload: null })
      } catch (error) {
        dispatch({ type: 'previewErrorMsg', payload: "User rejected transaction." })
        dispatch({ type: 'btnLoader', payload: false })
      }
    }
  }

  const deployErc20Contract = async () => {
    setSuccess(null);
    dispatch({ type: 'btnLoader', payload: true })
    dispatch({ type: 'previewErrorMsg', payload: null })
    const tokenContract = state.detailsPreview?.stakingContractAddress;
    const rewardsToken = state.detailsPreview.tokenContractAddress
    const totalSupply = state.detailsPreview?.totalSupply;
    const tokenDecimals = state.detailsPreview?.tokenDecimal
    const tokenAmountPrivate = state.detailsPreview.privateTokenSellingPrice.toLocaleString("en-US",{ maximumFractionDigits: 10 })
    const tokenAmountPublic = state.detailsPreview.publicTokenSellingPrice.toLocaleString("en-US",{ maximumFractionDigits: 10 })
    const privatePrice = ethers.utils.parseUnits(tokenAmountPrivate, tokenDecimals);
    const publicPrice = ethers.utils.parseUnits(tokenAmountPublic, tokenDecimals);
    // const tierWaight = [10, 10, 10, 30, 30, 30, 40, 40, 40, 60, 60, 60, 80, 80, 80, 120, 120, 120];
    const tierWaight = [1, 1, 1, 2, 2, 2, 3, 3, 4, 6, 6, 7, 8, 9, 10, 11, 11, 13];
    const timeSolts = state.detailsPreview?.noOfSlots
    const hours = Number(state.detailsPreview?.vestingDays);
    const secondsInHour = 60 * 60;
    const totalSeconds = hours * secondsInHour;
    const rndStart = convertDateToMinutesUTC(moment(state.detailsPreview?.privateStartDate).format("YYYY-MM-DDTHH:mm"));
    const rndEnd = convertDateToMinutesUTC(moment(state.detailsPreview?.privateEndDate).format("YYYY-MM-DDTHH:mm"));
    const fcfss = convertDateToMinutesUTC(moment(state.detailsPreview?.publicStartDate).format("YYYY-MM-DDTHH:mm"));
    const fcfse = convertDateToMinutesUTC(moment(state.detailsPreview?.publicEndDate).format("YYYY-MM-DDTHH:mm"));
    const provider = new ethers.providers.Web3Provider(window?.ethereum)
    const factory = new ethers.Contract(DeployFactory.contractAddress, DeployFactory.abi, provider.getSigner());
    try {
      const contractRes = await factory.deployClaimableContract(
        tokenContract,
        rewardsToken,
        totalSupply,
        tierWaight,
        rndStart,
        timeSolts,
        totalSeconds,
        rndStart,
        rndEnd,
        fcfss,
        fcfse,
        privatePrice,
        publicPrice,
        { gasLimit: 9000000, gasPrice: 300000 });
      contractRes.wait().then(async (receipt) => {
        const address = receipt.logs[0].address;
        const updateProject = {
          projectId: state.detailsPreview?.projectId,
          contractAddress: address,
          status: "Deployed"
        }
        try {
          await apiCalls.updateContractAddressStatus(updateProject);
          dispatch({ type: 'btnLoader', payload: false })
          getOwenersProjects(1, 8, null);
          handleClose();
          // traferAmount({rewardsToken,updateProject,totalSupply,tokenDecimals})
          setSuccess(`Project deployed successfully`);
          setTimeout(function () {
            setSuccess(null);
          }, 2000);
        }
        catch (error) {
          dispatch({ type: 'errorMgs', payload: error?.reason || null })
          dispatch({ type: 'btnLoader', payload: false })
        }
      }).catch((error) => {
        dispatch({ type: 'previewErrorMsg', payload: error?.reason || null })
        dispatch({ type: 'btnLoader', payload: false })
      })
    } catch (error) {
      dispatch({ type: 'previewErrorMsg', payload: error?.reason || null })
      dispatch({ type: 'btnLoader', payload: false })
    }
  };

  const deployErc721Contract = async () => {
    setSuccess(null);
    dispatch({ type: 'btnLoader', payload: true })
    dispatch({ type: 'previewErrorMsg', payload: null })
    const shareDetails = {
      minnapadShare: 3000,
      daoShare: 3000,
      legendShare: 4000,
      minnapadAddr: '0xC18E2bdDdc68e4d06978a917A516AC82261E8991',
      daoAddr: '0xC18E2bdDdc68e4d06978a917A516AC82261E8991',
      legendAddr: '0xC18E2bdDdc68e4d06978a917A516AC82261E8991',
    };
    const nativePriceFeeAddres = '0x001382149eBa3441043c1c66972b4772963f5D43';
    const secondaryPriceFeeAdres = '0xF0d50568e3A7e8259E16663972b11910F89BD8e7';
    const platformFee = 5;
    // const ercCustomToken = '0x41CF89e47Ee08a09D8bc168c5072358e87B2eBf8';
     const ercCustomToken = '0xb01b478297325353b66FE099f65C298D0870eB16';
    const baseFiatPrice = ethers.utils.parseEther('0.0005');
    const provider = new ethers.providers.Web3Provider(window?.ethereum)
    const factory = new ethers.Contract(MintFactory.contractAddress, MintFactory.abi, provider.getSigner());
    try {
      console.log(ercCustomToken,
        baseFiatPrice,
        nativePriceFeeAddres,
        secondaryPriceFeeAdres,
        platformFee,
        'gasLimit: 3000000');
      const contractRes = await factory.deployMembershipToken(
        ercCustomToken,
        baseFiatPrice,
        nativePriceFeeAddres,
        secondaryPriceFeeAdres,
        platformFee,
        // { gasLimit: 3000000 , gasPrice: 300000});
      )
      contractRes.wait().then(async (receipt) => {
        const address = receipt.logs[0].address;
        const updateProject = {
          projectId: state.detailsPreview?.projectId,
          contractAddress: address,
          status: "Deployed"
        }
        try {
          await apiCalls.updateContractAddressStatus(updateProject);
          dispatch({ type: 'btnLoader', payload: false })
          getOwenersProjects(1, 8, null);
          handleClose();

          setSuccess(`Project deployed successfully`);
          setTimeout(function () {
            setSuccess(null);
          }, 2000);
        }
        catch (error) {
          dispatch({ type: 'errorMgs', payload: error?.reason || null })
          dispatch({ type: 'btnLoader', payload: false })
        }
      }).catch((error) => {
        dispatch({ type: 'previewErrorMsg', payload: error?.reason || null })
        dispatch({ type: 'btnLoader', payload: false })
      })
    } catch (error) {
      dispatch({ type: 'previewErrorMsg', payload: error?.reason || null })
      dispatch({ type: 'btnLoader', payload: false })
    }
  };

  const handleChange = ({ currentTarget: { value } }) => {
    let data = value.trim()
    setSearch(data);
    dispatch({ type: 'projectSearch', payload: data })
    if (!data) {
      getOwenersProjects(1, 10, null)
      dispatch({ type: 'projectSearch', payload: null })
    }
  };
  const handleEnterSearch = (e) => {
    let data = e.target.value.trim();
    setSearch(data);
    if (e.key == 'Enter') {
      if (data == "") {
        getOwenersProjects(1, 10, null)
        e.preventDefault();
      } else {
        getOwenersProjects(1, 10, data)
        e.preventDefault();
      }
    }
  }

  const handleSearch = () => {
    getOwenersProjects(1, 10, search)
  }
  const handleClose = () => {
    dispatch({ type: "detailsPreview", payload: {} })
    dispatch({ type: 'show', payload: false })
  }
 const commSeparaion=(val)=>{
  const intValue = Math.floor(val);
  const formattedValue = intValue.toLocaleString('en-IN');
  return formattedValue;
 };

 const traferAmount=async (data)=>{
  const transferTo = data.updateProject.contractAddress;
  const amount = data.totalSupply;
  const amountInWei = ethers.utils.parseUnits(amount.toString(), data.tokenDecimals);
  console.log('amountInWei ',amountInWei);
  try{
   const response =  await balnceTransferToClaimable(address,transferTo,amountInWei);
   console.log('response',response);
  }catch (error){
    console.log(error);;
  }
 }
 const clearErrorMsg=()=>{
  dispatch({ type: 'errorMgs', payload: null }); 
  dispatch({ type: 'previewErrorMsg', payload: null })
}
 return (
    <div>
      <div className='Container'>
        <div className=''>
          <h2 className='page-title'>{window.location.pathname.includes('/investors') ? "Projects" : "My Projects"}</h2>

        </div>
        {isAdmin && <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => navigate(`/launchpad/investors`)} className='c-pointer'>Project Owners</CLink>
          </CBreadcrumbItem>
          {projectName && <CBreadcrumbItem >{projectName}</CBreadcrumbItem>}
          <CBreadcrumbItem active>Projects</CBreadcrumbItem>
        </CBreadcrumb>}
        {!isAdmin && <CBreadcrumb>
          <CBreadcrumbItem>
            Launchpad
          </CBreadcrumbItem>
          {projectName && <CBreadcrumbItem active>{projectName}</CBreadcrumbItem>}
        </CBreadcrumb>}

        {state.errorMgs && (
         <Alert variant="danger">
           <div className='d-flex gap-4'>
             <div className='d-flex gap-2 flex-1'>
               <span className='icon error-alert'></span>
               <p className='m1-2' style={{ color: 'red' }}>{state.errorMgs}</p>
             </div>
             <span className='icon close-red' onClick={clearErrorMsg}></span>
           </div>
         </Alert>
        )}

        <div className='d-md-flex mt-4 justify-content-between'>
          <Form className="d-flex grid-search">
            <Form.Control
              placeholder="Search By Project Name"
              className="search-style"
              aria-label="Search"
              onKeyUp={(e) => handleChange(e)}
              onKeyDown={(e) => handleEnterSearch(e)}
            />
            <i className="icon search-icon" onClick={handleSearch}></i>
          </Form>
          <div className='add-project'>
            <Button className='button-style mt-3 mt-md-0' onClick={redirectToProject}><span className='icon add-icon'></span> Add Project</Button>
          </div>
        </div>

        {state.loader &&
          <div className='mt-4 mb-4'>
            <shimmers.DaoCardShimmer count={8} />
          </div>
        }
        {!state.loader && <>
          <Row className='mt-4 mb-4'>
            {state.ownerProjects?.length === 0 &&
              <div className='Row d-flex justify-content-center'>
                <div className=" col-md-12 col-lg-3" >
                  <div className='nodata-image text-center'><img src={nodata} alt="" /></div>
                  <div className="value-section">
                    <div className="card-footer text-center nodata-title">
                      No projects available

                    </div>
                  </div>
                </div>
              </div>}

            {state.ownerProjects?.map((val) =>
              <Col xs={12} md={6} lg={3} className="mb-3" key={val?.id}>
                <div className="card-style p-0 home-card position-relative cursor-pointer">
                  <div className='card-content'>
                    <div className='card-image' onClick={() => getOnePersonDetailsBasedOnId(val)}> <span className='card-image-span'><img src={val?.tokenLogo || defaultLogo} alt="" /></span></div>
                    <div className="px-3">
                      <div className=" mt-3" onClick={() => getOnePersonDetailsBasedOnId(val)} >
                        <h3 className="project-name">{val?.projectName}</h3>
                        <p className='card-desc'> {val?.description} </p>
                      </div>
                      <div className=''>
                        {val?.projectstatus?.toLowerCase() === 'rejected' &&
                         <span className='card-state bg-danger' >
                            Rejected</span>}
                        {val?.projectstatus?.toLowerCase() === 'deployed' &&
                          <span className='card-state bg-success'>
                            Deployed</span>
                        }
                        {val?.projectstatus?.toLowerCase() === 'deploying' &&
                           <span className='card-state bg-success'>
                            Deploying</span>
                        }
                        {val?.projectstatus?.toLowerCase() === 'draft' &&
                          <span className='card-state bg-danger' >Draft</span>
                        }
                        {isAdmin && val?.projectstatus?.toLowerCase() === 'approved' &&
                          <span className='card-state bg-warning' >View</span>
                        }
                        {val?.projectstatus?.toLowerCase() === 'submitted' && <> <span className='card-state bg-primary'>Submitted</span> </>}
                        {!isAdmin && val?.projectstatus?.toLowerCase() === 'approved' &&
                          <Button className='button-secondary w-100 mb-2' onClick={() => getProjectDetails(val.id)} >
                            Deploy</Button>
}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

            )}
          </Row>

          <>
            <div className='text-center'>{loadMore && <Spinner size="sm" className='text-white text-center' />} </div>
            <div className='addmore-title' >
              {hide && <>
                <span className='d-block'><span onClick={addProposalList} role="button" className='c-pointer'>See More</span></span>  <span className='icon blue-doublearrow c-pointer' onClick={addProposalList}></span>
              </>}
            </div></>
        </>}

        <Modal size="lg" show={state.show} onHide={handleClose} className="settings-modal profile-modal " id="example-modal-sizes-title-lg">
          <Modal.Header >
            <Modal.Title className='section-title'>Review Details</Modal.Title><span onClick={handleClose} className='icon close c-pointer'></span>
          </Modal.Header>
          <Modal.Body className='p-4'>
            {state.previewErrorMsg && (
             <Alert variant="danger">
               <div className='d-flex gap-4'>
                 <div className='d-flex gap-2 flex-1'>
                   <span className='icon error-alert'></span>
                   <p className='m1-2' style={{ color: 'red' }}>{state.previewErrorMsg}</p>
                 </div>
                 <span className='icon close-red' onClick={clearErrorMsg}></span>
               </div>
             </Alert>
            )}
            <div className="text-center">{state.previewLoader && <Spinner className='text-center'></Spinner>}</div>
            {!state.previewLoader &&
              <div>
                <Row>
                  <Col lg={4} md={12}>
                    <div className="view-data">
                      <label htmlFor='profile-label' className='profile-label'>Project Name</label>
                      <h6 className='about-label text-overflow  mb-0'>{state.detailsPreview?.projectName || '-'}</h6>
                    </div></Col>
                  <Col lg={4} md={12}>
                    <div className="view-data">
                      <label htmlFor="stakingContractAddress" className='profile-label'>Staking Contract Address</label>
                      <div className='d-flex align-items-center'>
                        {state.detailsPreview?.stakingContractAddress && <>
                          <h6 className='about-label mb-0'>
                            {state.detailsPreview?.stakingContractAddress?.substring(0, 6)}...{state.detailsPreview?.stakingContractAddress?.slice(-4)}</h6>
                          <UseCopyToClipboard address={state.detailsPreview?.stakingContractAddress}></UseCopyToClipboard>
                        </>}
                        {!state.detailsPreview?.stakingContractAddress &&
                          <h6>{'-'}</h6>}
                      </div>
                    </div>
                  </Col>
                  { state.detailsPreview.nftImagesCount > 0 && state.detailsPreview?.tokenType == 'ERC-721'&&
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="nftImagesCountInput" className='profile-label'>NFT Images Counts</label>
                        <div className='d-flex align-items-center'>
                          <h6 className='about-label mb-0'>
                            {state.detailsPreview.nftImagesCount}
                          </h6>
                        </div>
                      </div>
                    </Col>
                  }

                  {state.detailsPreview.tokenContractAddress && state.detailsPreview?.tokenType == 'ERC-20'&&
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="tokenContractAddressInput" className='profile-label'>Token Contract Address</label>
                        <div className='d-flex align-items-center'>
                          {state.detailsPreview?.tokenContractAddress && <>
                            <h6 className='about-label mb-0'>
                              {state.detailsPreview?.tokenContractAddress?.substring(0, 6)}...{state.detailsPreview?.tokenContractAddress?.slice(-4)}</h6>
                            <UseCopyToClipboard address={state.detailsPreview?.tokenContractAddress}></UseCopyToClipboard>
                          </>}
                          {!state.detailsPreview?.tokenContractAddress &&
                            <h6>{'-'}</h6>}
                        </div>
                      </div>
                    </Col>
                  }
                  {state.detailsPreview.totalSupply && state.detailsPreview?.tokenType == 'ERC-20'&&
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="totalSupplyInput" className='profile-label'>Total Supply</label>
                        <h6 className='about-label text-overflow mb-0'>{commSeparaion(state.detailsPreview?.totalSupply) || '-'}</h6>
                      </div>
                    </Col>
                     }
                    {/* <Col lg={4} md={12}>
                      <div className="view-data">
                        <label className='project-text text-lightpurpl'>Tire Weights</label>
                        {state.detailsPreview.tierWeights?.length > 0 && <><h6 className='about-label mb-0 word-break'>

                          {state.detailsPreview.tierWeights.map((val) =>
                            <>
                              <span>{val?.name}{','}{'  '}</span>
                            </>
                          )}
                        </h6>
                        </>}
                        {state.detailsPreview.tierWeights?.length === 0 && <>
                          {'-'}</>}
                      </div>
                    </Col> */}
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="listingTime" className='profile-label'>Listing Time</label>
                        <h6 className='about-label text-overflow mb-0'>{state.detailsPreview?.listTime ?
                          ConvertLocalFormat(state.detailsPreview?.listTime)
                          : '--'}</h6>
                      </div>
                    </Col>
                    {state.detailsPreview.noOfSlots !=0 && state.detailsPreview?.tokenType == 'ERC-20'&&
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="claimSlotsInput" className='profile-label'>Claim Slots</label>
                        <h6 className='about-label text-overflow mb-0'>{state.detailsPreview?.noOfSlots || '-'}</h6>
                      </div>
                    </Col>
                    }
                    {state.detailsPreview.vestingDays !=0 && state.detailsPreview?.tokenType == 'ERC-20'&&
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="vestingTimeInput" className='profile-label'>Vesting Time</label>
                        <h6 className='about-label text-overflow mb-0'>{state.detailsPreview?.vestingDays || '-'} {state.detailsPreview?.vestingDays ? "(Hours)" : ""}</h6>
                      </div>
                    </Col>
                    }
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="roundOneStartTimePrivate" className='profile-label'>Round One Start Time(Private)</label>
                        <h6 className='about-label text-overflow mb-0'>{state.detailsPreview?.privateStartDate ? 
                        ConvertLocalFormat(state.detailsPreview?.privateStartDate) : '--'}</h6>
                      </div>
                    </Col>
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="roundOneEndTimePrivate" className='profile-label'>Round One End Time(Private)</label>
                        <h6 className='about-label text-overflow mb-0'>{state.detailsPreview?.privateEndDate ? 
                        ConvertLocalFormat(state.detailsPreview?.privateEndDate) : '--'}</h6>
                      </div>
                    </Col>
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="roundTwoStartTime" className='profile-label'>Round Two Start Time(Public)</label>
                        <h6 className='about-label text-overflow mb-0'>{state.detailsPreview?.publicStartDate ?
                          ConvertLocalFormat(state.detailsPreview?.publicStartDate)
                          : '--'}</h6>
                      </div>
                    </Col>
                    <Col lg={4} md={12}>
                      <div className="view-data">
                        <label htmlFor="roundTwoEndTime" className='profile-label'>Round Two End Time(Public)</label>
                        <h6 className='about-label text-overflow mb-0'>{state.detailsPreview?.publicEndDate ?
                          ConvertLocalFormat(state.detailsPreview?.publicEndDate)
                          : '--'}</h6>
                      </div>
                    </Col>
                  </Row>
                </div>
              }

            </Modal.Body>
            <Modal.Footer>
              <div className='text-end'> <Button variant="primary" className='button-secondary px-4'
                disabled={state.btnLoader}
                onClick={handleDeployContract}>
                <span>{state.btnLoader && <Spinner className={`loaderStyle  ${state.btnLoader ? 'text-black':'text-light'}`}></Spinner>}</span> <span>Deploy </span>
              </Button></div>
            </Modal.Footer>
          </Modal>
        </div>
        {success &&<div className="text-center toster-placement toaster-cust">
          <ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
        </div>
        }
      </div>);
}


const connectStateToProps = ({ auth }) => {
  return { auth: auth };
};
export default connect(connectStateToProps, (dispatch) => {
  return { dispatch };
})(ProjectCards);