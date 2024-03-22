import React, { useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux'
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import moment from 'moment';
import ToasterMessage from "src/utils/toasterMessages";
import store from 'src/store/index';
import { projectedSaved } from "src/components/launchpad/launchpadReducer/launchpadReducer"
const reducer = (state, action) => {
  switch (action.type) {
    case "errorMsg":
      return { ...state, errorMsg: action.payload };
    case "claimloader":
      return { ...state, claimloader: action.payload };
    case "claimDetails":
      return { ...state, claimDetails: action.payload };
    case "scuess":
      return { ...state, scuess: action.payload };
    case "validated":
      return { ...state, validated: action.payload };
    case "errors":
      return { ...state, errors: action.payload };
    case "successMessage":
      return { ...state, successMessage: action.payload };
    case "success":
      return { ...state, success: action.payload };
    default:
      return state;
  }
}
const initialState = {
  errorMsg:null,
  claimloader: false,
  claimDetails: {},
  scuess: false,
  validated: false,
  errors: {},
  successMessage: null,
  success: false
};

const ProjectsTokenClaim = (props) => {
  const [formErrors, setFormErrors] = useState({});
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  let { mode } = useParams();
  const projectDetails = useSelector((reducerstate) => reducerstate?.projectDetails?.details)
  const investorsDetails = useSelector((reducerstate) => reducerstate.projectDetails)
  const isProjectCardsId = useSelector(reducerstate => reducerstate.oidc?.isProjectCardsId)
  const isAdmin = useSelector(reducerstate => reducerstate.oidc?.adminDetails);

  useEffect(() => {
    getClaimsandAllocations();
  }, []);
  const currentDate = new Date().toISOString().slice(0, 16);

  const setFlagInParent = (data) => {
    if (isAdmin.isAdmin) {
      props?.closeProject(data,true); 
    }

  };

  const handleChange = (field, event) => {
    let _data = { ...state.claimDetails };
    _data[event.target.name] = event.target.value;
    dispatch({ type: 'claimDetails', payload: _data })
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null })
    }
  }

  const validateForm = (obj) => {
    const { noofSlots, vestingDays, publicStartDate, publicEndDate, privateStartDate, privateEndDate } = obj || state?.claimDetails || {};
    const newErrors = {};
    const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
    if (!noofSlots || noofSlots === '') {
      newErrors.noofSlots = 'Is required';
    }
    if (!vestingDays || vestingDays === '') {
      newErrors.vestingDays = 'Is required';
    }
    if (!publicStartDate || publicStartDate === '') {
      newErrors.publicStartDate = 'Is required';
    } else if (publicStartDate && (!dateRegex.test(publicStartDate))) {
      newErrors.publicStartDate = 'Invalid Public Start Date';
    }
    if (!publicEndDate || publicEndDate === '') {
      newErrors.publicEndDate = 'Is required';
    } else if (publicEndDate && (!dateRegex.test(publicEndDate))) {
      newErrors.publicEndDate = 'Invalid Public End Date';
    }
    if (!privateStartDate || privateStartDate === '') {
      newErrors.privateStartDate = 'Is required';
    } else if (privateStartDate && (!dateRegex.test(privateStartDate))) {
      newErrors.privateStartDate = 'Invalid Private Start Date';
    }
    if (!privateEndDate || privateEndDate === '') {
      newErrors.privateEndDate = 'Is required';
    } else if (privateEndDate && (!dateRegex.test(privateEndDate))) {
      newErrors.privateEndDate = 'Invalid Private End Date';
    }

    return newErrors;

  }



  const parseTime = (timeString ) => {
    const selectedDate =timeString
    const datetime = new Date(selectedDate);
    const selectedTime = datetime.toLocaleTimeString();
    const [times, meridian] = selectedTime.split(' ');
    const [hours, minutes, seconds] = times.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (meridian?.toLowerCase() === "pm" && hours !== 12) {
      totalSeconds += 12 * 3600;
    } else if (meridian?.toLowerCase() === "am" && hours === 12) {
      totalSeconds -= 12 * 3600;
    }
    
    return totalSeconds;
  };


const time=(timeString)=>{
  const selectedDate =timeString
  const datetime = new Date(selectedDate);
  return  datetime.toLocaleTimeString();
}

