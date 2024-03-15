import React, { useEffect, useRef, useState } from "react";
import { Spinner,Button,Modal } from 'react-bootstrap';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import KycDetails from "./kyc";
import { useNavigate,useParams } from "react-router-dom";
import defaultAvathar from "../../assets/images/default-avatar.jpg"
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react';
import Nfts from './nfts'
import CopyToClipboard from 'react-copy-to-clipboard';
import Referrals from "../minting/referrals";
const CustomersInfo = () => {
  const inputRef = useRef(null);
  let { address,key} = useParams();
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const shouldLog = useRef(true);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [copied,setCopied]=useState(false);
  const [selection, setCopySelections]=useState(null);
  const [activeTab, setActiveTab] = useState('Kyc');

  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      if (address) {
        userProfile();
      }
    }
  }, []);//eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const activeTabParam = key;
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [key]);
 
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/marketplace/customers/profileInfo/${tab}/${address}`)
  };

  const userProfile = async () => {
    setLoader(true);
    await apiCalls.customerDetails(address)
      .then((response) => {
        setUserDetails(response.data);
        setLoader(false);
      })
      .catch((error) => {
        setErrorMessage(apiCalls.isErrorDispaly(res));
      setLoader(false);
      });
  };
  const handleUpload = () => {
    inputRef.current?.click();
  };
  const handleShow = () => {
    setShow(true);
    setErrorMsg(false);
  }
  
  const handleClose =()=>{
    setShow(false);
  }
  const kycStatusUpdate = async () => {
    setBtnLoader(true);
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
    } else {
      setErrorMsg(apiCalls.isErrorDispaly(response));
      setBtnLoader(false)
    }
  }
  const handleCopy = (dataItem) => {
    setCopied(true)
    setCopySelections(dataItem)
    setTimeout(() => setCopied(false), 1000)
}
  return (
    <div className=''>
      <div className='profile-container'>
      <CBreadcrumb>
          <CBreadcrumbItem className="c-pointer">
            <CLink  onClick={() => navigate('/marketplace/customers')}>Customers</CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem>Personal info</CBreadcrumbItem>
        </CBreadcrumb>
        <h5 className="mt-3">Personal info</h5>
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
          <div className='profile-section'>
            
            <div className="custom-flex align-items-start mb-4">
              <div className='profile-size no-hover' onClick={handleUpload} >
                <span className='image-box'>
                <img className='image-setup' src={userDetails?.profilePicUrl ? userDetails?.profilePicUrl : defaultAvathar} alt="profile img" />
                </span>
              </div>
              <div className="ms-lg-4 approve-kyc">
                <div className="d-flex align-items-center mb-3 justify-content-between">
                      <h5 className="activity-title mb-0">
                        {userDetails.firstName ? userDetails.firstName : "unnamed"}</h5>
                       
                        </div>
                <div className="custom-flex align-items-center flex-wrap">
                  <div className="value-card"><span className="icon country"></span><label className="text-medium text-secondary ms-1">{userDetails.country ? userDetails.country : "--"}</label></div>
                  <div className="value-card"><span className="icon contact"></span><label className="text-medium text-secondary ms-1">{userDetails.countryCode ? userDetails.countryCode : "--"}{' '}{userDetails.phoneNo ? userDetails.phoneNo : "--"}</label></div>
                  <div className="value-card"><span className="icon email"></span><label className="text-medium text-secondary ms-1">{userDetails.email ? userDetails.email : "--"}</label></div>
                  <div className="value-card"><span className="icon wallet"></span>
                  <label className="text-medium text-secondary ms-1 text-ellipsis">{userDetails.walletAddress ? userDetails.walletAddress : "--"}
               

                  <CopyToClipboard 
                      text={userDetails.walletAddress} 
                      options={{ format: 'text/plain' }}
						        	onCopy={() => handleCopy(userDetails.walletAddress)}
              >
							<span className={(copied && selection === userDetails.walletAddress) ? "icon copied-check ms-2" : "icon copy c-pointer"}></span>
						</CopyToClipboard></label>
                  </div>
                  <div className="value-card"><span className="icon discord"></span><label className="text-medium text-secondary ms-1">{userDetails.discordId?userDetails.discordId:"-"}</label></div>
                  <div className="d-flex align-items-center value-card">                  
                    <span className="icon small-referral"></span>                  
                    <span className="text-medium text-secondary ms-1">{userDetails?.referralCode || "--"}
                  
                    </span>
                  </div>
                  <div className="d-flex align-items-center value-card">                  
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
                  </div>                 
                  <div className="align-items-center custom-flex justify-content-between mt-3">
                  <div className="d-flex align-items-center">{userDetails?.kycStatus&&<h6 className="mb-0">KYC Status </h6>}{"  "}
                  {userDetails?.kycStatus &&<span className={`${userDetails?.kycStatus == "Rejected"&& "complitedRed kyc-badge ms-2"||userDetails?.kycStatus !="Completed" && "kyc-badge ms-2" || userDetails?.kycStatus =="Completed" && "kyc-badge completedGreen ms-2"}`}>{userDetails?.kycStatus}</span>}
                  </div>
                  {(userDetails?.kycStatus?.toLowerCase() == "pending" ||  userDetails?.kycStatus?.toLowerCase() == "init") && <>
                <div className=" mt-lg-0 mt-3 me-5 sm-text-end"><Button className="filled-btn" onClick={handleShow}>Approve KYC</Button></div>
                </>}
                </div>

              </div>
            </div>
            <div className="content-green-bg">
              <Tabs
                activeKey={activeTab} onSelect={handleTabChange}
                id="fill-tab-example"
                className="profile-tabs"
              >
                <Tab eventKey="Kyc" title="KYC" >
                  <KycDetails userDetailsId={userDetails}></KycDetails>
                </Tab>
                <Tab eventKey="Nft" title="NFT's" >
                  <Nfts address={address} userDetailsId={userDetails} />
                </Tab>
                <Tab eventKey="Referrals" title="Referral's" >
                 <Referrals userDetails={userDetails}></Referrals>
                </Tab>
              </Tabs>
            </div>
            </div>
         }
      </div>
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
    </div>
    
  );
}
export default CustomersInfo;