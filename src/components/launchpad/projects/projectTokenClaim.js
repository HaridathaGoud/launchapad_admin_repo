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
import Spinner from 'react-bootstrap/esm/Spinner';
import { projectedSaved } from "src/components/launchpad/launchpadReducer/launchpadReducer"
import { NumericFormat } from 'react-number-format';
import { allocationValidation } from './formValidation';
const reducer = (state, action) => {
  switch (action.type) {
    case "errorMsg":
      return { ...state, errorMsg: action.payload };
    case "claimloader":
      return { ...state, claimloader: action.payload };
    case "claimBtnLoader":
        return { ...state, claimBtnLoader: action.payload };
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
  claimBtnLoader:false,
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
  const projectSaveDetails = useSelector(reducerstate => reducerstate.launchpad?.projectSaveDetails);


  useEffect(() => {
    dispatch({ type: 'claimloader', payload: true })
    getClaimsandAllocations();
    setTimeout(() => {
      dispatch({ type: 'claimloader', payload: false })
    }, 1000);
  }, []);
  const currentDate = new Date().toISOString().slice(0, 16);

  const setFlagInParent = (data) => {
    if (isAdmin.isAdmin) {
      props?.closeProject(data,true); 
    }

  };

  const handleChange = (field, value) => {
    dispatch({ type: 'claimDetails', payload:{ ...state.claimDetails,[field]: value }  })
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null });
      dispatch({ type: 'errorMsg', payload: '' });
      }
      dispatch({ type: 'errorMsg', payload: null });
  }

  