const timeDate=(timeString)=>{
  if(timeString){
    return timeString.slice(0,10);
  }else{
    return '';
  }
}

  const handleClaimAndAllocation = async (event) => {
    event.preventDefault();
    dispatch({ type: 'errorMsg', payload: null })
    dispatch({ type: 'claimloader', payload: true })
    dispatch({ type: 'scuess', payload: false })
    if (
      props?.projectInfo?.projectStatus == "Deployed" ||
      props?.projectInfo?.projectStatus == "Rejected" ||
      props?.projectInfo?.projectStatus == "Approved"
    ) {
      if(isAdmin.isInvestor){
         return  navigate(`/launchpad/projects/${isAdmin.id}`);
      }
      if (investorsDetails.project == null) {
          navigate('/launchpad/idorequest');
        } else {
          navigate(`/launchpad/investors/projects/${investorsDetails?.project?.id}`);
        }
    } else {
      const privateEndingTimeInSeconds = parseTime(state.claimDetails?.privateEndDate);
      const privateStartingTimeInSeconds = parseTime(state.claimDetails?.privateStartDate);
     const publicEndingTimeInSeconds = parseTime(state.claimDetails?.publicEndDate);
     const publicStartingTimeInSeconds = parseTime(state.claimDetails?.publicStartDate);

      if (state.claimDetails?.noofSlots == 0) {
        dispatch({ type: 'errorMsg', payload: 'claim slots should be greater than zero.' })
        window.scroll(0, 0);
        dispatch({ type: 'claimloader', payload: false })
        return
      }
      if (state.claimDetails?.vestingDays==0) {
        dispatch({ type: 'errorMsg', payload: 'claim vesting time should be greater than zero.' })
        window.scroll(0, 0);
        dispatch({ type: 'claimloader', payload: false })
        return
      }

      // if (!state.claimDetails?.privateStartDate || !state.claimDetails?.privateEndDate || !state.claimDetails?.publicStartDate || !state.claimDetails?.publicEndDate) {
      //   dispatch({ type: 'errorMsg', payload: 'Please select dates.' })

      //   window.scroll(0, 0);
      //   dispatch({ type: 'claimloader', payload: false })

      // } 

      // else if (timeDate(state.claimDetails?.privateStartDate) && (timeDate(state.claimDetails?.privateEndDate) < timeDate(state.claimDetails?.privateStartDate))) {
      //   dispatch({ type: 'errorMsg', payload: 'Private Start date cannot be greater than the end date.' })
      //   window.scroll(0, 0);
      //   dispatch({ type: 'claimloader', payload: false })
      //   return
      // }

      // else if ((timeDate(state.claimDetails?.privateStartDate) == timeDate(state.claimDetails?.privateEndDate)) && 
      // (time(state.claimDetails?.privateEndDate)==time(state.claimDetails?.privateStartDate))) {
      //   dispatch({ type: 'errorMsg', payload: 'Private Start time and end time cannot be the same.' })
      //   window.scroll(0, 0);
      //   dispatch({ type: 'claimloader', payload: false })
      //   return
      // }

      // else if((timeDate(state.claimDetails?.privateStartDate) == timeDate(state.claimDetails?.privateEndDate))&& privateEndingTimeInSeconds <privateStartingTimeInSeconds){
      //   dispatch({ type: 'errorMsg', payload: 'Private Start time cannot be greater than the end time.' })
      //   window.scroll(0, 0);
      //   dispatch({ type: 'claimloader', payload: false })
      //   return
      // }
      // else if (timeDate(state.claimDetails?.publicStartDate) && (timeDate(state.claimDetails?.publicEndDate) < timeDate(state.claimDetails?.publicStartDate))) {
      //   dispatch({ type: 'errorMsg', payload: 'Public Start date cannot be greater than the end date.' })
      //   window.scroll(0, 0);
      //   dispatch({ type: 'claimloader', payload: false })
      //   return
      // }

      // else if ((timeDate(state.claimDetails?.publicStartDate) == timeDate(state.claimDetails?.publicEndDate)) && 
      // (time(state.claimDetails?.publicEndDate)==time(state.claimDetails?.publicStartDate))) {
      //   dispatch({ type: 'errorMsg', payload: 'Public Start time and end time cannot be the same.' })
      //   window.scroll(0, 0);
      //   dispatch({ type: 'claimloader', payload: false })
      //   return
      // }

      // else if((timeDate(state.claimDetails?.publicStartDate) == timeDate(state.claimDetails?.publicEndDate))&& publicEndingTimeInSeconds <publicStartingTimeInSeconds){
      //   dispatch({ type: 'errorMsg', payload: 'Public Start time cannot be greater than the end time.' })
      //   window.scroll(0, 0);
      //   dispatch({ type: 'claimloader', payload: false })
      //   return
      // }
      if (timeDate(state.claimDetails?.privateStartDate) > timeDate(state.claimDetails?.privateEndDate)) {
        dispatch({ type: 'errorMsg', payload: 'Private Start date cannot be greater than the end date.' });
        window.scroll(0, 0);
        dispatch({ type: 'claimloader', payload: false });
        return;
      } else if (timeDate(state.claimDetails?.privateStartDate) === timeDate(state.claimDetails?.privateEndDate)) {
        if (privateStartingTimeInSeconds >= privateEndingTimeInSeconds) {
          dispatch({ type: 'errorMsg', payload: 'Private Start time cannot be greater than or equal to the end time.' });
          window.scroll(0, 0);
          dispatch({ type: 'claimloader', payload: false });
          return;
        }
      }

      if (timeDate(state.claimDetails?.publicStartDate) > timeDate(state.claimDetails?.publicEndDate)) {
        dispatch({ type: 'errorMsg', payload: 'Public Start date cannot be greater than the end date.' });
        window.scroll(0, 0);
        dispatch({ type: 'claimloader', payload: false });
        return;
      } else if (timeDate(state.claimDetails?.publicStartDate) === timeDate(state.claimDetails?.publicEndDate)) {
        if (publicStartingTimeInSeconds >= publicEndingTimeInSeconds) {
          dispatch({ type: 'errorMsg', payload: 'Public Start time cannot be greater than or equal to the end time.' });
          window.scroll(0, 0);
          dispatch({ type: 'claimloader', payload: false });
          return;
        }
      }
      
     
     
      dispatch({ type: 'errorMsg', payload: null })

      let publicStartDate
      let publicEndDate
      let privateStartDate
      let privateEndDate
         publicStartDate = state.claimDetails?.publicStartDate && moment(state.claimDetails.publicStartDate).utc().format("YYYY-MM-DDTHH:mm");
         publicEndDate = state.claimDetails?.publicEndDate && moment(state.claimDetails.publicEndDate).utc().format("YYYY-MM-DDTHH:mm");
         privateStartDate = state.claimDetails?.privateStartDate && moment(state.claimDetails.privateStartDate).utc().format("YYYY-MM-DDTHH:mm");
         privateEndDate = state.claimDetails?.privateEndDate && moment(state.claimDetails.privateEndDate).utc().format("YYYY-MM-DDTHH:mm");
      let obj = {
        id: props?.projectId.id ? props?.projectId.id : "00000000-0000-0000-0000-000000000000",
        noofSlots: state.claimDetails != null ? state.claimDetails.noofSlots : '',
        vestingDays: state.claimDetails != null ? state.claimDetails.vestingDays : '',
        publicStartDate: publicStartDate,
        publicEndDate: publicEndDate,
        privateStartDate: privateStartDate,
        privateEndDate: privateEndDate,
      }
      const formError = validateForm(obj);
      if (Object.keys(formError)?.length > 0) {
        setFormErrors(formError)
        dispatch({ type: 'errors', payload: formError })
        dispatch({ type: 'claimloader', payload: false })
      } else {
        let res = await apiCalls.UpdateClaimsAndAllocation(obj);
        if (res.ok) {
          dispatch({ type: 'claimloader', payload: false })
          dispatch({ type: 'errorMsg', payload: null })
          dispatch({ type: 'success', payload: true })
          if (window.location.pathname.includes('idorequest')) {
            dispatch({ type: 'successMessage', payload: "Project saved successfully" })
          }else{
            dispatch({ type: 'successMessage', payload: "Project created successfully" })
          }
          setTimeout(function () {
            if (isAdmin.isAdmin) {
              navigate('/launchpad/idorequest');
            } else {
              navigate(`/launchpad/projects/${isAdmin.id}`);
            }
            dispatch({ type: 'success', payload: false })
            store.dispatch(projectedSaved(false));
           
          }, 2000);
          if (window.location.pathname.includes('idorequest')) {
            setFlagInParent(false)
          }
        }
        else {
          dispatch({ type: 'claimloader', payload: false })
          dispatch({ type: 'errorMsg', payload: apiCalls.isErrorDispaly(res) })
          window.scroll(0, 0);
          dispatch({ type: 'validated', payload: false })
        }
      }
      dispatch({ type: 'claimloader', payload: false })
    }
  };


  const getClaimsandAllocations = () => {
    dispatch({ type: 'claimloader', payload: false })
    let obj={};
    if(props?.projectInfo?.projectStatus=="Submitted" || 
    props?.projectInfo?.projectStatus=="Approved"||
    props?.projectInfo?.projectStatus=="Rejected"||
    props?.projectInfo?.projectStatus=="Deployed"){
      obj.id=projectDetails?.id
      obj.privateStartDate=convertUtcToLocal(projectDetails?.privateStartDate)
      obj.privateEndDate=convertUtcToLocal(projectDetails?.privateEndDate)
      obj.publicStartDate=convertUtcToLocal(projectDetails?.publicStartDate)
      obj.publicEndDate=convertUtcToLocal(projectDetails?.publicEndDate)
      obj.vestingDays=projectDetails?.vestingDays
      obj.noofSlots=projectDetails?.noofSlots
    }else{
      obj=projectDetails;
    }
    dispatch({ type: 'claimDetails', payload: obj })

  }

  const convertUtcToLocal = (date) => {
    if (!date) {
      return '';
    }
    const utcTime = date;
    const utcMoment = moment.utc(utcTime);
    const localMoment = utcMoment.local();
    return localMoment.format('YYYY-MM-DDTHH:mm');
   
  }


  const idoRequestBredCrumd = () => {
    navigate(mode === "projectsDetails" ? `/launchpad/investors` : `/launchpad/idorequest`)
    if (isAdmin.isAdmin) {
      props.closeProject(false)
    }
  }
 


  return (
    <>
      {!state.claimloader && <div>
        <Form noValidate validated={state?.validated} onSubmit={(e) => handleClaimAndAllocation(e)} className='launchpad-labels'>
          <>
            {state.errorMsg && (
              <Alert variant="danger">
                <div className='d-flex align-items-center'>
                  <span className='icon error-alert'></span>
                  <p className='m1-2' style={{ color: 'red' }}>{state.errorMsg}</p>
                </div>
              </Alert>
            )}

            {isAdmin?.isAdmin && window.location.pathname.includes('investors') && <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink href="#" onClick={() => navigate(mode === "projectsDetails" && `/launchpad/investors`)}>{mode === "projectsDetails" ? "Inverstors" : "Projects"}</CLink>
              </CBreadcrumbItem>
              {mode &&
                <CBreadcrumbItem>
                  <CLink href="#" onClick={() => navigate(`/launchpad/investors/projects/${isProjectCardsId}`)}>Projects</CLink>
                </CBreadcrumbItem>}
              <CBreadcrumbItem active>Token Claim</CBreadcrumbItem>
            </CBreadcrumb>}

            {isAdmin?.isAdmin && window.location.pathname.includes('idorequest') &&
              <CBreadcrumb>
                <CBreadcrumbItem>
                 
                  <CLink href="#" onClick={() => idoRequestBredCrumd()}>{"IDO Request"}</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem active>{"View"}</CBreadcrumbItem>
              </CBreadcrumb>}


            {!isAdmin?.isAdmin && <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink href="#" onClick={() => navigate(`/launchpad/projects/${isAdmin?.id}`)}>Projects</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>Token Claim</CBreadcrumbItem>
            </CBreadcrumb>}

            <div className='d-lg-flex align-items-center justify-content-between mb-2'><h3 className='section-title mb-2 mt-3'>Token Claim</h3><p className='mb-0 page-number'><span className='active-number'>3</span> of 3</p></div>


            <Row>
              <Col lg={6} md={12}>
                <Form.Label
                  controlId="floatingInput"
                  label="Claim Slots*"
                  className=""
                >Claim Slots<span className="text-danger">*</span></Form.Label>
                <Form.Control value={state.claimDetails?.noofSlots} name='noofSlots'
                  onKeyPress={(event) => {
                    const allowedKeys = /[0-9]/;
                    if (!allowedKeys.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  isInvalid={!!formErrors.noofSlots}
                  type="text" placeholder="No of Slots" onChange={(e) => handleChange("noofSlots", e)} required
                  disabled={
                    (props?.projectInfo?.projectStatus == "Deployed" ||
                      props?.projectInfo?.projectStatus == "Rejected" ||
                      props?.projectInfo?.projectStatus == "Approved") }
                />
                <Form.Control.Feedback type="invalid">{formErrors?.noofSlots || state.errors.noofSlots}</Form.Control.Feedback>


              </Col>
              <Col lg={6} md={12}>
                <Form.Label
                  controlId="floatingInput"
                  label="Claim Vesting Time*"
                  className=""
                >Claim Vesting Time<span className="text-danger">*</span></Form.Label>
                <Form.Control value={state.claimDetails?.vestingDays} name='vestingDays' type="text"
                  onKeyPress={(event) => {
                    const allowedKeys = /[0-9]/;
                    if (!allowedKeys.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  isInvalid={!!formErrors.vestingDays}
                  placeholder="Claim Vesting Time" onChange={(e) => handleChange("vestingDays", e)} required
                  disabled={
                    (props?.projectInfo?.projectStatus == "Deployed" ||
                      props?.projectInfo?.projectStatus == "Rejected" ||
                      props?.projectInfo?.projectStatus == "Approved")}
                />
                <Form.Control.Feedback type="invalid">{formErrors.vestingDays || state.errors.vestingDays}</Form.Control.Feedback>


              </Col>
            </Row>
            <h6 className='section-title mb-2 mt-4'>Allocation time</h6>
            <Row>
              <Col lg={6} md={12}>


                <Form.Group className="mb-3 " controlId="exampleForm.ControlInput1">
                  <Form.Label className=''>Round One Start Time<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="datetime-local" placeholder='Round One Start Time'
                    id="meeting-time"
                    name="privateStartDate"
                    value={state.claimDetails?.privateStartDate}
                    onChange={(e) => handleChange("privateStartDate", e)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.privateStartDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Approved") }
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.privateStartDate || state.errors.privateStartDate}</Form.Control.Feedback>
                </Form.Group>


              </Col>
              <Col lg={6} md={12}>



                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label className=''>Round One End Time<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="datetime-local" placeholder='Round One End Time'
                    id="meeting-time"
                    name="privateEndDate"
                    value={state.claimDetails?.privateEndDate}
                    onChange={(e) => handleChange("privateEndDate", e)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.privateEndDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Approved") }
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.privateEndDate || state.errors.privateEndDate}</Form.Control.Feedback>
                </Form.Group>

              </Col>


              <Col lg={6} md={12}>


                <Form.Group className="mb-3 " controlId="exampleForm.ControlInput1">
                  <Form.Label className=''>Round Two Start Time<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="datetime-local" placeholder='Round Two Start Time'
                    id="meeting-time"
                    name="publicStartDate"
                    value={state.claimDetails?.publicStartDate}
                    onChange={(e) => handleChange("publicStartDate", e)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.publicStartDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Approved") }
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.publicStartDate || state.errors.publicStartDate}</Form.Control.Feedback>
                </Form.Group>




              </Col>


              <Col lg={6} md={12}>


                <Form.Group className="mb-3 " controlId="exampleForm.ControlInput1">
                  <Form.Label className=''>Round Two End Time<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="datetime-local" placeholder='Round Two End Time'
                    id="meeting-time"
                    name="publicEndDate"
                    value={state.claimDetails?.publicEndDate}
                    onChange={(e) => handleChange("publicEndDate", e)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.publicEndDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Approved") }
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.publicEndDate || state.errors.publicEndDate}</Form.Control.Feedback>
                </Form.Group>



              </Col>
            </Row>
            <div className='footer-btns mt-xl-5 mb-5 d-flex justify-content-end'>
              <div className='d-flex align-items-center'>
                <Button className='cancel-btn me-3' onClick={props?.goBackToPoolsStaking}>
                   Back</Button>
               
                {' '}</div>
              <div>
                <Button className='button-secondary' type='submit'
               
                >
                  {
                    (props?.projectInfo?.projectStatus == "Deployed" ||
                      props?.projectInfo?.projectStatus == "Rejected" ||
                      props?.projectInfo?.projectStatus == "Approved") ? "Close" : "Save & Next"}
                </Button>{' '}



              </div>
            </div>

          </>

        </Form>
        {state.success &&<div className="">
          <ToasterMessage isShowToaster={state.success} success={state.successMessage}></ToasterMessage>
        </div>
        }

      </div>}
    </>
  )
}
ProjectsTokenClaim.propTypes = {
  closeProject: PropTypes.isRequired,
  goBackToPoolsStaking: PropTypes.isRequired,
  projectId: PropTypes.isRequired,
  projectInfo: PropTypes.isRequired
}
export default ProjectsTokenClaim;