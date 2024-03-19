import React, { useEffect, useRef, useState } from "react";
import { Spinner,Modal } from 'react-bootstrap';
import apiCalls from 'src/api/apiCalls';
import { useParams,useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import KycDetails from "../kyc/kycdetails";
import defaultAvathar from "../../assets/images/default-avatar.jpg"
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react';
import Button from 'react-bootstrap/Button';
import ToasterMessage from "src/utils/toasterMessages";
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from "react-redux";
import Referrals from "../minting/referrals";
import { userDetailsData} from "../launchpad/launchpadReducer/launchpadReducer";
import store from 'src/store/index';
const ProfileInfo = () => {
  const inputRef = useRef(null);
  const [copied,setCopied]=useState(false);
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sucesMsg, setSucesMsg] = useState(null);
  const shouldLog = useRef(true);
  const [show, setShow] = useState(false);
  const [selection, setSelection]=useState(null);
  let { address,tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Kyc');
  const userInfo = useSelector(state => state.oidc?.profile?.profile)
  useEffect(() => {
    if(tab =="launchpad"){
      setActiveTab(tab)
    }
    if (shouldLog.current) {
      shouldLog.current = false;
      if (address) {
        userProfile();
      }
    }
  }, []);//eslint-disable-line react-hooks/exhaustive-deps

  const userProfile = async () => {
    setLoader(true);
    let res = await apiCalls.customerDetails(address);
    if (res.ok) {
      setUserDetails(res.data);
      store.dispatch(userDetailsData(res.data));
      setLoader(false);
    } else {
      setErrorMessage(apiCalls.isErrorDispaly(res));
      setLoader(false);
    }
  }

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleClose = () => {
    setShow(false);
    setErrorMsg(false);
  }

  const handleShow = () => {
    setShow(true);
    setErrorMsg(false);
  }

  const kycStatusUpdate = async () => {
    setBtnLoader(true);
    setSucesMsg(null);
    setErrorMsg(false);
    let obj = {
      "customerId": userDetails?.id,
      "isKyc": userDetails?.kycStatus ? true : false
    }
    let response = await apiCalls.kycStatus(obj)
    if (response.ok) {
      setBtnLoader(false);
      setShow(false);
      userProfile();
      setSucesMsg("Kyc status approved successfully");
      setTimeout(function () {
        setSucesMsg(null);
      }, 2000);
    } else {
      setErrorMsg(apiCalls.isErrorDispaly(response));
      setBtnLoader(false)
    }
  }
  const handleCopy = (dataItem) => {
    setCopied(true)
    setSelection(dataItem)
    setTimeout(() => setCopied(false), 1000)
}
const handleTabChange = (tab) => {
  setActiveTab(tab);
};
  return (
    <div className=''>
       <h5 className="mt-3 page-title mb-3">Personal info</h5>
      <div className='profile-container'>
      <CBreadcrumb>
          <CBreadcrumbItem>
          {window.location.pathname.includes('launchpad') ?
          <CLink href="#" onClick={() => navigate('/launchpad/customers')}>Customers</CLink>:<CLink href="#" onClick={() => navigate('/kyc/customers')}>Customers</CLink>}
          </CBreadcrumbItem>
          <CBreadcrumbItem>Personal info</CBreadcrumbItem>
        </CBreadcrumb>
       
        {errorMessage && (
          <Alert variant="danger">
            <div className='d-flex align-items-center'>
              <span className='icon error-alert'></span>
              <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
            </div>
          </Alert>
        )}
        <div className="text-center">{loader && <Spinner></Spinner>}</div>
        {!loader &&
          <div className='profile-section bg-none'>
            <div className="custom-flex align-items-start mb-4 tab-block">
              <div className='no-hover customer-pfview mb-2 mb-lg-0' onClick={handleUpload} >
                <span className='image-box'>
                  <img className='image-setup' src={userDetails?.profilePicUrl ? userDetails?.profilePicUrl : defaultAvathar} alt="profile img" />
                </span>
              </div>
              <div className="align-items-center justify-content-between flex-1">
                <div className="ms-lg-4 approve-kyc">
                    <div className="d-flex align-items-center mb-3 justify-content-between">
                      <h5 className="activity-title mb-0">
                        {userDetails?.firstName ? userDetails?.firstName : "unnamed"}</h5>
                       
                        </div>
                  <div className="custom-flex align-items-center flex-wrap row gap-4">
                    <div className="value-card col-md-3"><span className="icon country"></span><label className="text-medium text-secondary ms-1">{userDetails.country ? userDetails.country : "--"}</label></div>
                    <div className="value-card col-md-3"><span className="icon contact"></span><label className="text-medium text-secondary ms-1">{userDetails.countryCode ? userDetails.countryCode : "--"}{' '}{userDetails.phoneNo ? userDetails.phoneNo : "--"}</label></div>
                  <div className="value-card col-md-3"><span className="icon email"></span><label className="text-medium text-secondary ms-1 word-break">{userDetails.email ? userDetails.email : "--"}</label></div>
                  
           
             
            <div className="value-card col-md-3"><span className="icon discord"></span><label className="text-medium text-secondary ms-1">{userDetails.discordId?userDetails.discordId:"-"}</label></div>
            <div className="d-flex align-items-center value-card col-md-3">                  
                    <span className="icon small-referral"></span>                  
                    <span className="text-medium text-secondary ms-1">{userDetails?.referralCode || "--"}
                  
                    </span>
                  </div>
                  <div className="d-flex align-items-center value-card col-md-3">                  
                  <span className="icon small-referral"></span>                   
                    <span className="text-medium text-secondary ms-1">{userDetails?.customerReferralCode || "--"}
                   {userDetails?.customerReferralCode && ( <CopyToClipboard 
                      text={userDetails.customerReferralCode } 
                      options={{ format: 'text/plain' }}
						        	onCopy={() => handleCopy(userDetails.customerReferralCode)}
              >
							<span className={(copied && selection === userDetails.customerReferralCode) ? "icon copied-check ms-2" : "icon copy c-pointer"}></span>
						</CopyToClipboard> )}
                    </span>
                  </div>
                  <div className="value-card "><span className="icon wallet"></span><label className="text-medium text-secondary ms-1 discord-block">{userDetails.walletAddress ? userDetails.walletAddress : "--"}
                  <CopyToClipboard 
                      text={userDetails.walletAddress} 
                      options={{ format: 'text/plain' }}
						        	onCopy={() => handleCopy(userDetails.walletAddress)}
              >
							<span className={(copied && selection === userDetails.walletAddress) ? "icon copied-check ms-2" : "icon copy c-pointer"}></span>
						</CopyToClipboard> </label> </div>
                  </div>


                  <div>
               
                <div className="align-items-center custom-flex mt-3 justify-content-between">
                <div className="d-flex align-items-center value-card">{userDetails?.kycStatus&&<h6 className="mb-0">KYC Status </h6>}{"  "}
                  {userDetails?.kycStatus &&<span className={`${userDetails?.kycStatus == "Rejected"&& "complitedRed kyc-badge ms-2"||userDetails?.kycStatus !="Completed" && "kyc-badge ms-2" || userDetails?.kycStatus =="Completed" && "kyc-badge completedGreen ms-2"}`}>{userDetails?.kycStatus}</span>}
                  </div>
                  
                <div>
                  {userInfo.role=="Super Admin" &&
                  <>
                   {(userDetails?.kycStatus?.toLowerCase() == "pending" ||  userDetails?.kycStatus?.toLowerCase() == "init")&&
                   <div className=" mt-lg-0 mt-3 sm-text-end"><Button className="filled-btn" onClick={handleShow}>Approve KYC</Button></div>
                   }
                   </>
                  }

                </div>
                </div>
                </div>
                </div>
              </div>
            </div>

            <div className="content-green-bg px-0">
          
               <Tabs
                activeKey={activeTab} onSelect={handleTabChange}
                id="fill-tab-example"
                className="profile-tabs"
              >
                <Tab eventKey="Kyc" title="KYC" >
                  <KycDetails userDetailsId={userDetails}></KycDetails>
                </Tab>
                
                <Tab eventKey="Referrals" title="Referral's" className="details-content">
                 <Referrals userDetails={userDetails}></Referrals>
                </Tab>
              </Tabs>
            </div>
          </div>
        }
        <Modal className="settings-modal"
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          keyboard={false}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header className="d-flex justify-content-between">
            <Modal.Title id="example-custom-modal-styling-title">
              Confirm Approve ?
            </Modal.Title>
            <span className="icon close" onClick={() => handleClose()}></span>
          </Modal.Header>
          <Modal.Body>
            {errorMsg && (
              <Alert variant="danger">
                <div className='d-flex align-items-center'>
                  <span className='icon error-alert'></span>
                  <p className='m1-2' style={{ color: 'red' }}>{errorMsg}</p>
                </div>
              </Alert>
            )}
           Do you really want to approve the KYC ?

          </Modal.Body>
          <Modal.Footer>
            <div className="text-end"><Button className="transparent-btn" onClick={() => handleClose()}>Cancel</Button>
              <Button className="filled-btn ms-lg-3 ms-2" onClick={kycStatusUpdate}>
                <span>{btnLoader && <Spinner size="sm" />}</span>Approve</Button></div>
          </Modal.Footer>

        </Modal>
        {sucesMsg &&<div className="text-center">
          <ToasterMessage isShowToaster={sucesMsg} success={sucesMsg}></ToasterMessage>
        </div>
        }
      </div>
    </div>
  );
}

export default ProfileInfo;