const time=(timeString)=>{
  const selectedDate =timeString
  const datetime = new Date(selectedDate);
  return  datetime.toLocaleTimeString();
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
  const getClaimsandAllocations = () => {
    let obj = {};
    if (props?.projectInfo?.projectStatus == "Submitted" ||
      props?.projectInfo?.projectStatus == "Approved" ||
      props?.projectInfo?.projectStatus == "Rejected" ||
      props?.projectInfo?.projectStatus == "Deployed") {
      obj.id = projectDetails?.id
      obj.privateStartDate = convertUtcToLocal(projectDetails?.privateStartDate)
      obj.privateEndDate = convertUtcToLocal(projectDetails?.privateEndDate)
      obj.publicStartDate = convertUtcToLocal(projectDetails?.publicStartDate)
      obj.publicEndDate = convertUtcToLocal(projectDetails?.publicEndDate)
      obj.vestingDays = projectDetails?.vestingDays
      obj.noofSlots = projectDetails?.noofSlots
    } else {
      obj = projectDetails;
    }
    dispatch({ type: 'claimDetails', payload: obj })

  }

  const handleClaimAndAllocation = async (event) => {
    event.preventDefault();
    dispatch({ type: 'errorMsg', payload: null })
    dispatch({ type: 'claimBtnLoader', payload: true })
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
          props.closeProject(false)
        } else {
          if (window.location.pathname.includes('idorequest')) {
            props.closeProject(false)
          }else{
            navigate(`/launchpad/investors/projects/${investorsDetails?.project?.id}`);
          }
        }
    }
    else {
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
      let tokenType = projectSaveDetails?.tokenType
      const formError = allocationValidation(obj,tokenType);
      if (Object.keys(formError)?.length > 1) {
        setFormErrors(formError)
        dispatch({ type: 'errors', payload: formError })
        dispatch({ type: 'errorMsg', payload: formError.errorMsg })
        dispatch({ type: 'claimBtnLoader', payload: false })
      } else {
        let res = await apiCalls.UpdateClaimsAndAllocation(obj);
        if (res.ok) {
          dispatch({ type: 'claimBtnLoader', payload: false })
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
          dispatch({ type: 'claimBtnLoader', payload: false })
          dispatch({ type: 'errorMsg', payload: apiCalls.isErrorDispaly(res) })
          window.scroll(0, 0);
          dispatch({ type: 'validated', payload: false })
        }
      }
      dispatch({ type: 'claimBtnLoader', payload: false })
    }
  };

  const idoRequestBredCrumd = () => {
    navigate(mode === "projectsDetails" ? `/launchpad/investors` : `/launchpad/idorequest`)
    if (isAdmin.isAdmin) {
      props.closeProject(false)
    }
  }
 

  return (
    <>
     {state.claimloader&&<div className="text-center"><Spinner ></Spinner></div>}
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
                <CBreadcrumbItem >{projectSaveDetails?.projectName}</CBreadcrumbItem>
              <CBreadcrumbItem active>Token Claim</CBreadcrumbItem>
            </CBreadcrumb>}

            {isAdmin?.isAdmin && window.location.pathname.includes('idorequest') &&
              <CBreadcrumb>
                <CBreadcrumbItem>
                 
                  <CLink href="#" onClick={() => idoRequestBredCrumd()}>{"IDO Request"}</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem >{projectSaveDetails.projectName}</CBreadcrumbItem>
                <CBreadcrumbItem active>{"View"}</CBreadcrumbItem>
              </CBreadcrumb>}


            {!isAdmin?.isAdmin && <CBreadcrumb>
              <CBreadcrumbItem>
                <CLink href="#" onClick={() => navigate(`/launchpad/projects/${isAdmin?.id}`)}>Projects</CLink>
              </CBreadcrumbItem>
              <CBreadcrumbItem >{projectSaveDetails?.projectName}</CBreadcrumbItem>
              <CBreadcrumbItem active>Token Claim</CBreadcrumbItem>
            </CBreadcrumb>}

            {projectSaveDetails?.tokenType != 'ERC-721' && <>
              <div className='d-lg-flex align-items-center justify-content-between mb-2'><h3 className='section-title mb-2 mt-3'>Token Claim</h3><p className='mb-0 page-number'><span className='active-number'>3</span> of 3</p>
              </div>
              <Row>
                <Col lg={6} md={12}>
                  <Form.Label
                    controlId="floatingInput"
                    label="Claim Slots*"
                    className=""
                  >Claim Slots<span className="text-danger">*</span></Form.Label>
                  <NumericFormat
                    value={state.claimDetails?.noofSlots}
                    name='noofSlots'
                    allowNegative={false}
                    className={`form-control ${formErrors.noofSlots ? 'is-invalid' : ''}`}
                    thousandSeparator={true}
                    placeholder="No of Slots"
                    onChange={(e) => handleChange('noofSlots', e.currentTarget.value)}
                    onBlur={(e) => handleChange('privateTokenEquivalentToPaymentType', e.target.value.trim().replace(/\s+/g, " "))}
                    required
                    isInvalid={!!formErrors?.noofSlots}
                    disabled={(projectSaveDetails?.projectStatus == "Deployed"
                      || projectSaveDetails?.projectStatus == "Rejected"
                      || projectSaveDetails?.projectStatus == "Approved"
                      || projectSaveDetails?.projectStatus == "Deploying"
                    )}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors?.noofSlots || state.errors.noofSlots}</Form.Control.Feedback>


                </Col>
                <Col lg={6} md={12}>
                  <Form.Label
                    controlId="floatingInput"
                    label="Claim Vesting Time*"
                    className=""
                  >Claim Vesting Time (Hours)<span className="text-danger">*</span></Form.Label>
                  <NumericFormat
                    value={state.claimDetails?.vestingDays}
                    name='vestingDays'
                    allowNegative={false}
                    className={`form-control ${formErrors.vestingDays ? 'is-invalid' : ''}`}
                    thousandSeparator={true}
                    placeholder="No of Slots"
                    onChange={(e) => handleChange('vestingDays', e.currentTarget.value)}
                    onBlur={(e) => handleChange('vestingDays', e.target.value.trim().replace(/\s+/g, " "))}
                    required
                    isInvalid={!!formErrors?.vestingDays}
                    disabled={(projectSaveDetails?.projectStatus == "Deployed"
                      || projectSaveDetails?.projectStatus == "Rejected"
                      || projectSaveDetails?.projectStatus == "Approved"
                      || projectSaveDetails?.projectStatus == "Deploying"
                    )}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.vestingDays || state.errors.vestingDays}</Form.Control.Feedback>


                </Col>
              </Row>
            </>}
            <h6 className='section-title mb-2 mt-4'>Allocation time</h6>
            <Row>
              <Col lg={6} md={12}>


                <Form.Group className="mb-3 " controlId="exampleForm.ControlInput1">
                  <Form.Label className=''>Round One Start Time<span className="text-danger">*</span></Form.Label>
                  <Form.Control type="datetime-local" placeholder='Round One Start Time'
                    id="meeting-time"
                    name="privateStartDate"
                    value={state.claimDetails?.privateStartDate}
                    onChange={(e)=>handleChange('privateStartDate',e.currentTarget.value)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.privateStartDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Deploying" ||
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
                    onChange={(e) => handleChange("privateEndDate", e.currentTarget.value)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.privateEndDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Deploying" ||
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
                    onChange={(e) => handleChange("publicStartDate", e.currentTarget.value)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.publicStartDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Deploying" ||
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
                    onChange={(e) => handleChange("publicEndDate", e.currentTarget.value)}
                    min={currentDate}
                    max={`${new Date().getFullYear() + 9999}-12-31T23:59`}
                    isInvalid={!!formErrors.publicEndDate}
                    disabled={
                      (props?.projectInfo?.projectStatus == "Deployed" ||
                        props?.projectInfo?.projectStatus == "Rejected" ||
                        props?.projectInfo?.projectStatus == "Deploying" ||
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
               
                ><span>{state.claimBtnLoader && <Spinner size="sm" className='text-light'/>} </span>
                  {
                    (props?.projectInfo?.projectStatus == "Deployed" ||
                      props?.projectInfo?.projectStatus == "Rejected" ||
                      props?.projectInfo?.projectStatus == "Deploying" ||
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