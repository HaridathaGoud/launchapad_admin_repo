import React, { useEffect, useRef, useState } from "react";
import {  Modal, FloatingLabel,Spinner } from 'react-bootstrap';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import {useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import profileavathar from "../../assets/images/default-avatar.jpg";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import apiUploadPost from '../../utils/apiUploadPost';
import jsonCountryCode from '../../../src/utils/countryCode.json';
import jsonPhoneCode from '../../../src/utils/phoneCode.json';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { adminProfileImg } from '../../reducers/authReducer'
import store from 'src/store/index';
import ToasterMessage from "src/utils/toasterMessages";
import { validateContentRules } from "src/utils/custom.validator";

const UserProfile = (props) => {
  const [adminDetails, setAdminDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loaderform, setloaderform] = useState(false);
  const [errorMessageProfile, setEerrorMessageProfile] = useState(null);
  const [show, setShow] = useState(false);
  const shouldLog = useRef(true);
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({});
  const [detailsData,setDetailsData]=useState();
  const [picLoader,setPicLoader]=useState(false);
  let params = useParams();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phoneNo: '',
    profilePicUrl: '',
    countryCodeNo: "",
    country: "",
  });
  const inputRef = useRef();
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      getAdminDetails()
    }
  }, []);//eslint-disable-line react-hooks/exhaustive-deps
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      })
    }
  }
  const getAdminDetails = async () => {
    const response = await apiCalls.fetchAdminDetails(params.id||props.profileData?.profile?.sub);
    if (response.ok) {
      if (response.data) {
        setDetailsData(response.data)
        getAdminProfile(response.data.id)

      }
    }
  }

  const getAdminProfile = async (id) => {
    setLoader(true);
    let response = await apiCalls.adminProfile(id)
    if (response.ok) {
      setAdminDetails(response.data);
      setForm(response.data);
      setLoader(false);
    }
    else {
      setErrorMessage(apiCalls.isErrorDispaly(response));
      setLoader(false);
    }
  }

  const validateForm = (obj, isChange) => {
    const { firstName, lastName, phoneNo,countryCode, country } = isChange ? obj : form
    const newErrors = {};
    if (!firstName || firstName === '') {
      newErrors.firstName = "Is required";
    } 
    else if(!validateContentRules("",firstName)){
      newErrors.firstName = "Invalid first name";
    }
    if (!lastName || lastName === '') {
      newErrors.lastName = "Is required";
    } 
    else if(!validateContentRules("",lastName)){
      newErrors.lastName = "Invalid last name";
    }
    if (!phoneNo || phoneNo === '') {
      newErrors.phoneNo = "Is required";
    }
    else if(!validateContentRules("",phoneNo)){
      newErrors.phoneNo = "Invalid phone number";
    }
    else if((!countryCode||countryCode==="select")){
        newErrors.phoneNo = "Invalid phone code";
    }
    if(!country || country === "Select Country"){
      newErrors.country = "Is required";
    }
    return newErrors;
  }

  const saveAdminProfile = async (event) => {
    event.preventDefault();
    setSuccess(null);
    setErrors({});
        const formErrors = validateForm();
        if (Object.keys(formErrors)?.length > 0) {
          setErrors(formErrors);
          setLoader(false);
          setloaderform(false);
        }else{
          setloaderform(true);
          let obj = Object.assign({}, form);
          obj.id= adminDetails.id,
          obj.firstName= form.firstName || adminDetails.firstName,
          obj.lastName= form.lastName || adminDetails.lastName,
          obj.email= adminDetails.email,
          obj.country= form.country || adminDetails.country,
          obj.phoneNo= form.phoneNo || adminDetails.phoneNo,
          obj.profilePicUrl= profile.profilePicUrl || adminDetails.profilePicUrl,
          obj.status= adminDetails.status,
          obj.countryCode= form.countryCode?form.countryCode: adminDetails.countryCode,
          obj.isAdmin= adminDetails.isAdmin,
          obj.kycStatus= adminDetails.adminDetails,
          obj.userName= adminDetails.userName
          let response = await apiCalls.saveAdmin(obj)
          if (response.ok) {
            store.dispatch(adminProfileImg(profile?.profilePicUrl || adminDetails?.profilePicUrl));
            setSuccess("Profile details saved successfully");
            setloaderform(false);
            setShow(false)
            getAdminProfile(detailsData?.id);
            setTimeout(function () {
              setSuccess(null);
            }, 2000);
          }
          else {
            setEerrorMessageProfile(apiCalls.isErrorDispaly(response));
            setloaderform(false);
          }
          setValidated(true);
          setloaderform(false);
        }
    
     
  }


  const handleUpload = () => {
    inputRef.current?.click();
  }

  const uploadToClient = (event) => {
    inputRef.current?.click();
    setErrorMessage(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        setErrorMessage('File is not allowed. You can upload jpg, png, jpeg files.');
      } else {
        uploadToServer(file)
      }
    }
  };

  const uploadToServer = async (file) => {
    setSuccess(null);
    setPicLoader(true)
    setErrorMessage(null);
    const body = new FormData();
    body.append('file', file);
    apiUploadPost(`Upload/UploadFileNew/${adminDetails.id}`, body)
      .then((res) => res)
      .then((data) => {
        let _obj = { ...profile };
        _obj.profilePicUrl = data[0];
        setProfile(_obj);
         store.dispatch(adminProfileImg(data[0]));
         setPicLoader(false);
         setSuccess("Profile updated successfully");
        setTimeout(function () {
          setSuccess(null);
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage(apiCalls.uploadErrorDisplay(error?.response?.data));
      });
  };

  const handleEdit = () => {
    setShow(true);
    setValidated(false)
    setEerrorMessageProfile(null);
    setForm(adminDetails);
  }

  const handleCancel = () => {
    setShow(false);
    setProfile({});
    setErrors({});
    setForm({});
  }

  return (
    <div className='container'>
      <div className='profile-container'>
        {errorMessage && (
          <Alert variant="danger">
            <div className='d-flex align-items-center'>
              <span className='icon error-alert'></span>
              <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
            </div>
          </Alert>
        )}
        {loader && <div className="text-center"> <Spinner className="text-center" /></div>}
        {!loader && (
          <div className='profile-section mb-5 mt-5'>
            <Row className="profile-panel ms-0 me-0" >
              <Col xl={3} sm={12} className="">
                <div className="">
                  <Form.Group>
                    <div className='profile-size identification-image  no-hover' >
                      <span className='image-box'>
                      {picLoader && <Spinner size="sm" />}
                        <img className='image-setup'
                        src={profile?.profilePicUrl || adminDetails?.profilePicUrl || profileavathar} alt="profile img" 
                        />
                      </span>
                      <span>
                        <input ref={inputRef} type="file" name="myImage" id="input-file" onChange={uploadToClient} className="d-none"/>
                        <Button onClick={handleUpload} className="icon camera cam-position upload-transparent">
                        </Button>
                    </span>
                    </div>
                  </Form.Group>
                </div>
              </Col>

              <Col xl={9} sm={12} className="">
                <div className=" text-end my-2 mt-3 mt-xl-0 mb-2">
                  <Button className="c-pointer button-secondary" onClick={handleEdit} >
                    {/* <span className="icon edit me-1"></span> */}
                    Edit Profile
                  </Button>
                </div>
                <Row className="px-lg-4 px-2">
                  <Col xl={4} sm={12} md={6}>
                    <label className="profile-label">First Name</label>
                    <p className="profile-value">{adminDetails?.firstName ? adminDetails?.firstName : "--"}</p>
                  </Col>
                  <Col xl={4} sm={12} md={6}>
                    <label className="profile-label">Last Name</label>
                    <p className="profile-value">{adminDetails?.lastName ? adminDetails?.lastName : "--"}</p>
                  </Col>
                  <Col xl={4} sm={12} md={6}>
                    <label className="profile-label">User Name</label>
                    <p className="profile-value">{adminDetails?.userName ? adminDetails?.userName : "--"}</p>
                  </Col>
                  <Col xl={4} sm={12} md={6}></Col>
                </Row>
                <Row className="px-lg-4 mb-2 px-2">
                  <Col xl={4} sm={12} md={6}>
                    <label className="profile-label">Email</label>
                    <p className="profile-value">{adminDetails?.email ? adminDetails?.email : "--"}</p>
                  </Col>
                  <Col xl={4} sm={12} md={6}>
                    <label className="profile-label">Phone No</label>
                    <p className="profile-value">
                      {adminDetails?.countryCode}{" "}{adminDetails?.phoneNo ? adminDetails?.phoneNo : "--"}
                    </p>
                  </Col>
                  <Col xl={4} sm={12} md={6}>
                    <label className="profile-label">Country</label>
                    <p className="profile-value">{adminDetails?.country ? adminDetails?.country : "--"}</p>
                  </Col>
                </Row>
              </Col>

              <Modal className="settings-modal profile-modal modal-tabview"
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Form noValidate validated={validated} onSubmit={(e) => saveAdminProfile(e)}>
                  <Modal.Header className="d-flex justify-content-between">
                    <Modal.Title id="example-custom-modal-styling-title">
                      Edit Profile
                    </Modal.Title>
                    <span className="icon close" onClick={() => setShow(false)}></span>


                  </Modal.Header>

                  <Modal.Body className="launchpadadmin-modal">
                    {errorMessageProfile && (
                      <Alert variant="danger">
                        <div className='d-flex align-items-center'>
                          <span className='icon error-alert'></span>
                          <p className='m1-2' style={{ color: 'red' }}>{errorMessageProfile}</p>
                        </div>
                      </Alert>
                    )}
                    <Row className="mb-4">
                      <Col xl={12}>
                        <Row className="mt-3 mt-xl-0">
                          <Col xl={6} className="mb-3">
                          <Form.Label >User Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={adminDetails?.userName ? adminDetails?.userName : "--"}
                                readOnly disabled
                              />                            
                          </Col>
                          <Col xl={6} className="mb-3">
                          <Form.Label >Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={adminDetails?.email ? adminDetails?.email : "--"}
                                readOnly disabled
                              />
                          </Col>
                          <Col xl={6} className="mb-3">
                            <Form.Group className="position-relative" controlId="exampleForm.ControlInput1">
                              <Form.Label >First Name*</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={form?.firstName}
                                defaultValue={form?.firstName || adminDetails?.firstName}
                                autoComplete="off"
                                onChange={(e) => { setField('firstName', e.currentTarget.value) }}
                                isInvalid={!!errors.firstName}
                                required
                                placeholder="First Name"
                                maxLength={50}
                              />
                              <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col xl={6} className="mb-3">
                          <Form.Group className="position-relative" controlId="exampleForm.ControlInput1">
                              <Form.Label >Last Name*</Form.Label>
                              <Form.Control
                      type="text"
                      name="lastName"
                      value={form?.lastName}
                      defaultValue={form?.lastName || adminDetails?.lastName}
                      onChange={(e) => { setField('lastName', e.currentTarget.value) }}
                      isInvalid={!!errors.lastName}
                      required
                      placeholder="Last Name"
                      maxLength={50}
                    />
                               <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col xl={6} className="mb-3">
                          <Form.Group className="position-relative" controlId="exampleForm.ControlInput1">
                          <Form.Label >Phone No*</Form.Label>
                    <InputGroup className="mb-2 input-style no-wrap mobile-noinput">

                      <Form.Control
                        required
                        as="select"
                        type="select"
                        name="country"
                        className="code-width c-pointer"
                        aria-label="Default select example"
                        onChange={(e) => { setField('countryCode', e.currentTarget.value) }}
                        value={form?.countryCode}
                        defaultValue={form?.countryCode || adminDetails?.countryCode}
                        isInvalid={!!errors.countryCode}
                      >
                        <option>select</option>
                        {jsonPhoneCode.map((item, index) => (<>
                          <option key={index}>{item.code}</option>
                        </>
                        ))}
                        
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">{errors.countryCode}</Form.Control.Feedback>
                     
                      <Form.Control
                        type="text"
                        className="form-number input-radius"
                        name={'Gold'}
                        onChange={(e) => { setField('phoneNo', e.currentTarget.value) }}
                        isInvalid={!!errors.phoneNo}
                        value={form?.phoneNo}
                        defaultValue={form?.phoneNo || adminDetails?.phoneNo}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        required
                        autoComplete="off"
                        maxLength={12}
                      />
                      <Form.Control.Feedback type="invalid">{errors.phoneNo}</Form.Control.Feedback>
                    </InputGroup>
                    </Form.Group>
                          </Col>
                          <Col xl={6} className="mb-3">
                          <Form.Group className="" controlId="exampleForm.ControlInput1">
                          
                          <Form.Label >Country*</Form.Label>
                              <InputGroup className="mb-3 input-style no-wrap mobile-noinput country-code-style">

                                <Form.Control
                                  required
                                  as="select"
                                  type="select"
                                  name="country"
                                  className="c-pointer"
                                  aria-label="Default select example"
                                  value={form?.country}
                                  defaultValue={form?.country || adminDetails?.country}
                                  maxLength={20}
                                  isInvalid={!!errors.country}
                                  onChange={(e) => { setField('country', e.currentTarget.value) }}
                                >
                                  <option>Select Country</option>
                                  {jsonCountryCode.map((item, index) => (
                                    <option key={index}>{item.name}</option>
                                  ))}
                                </Form.Control>
                                {/* <span className="icon downarrow-white"></span> */}
                               
                                <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                              </InputGroup>
                              </Form.Group>
                          </Col>
                          
                        </Row>
                      </Col>
                    </Row>

                  </Modal.Body>
                  <Modal.Footer>
                    <div className="text-end btn-width"><Button className="cancel-btn" onClick={() => { handleCancel() }}>Cancel</Button>
                      <Button className="button-secondary ms-lg-3 ms-2" type="submit" disabled={loaderform}>
                        <span>{loaderform && <Spinner size="sm" className="text-light" />} </span>Save</Button></div>
                  </Modal.Footer>
                </Form>
              </Modal>
            </Row>
          </div>
        )}
          {success && <><div className="text-center toster-placement">
             <ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
           </div>
           </>}
      </div>
    </div>
  );
}

const connectStateToProps = ({ userConfig, oidc }) => {
  return { userConfig: userConfig?.userProfileInfo, adminDetails: oidc?.adminDetails,profileData:oidc?.profile ,twoFA: oidc?.profile, }
}

const connectDispatchToProps = dispatch => {
  return {
  }
}


export default connect(connectStateToProps, connectDispatchToProps)(UserProfile);
UserProfile.propTypes = {
  oidc: PropTypes.string
};