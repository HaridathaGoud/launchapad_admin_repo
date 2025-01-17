import React, { useState, useEffect } from "react";
import { Spinner, Modal, Placeholder } from 'react-bootstrap';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { connect, useSelector } from "react-redux";
import { validateContent } from '../../utils/custom.validator';
import ToasterMessage from "src/utils/toasterMessages";

const Settings = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loaderform, setLoaderform] = useState(false);
  const [success, setSuccess] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const userProfile = useSelector(state => state.oidc?.profile?.profile)
  const [adminDetails, setAdminDetails] = useState()
  const [pageLoader,setPageLoader]=useState(false);

  useEffect(() => {
    getAdminDetails(userProfile?.sub)
  }, [])


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

  const handlehange = () => {
    setForm(null)
    setShow(true);
    setValidated(false)
  }

  const handle2FA = (e) => {
    let url = "";
    if (e.target.checked) {
      url =
        process.env.REACT_APP_AUTHORITY +
        "/account/login?returnUrl=/manage/EnableAuthenticator";
    } else {
      url =
        process.env.REACT_APP_AUTHORITY +
        "/account/login?returnUrl=/manage/Disable2faWarning";
    }
    window.open(url, "_self");
  }

  const showHidePassword = (value) => {
    if (value === "currentpassword") {
      setCurrentPasswordType(currentPasswordType === 'input' ? 'password' : 'input');
    }
    else if (value === "password") {
      setPasswordType(passwordType === 'input' ? 'password' : 'input');
    }
    else if (value === "confirmpassword") {
      setConfirmPasswordType(confirmPasswordType === 'input' ? 'password' : 'input');
    }
  }

  const handleCancel = () => {
    setShow(false);
    setPasswordErrorMsg(null);
    setCurrentPasswordType("password");
    setPasswordType("password");
    setConfirmPasswordType("password");
    setErrors({});
    setForm({});
  }

  const validateForm = (obj, isChange) => {
    const newErrors = {};
    if (!form?.currentPassword) {
      newErrors.currentPassword = "Please enter current password";
    } else {
      const { currentPassword, password, confirmPassword } = isChange ? obj : form;
      if (!currentPassword || currentPassword === '') {
        newErrors.currentPassword = "Please enter current password";
      }
      if (!password || password === '') {
        newErrors.password = "Please enter your password";
      }
      else if (password && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/.test(password))) {
        newErrors.password =
          "Password must have at least 8 characters and cannot contain common words or patterns. Try adding numbers, symbols, or characters to make your password longer and unique."

      }
      else if (!validateContent(password)) {
        newErrors.password =
          "Please enter valid content"
      }
      if (!confirmPassword || confirmPassword === '') {
        newErrors.confirmPassword = "Please enter confirm password";
      }
      else if (confirmPassword !== password) {
        newErrors.confirmPassword = "Password does not match";
      }
    }


    return newErrors;
  }
  const getAdminDetails = async (id) => {
    setPageLoader(true);
    const response = await apiCalls.fetchAdminDetails(id);
    if (response.ok) {
      setAdminDetails(response.data)
      setPageLoader(false);
    } else {
      setErrors(apiCalls.isErrorDispaly(response))
      setPageLoader(false);
    }
  }


  const handleUpdate = async (e) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    setLoaderform(false);
    if ((form?.currentPassword && form?.password) && (form?.currentPassword === form?.password)) {
      return setPasswordErrorMsg("Current password and New password should not be same");
    }
    const formErrors = validateForm();
    if (Object.keys(formErrors)?.length > 0) {
      setErrors(formErrors);
    }
    else {
      setLoaderform(true);
      let obj = Object.assign({}, form);
      obj.email = apiCalls.encryptValue(adminDetails?.email, adminDetails?.tokenEncryptKey);
      obj.currentPassword = apiCalls.encryptValue(form.currentPassword, adminDetails?.tokenEncryptKey);
      obj.password = apiCalls.encryptValue(form.password, adminDetails?.tokenEncryptKey);
      obj.confirmPassword = apiCalls.encryptValue(form.confirmPassword, adminDetails?.tokenEncryptKey);
      obj.info = apiCalls.encryptValue(adminDetails?.tokenEncryptKey, adminDetails?.tokenEncryptKey);
      let response = await apiCalls.changePassword(obj)
      if (response.ok) {
        setSuccess("Password changed successfully");
        setLoaderform(false);
        setShow(false)
        setTimeout(function () {
          setSuccess(null);
        }, 2000);
      }
      else {
        setPasswordErrorMsg(apiCalls.isErrorDispaly(response));
        setLoaderform(false);
      }
      setValidated(true);
      setLoaderform(false);
    }
  }
  const clearErrorMsg=()=>{
    setPasswordErrorMsg(null);
    setErrorMessage(null)
  }
  return (
    <div className=''>
    {pageLoader && <div className="text-center">
    <Row className='card-row mt-3 justify-content-center'>
        <Col xl={6}>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} className='status-card' />
          </Placeholder>
        </Col>
        <Col xl={6}>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} className='status-card' />
          </Placeholder>
        </Col>
        
      </Row>
      </div>}
    {!pageLoader &&
      <div className='profile-container'>

        <h5 className="page-title mb-3 mt-3">Settings</h5>
        {errorMessage && (
          <Alert variant="danger">
          <div className='d-flex gap-4'>
           <div className='d-flex gap-2 flex-1'>
           <span className='icon error-alert'></span>
           <p className='m1-2' style={{ color: 'red' }}>{errorMessage}</p>
           </div>
           <span className='icon close-red' onClick={clearErrorMsg}></span>
          </div>
        </Alert>
        )}
        
        <div className="d-lg-flex gap-4 ">
          <div className='profile-section flex-1 mb-4 mb-lg-0'>

            <div className="d-flex justify-content-between align-items-center"><h6 className="settings-text">Two Factor Authentication</h6><Form.Check
              className="mint-check-switcher"
              type="switch"
              id="custom-switch"
              checked={adminDetails?.is2FA}
              onChange={(e) => handle2FA(e)}
            /></div>
            <p className="settings-label">Protect your account with 2-step verification</p>
          </div>

          <div className='profile-section flex-1'>
            <h6 className="settings-text">Change Password</h6>
            <p className="settings-label">Choose a unique password to protect your account.</p>
            <Button className="filled-btn mt-3" onClick={handlehange} >Change</Button>
          </div>
        </div>
        <Modal className="settings-modal"
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          keyboard={false}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        ><Form noValidate validated={validated} onSubmit={handleUpdate}>
            <Modal.Header className="d-flex justify-content-between">
              <Modal.Title id="example-custom-modal-styling-title">
                Change Password
              </Modal.Title>
              <span className="icon close" onClick={() => handleCancel()}></span>
            </Modal.Header>
            <Modal.Body>
              {passwordErrorMsg && (
                <Alert variant="danger">
                <div className='d-flex gap-4'>
                  <div className='d-flex gap-2 flex-1'>
                    <span className='icon error-alert'></span>
                    <p className='m1-2' style={{ color: 'red' }}>{passwordErrorMsg}</p>
                  </div>
                  <span className='icon close-red' onClick={clearErrorMsg}></span>
                </div>
              </Alert>
              )}
              <Row className="change-passwordmodal">
                <Col xl={12}>
                <Form.Group className="position-relative" controlId="exampleForm.ControlInput1">
                        <Form.Label >Current Password<span className="text-danger">*</span></Form.Label>
                        <Form.Control name='currentPassword'
                      type={currentPasswordType}
                      autoComplete="off"
                      maxLength={15}
                      placeholder="Type your current password"
                      value={form?.currentPassword}
                      onChange={(e) => { setField('currentPassword', e.currentTarget.value) }}
                      isInvalid={!!errors.currentPassword}
                      required />
                      <span className={`${currentPasswordType === "password" ? "icon password-view" : "icon password-hide"}`} onClick={() => showHidePassword('currentpassword')}></span>
                      <Form.Control.Feedback type="invalid" className="error-alignment" >{errors?.currentPassword}</Form.Control.Feedback>
                      </Form.Group>

                </Col>
                <Col xl={12}>
                <Form.Group className="position-relative" controlId="exampleForm.ControlInput1">
                        <Form.Label >New Password<span className="text-danger">*</span></Form.Label>
                        <Form.Control name='password' type={passwordType}
                      autoComplete="off"
                      maxLength={15}
                      onChange={(e) => { setField('password', e.currentTarget.value) }}
                      placeholder="Type your new password"
                      value={form?.password}
                      isInvalid={!!errors.password}
                      required

                    />
                      <span className={`${passwordType === "password" ? "icon password-view" : "icon password-hide"}`} onClick={() => showHidePassword('password')}></span>
                      <Form.Control.Feedback type="invalid" className="error-alignment" >{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                </Col>
                <Col xl={12}>
                <Form.Group className="position-relative" controlId="exampleForm.ControlInput1">
                        <Form.Label >Confirm Password<span className="text-danger">*</span></Form.Label>
                        <Form.Control name='confirmPassword' type={confirmPasswordType}
                      autoComplete="off"
                      maxLength={15}
                      placeholder="Re-type your new password"
                      value={form?.confirmPassword}
                      onChange={(e) => { setField('confirmPassword', e.currentTarget.value) }}
                      isInvalid={!!errors.confirmPassword}
                      required />
                      <span className={`${confirmPasswordType === "password" ? "icon password-view" : "icon password-hide"}`} onClick={() => showHidePassword('confirmpassword')}></span>
                      <Form.Control.Feedback type="invalid" className="error-alignment" >{errors.confirmPassword}</Form.Control.Feedback>
                      </Form.Group>
                </Col>
              </Row>

            </Modal.Body>
            <Modal.Footer>
              <div className="text-end"><Button className="cancel-btn" onClick={() => handleCancel()}>Cancel</Button>
                <Button className="button-secondary ms-lg-3 ms-2" type="submit" disabled={loaderform} >
                  <span>{loaderform && <Spinner size="sm" />} </span>Update</Button></div>
            </Modal.Footer>
          </Form>

        </Modal>
        {success && <div className="text-center">
          <ToasterMessage isShowToaster={success} success={success}></ToasterMessage>
        </div>
        }
      </div>}
    </div>
  );
}
const connectStateToProps = ({ userConfig, oidc }) => {
  return { userConfig: userConfig?.userProfileInfo, oidc: oidc?.user, twoFA: oidc?.profile, }
}
const connectDispatchToProps = dispatch => {
  return {
  }
}

export default connect(connectStateToProps, connectDispatchToProps)(Settings);