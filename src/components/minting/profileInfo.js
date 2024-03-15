import React, { useEffect, useRef, useState } from "react";
import { Spinner,Modal } from 'react-bootstrap';
import apiCalls from 'src/api/apiCalls';
import { useParams,useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import KycDetails from "../kyc/kycdetails";
import defaultAvathar from "../../assets/images/default-avatar.jpg"
import PropTypes from 'prop-types';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react';
import Button from 'react-bootstrap/Button';
import ToasterMessage from "src/utils/toasterMessages";

const ProfileInfo = () => {
  const inputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sucesMsg, setSucesMsg] = useState(null);
  const shouldLog = useRef(true);
  const [show, setShow] = useState(false);
  let { address } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className=''>
      <div className='profile-container'>
        <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => navigate('/home')}>Customers</CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>Personal info</CBreadcrumbItem>
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
            <div className="custom-flex align-items-center mb-4">
              <div className='profile-size no-hover' onClick={handleUpload} >
                <span className='image-box'>
                  <img className='image-setup' src={userDetails?.profilePicUrl ? userDetails?.profilePicUrl : defaultAvathar} alt="profile img" />
                </span>
              </div>
              <div className="align-items-center justify-content-between flex-1">
                <div className="ms-lg-4 approve-kyc">
                    <div className="d-flex align-items-center mb-3">
                      <h5 className="activity-title mb-0">
                        {userDetails.firstName ? userDetails.firstName : (!userDetails.firstName && "unnamed" ||"unnamed")}</h5>
                        
                        </div>
                  <div className="custom-flex align-items-center"><div className="value-card"><span className="icon country"></span><label className="text-medium text-secondary ms-1">{userDetails.country ? userDetails.country : "--"}</label></div><div className="value-card"><span className="icon contact"></span><label className="text-medium text-secondary ms-1">{userDetails.countryCode ? userDetails.countryCode : "--"}{' '}{userDetails.phoneNo ? userDetails.phoneNo : "--"}</label></div><div className="value-card"><span className="icon email"></span><label className="text-medium text-secondary ms-1">{userDetails.email ? userDetails.email : "--"}</label></div></div>
                  <div>
               
                <div className="align-items-center custom-flex justify-content-between mt-3">
                  <div className="d-flex align-items-center">
                    <h6 className="mb-0">KYC Status </h6>
                    {"  "}
                {userDetails?.kycStatus &&<span className={`${userDetails?.kycStatus == "Rejected"&& "complitedRed kyc-badge"||userDetails?.kycStatus !="Completed" && "kyc-badge ms-2" || userDetails?.kycStatus =="Completed" && "kyc-badge completedGreen ms-2"}`}>{userDetails?.kycStatus}</span>}
                </div>
                { (userDetails?.kycStatus?.toLowerCase() == "pending" ||  userDetails?.kycStatus?.toLowerCase() == "Init")&&<>
                <div className=" mt-lg-0 mt-3"><Button className="filled-btn" onClick={handleShow}>KYC Approve</Button></div>
                </>}</div>
                </div>
                </div>
             
              </div>
              
            </div>

            <div className="content-green-bg">
              <Tabs
                defaultActiveKey="Project"
                id="fill-tab-example"
                className="profile-tabs"
                fill
              >
                <Tab eventKey="Project" title="KYC" activeKey>
                  <KycDetails userDetailsId={userDetails}></KycDetails>
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
            Do you really want to KYC Approve ?

          </Modal.Body>
          <Modal.Footer>
            <div className="text-end"><Button className="transparent-btn" onClick={() => handleClose()}>Cancel</Button>
              <Button className="filled-btn ms-lg-3 ms-2" onClick={kycStatusUpdate}>
                <span>{btnLoader && <Spinner size="sm" />}</span>Approve</Button></div>
          </Modal.Footer>

        </Modal>
        {sucesMsg && <><div className="text-center">
          <ToasterMessage isShowToaster={sucesMsg} success={sucesMsg}></ToasterMessage>
        </div>
        </>}
      </div>
    </div>
  );
}
ProfileInfo.propTypes = {
  userDetailsId: PropTypes.any,
};
export default ProfileInfo;
