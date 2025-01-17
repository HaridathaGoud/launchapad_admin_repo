import React, { useState,useEffect,useReducer } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types'
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useNavigate, useParams } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react';
import { connect, useSelector } from 'react-redux';
import {  projectDetailsData, projectePayment } from '../launchpadReducer/launchpadReducer';
import store from 'src/store';
import ProjectsTokenClaim from './projectTokenClaim';
import { NumericFormat } from 'react-number-format';

const reducer = (state, action) => {
  switch (action.type) {
    case "errors":
      return { ...state, errors: action.payload };
    case "errorMgs":
      return { ...state, errorMgs: action.payload };
    case "projectsPoolsStaking":
      return { ...state, projectsPoolsStaking: action.payload };
    case "paymentDetails":
      return { ...state, paymentDetails: action.payload };
    case "tokenloader":
      return { ...state, tokenloader: action.payload };
      case "tokenBtnLoader":
      return { ...state, tokenBtnLoader: action.payload };
    case "projetTokenData":
      return { ...state, projetTokenData: action.payload };
    case "validated":
      return { ...state, validated: action.payload };
    case "scuess":
      return { ...state, scuess: action.payload };
     
    default:
      return state;
  }
}

const initialState = {
  errorMgs: null,
  projectsPoolsStaking:false,
  paymentDetails:{},
  projetTokenData:null,
  tokenloader:false,
  tokenBtnLoader:false,
  validated:false,
  scuess:false,
  errors: {}
};
const ProjectTokenDetails = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  let { mode } = useParams();
  const isProjectCardsId = useSelector(reducerstate => reducerstate.oidc?.isProjectCardsId)
  const projectePayments = useSelector(reducerstate => reducerstate.launchpad?.projectePayment);
  const isAdmin = useSelector(reducerstate =>  reducerstate.oidc?.adminDetails);
  const projectSaveDetails = useSelector(reducerstate => reducerstate.launchpad?.projectSaveDetails);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch({type:'tokenloader',payload:true})
    if(projectePayments){
      dispatch({type:'paymentDetails',payload:projectePayments}) 
      props.projectDetailsReducerData(projectSaveDetails?.id ,(callback)=>{ })
      setTimeout(function () {
        dispatch({type:'tokenloader',payload:false})
      }, 2000);
    }else{
      props.projectDetailsReducerData(projectSaveDetails?.id ,(callback)=>{
        dispatch({type:'paymentDetails',payload:callback.data?.projectPayment}) 
        setTimeout(function () {
          dispatch({type:'tokenloader',payload:false})
        }, 2000);
      })
      getPayments();
    }
  }, []);

  const handleChange = (field,value) => {
    dispatch({ type: 'paymentDetails', payload:{ ...state.paymentDetails,[field]: value }  })
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
      dispatch({ type: 'errors', payload: { ...state.errors,[field]: null } })
    }
  }

  const goBackToTokenDetails = () => {
    dispatch({type:'projectsPoolsStaking',payload:false})
  }
  const validateForm = (obj) => {
    const { privateTokenEquivalentToPaymentType,publicTokenEquivalentToPaymentType } = obj;//
    const newErrors = {};
    if ( privateTokenEquivalentToPaymentType === '' ||
     privateTokenEquivalentToPaymentType ===undefined ||
     privateTokenEquivalentToPaymentType === null ||
     isNaN(privateTokenEquivalentToPaymentType)) {
      newErrors.privateTokenEquivalentToPaymentType = 'Is required';
    }else if(privateTokenEquivalentToPaymentType === 0 || privateTokenEquivalentToPaymentType === '0'){
      newErrors.privateTokenEquivalentToPaymentType = 'Private Token Equivalent to Payment Type must be greater than zero';
    }
    if ( publicTokenEquivalentToPaymentType === '' ||
     publicTokenEquivalentToPaymentType ===undefined ||
     publicTokenEquivalentToPaymentType === null ||
     isNaN(publicTokenEquivalentToPaymentType)) {
      newErrors.publicTokenEquivalentToPaymentType = 'Is required';
    }else if(publicTokenEquivalentToPaymentType === 0 || publicTokenEquivalentToPaymentType === '0'){
      newErrors.publicTokenEquivalentToPaymentType = 'Public Token Equivalent to Payment Type must be greater than zero';
    }
    return newErrors;
  };
  const handleSavePaymentDetails = async (event) => {
    dispatch({type:'validated',payload:true}) 
    dispatch({type:'scuess',payload:false}) 
    dispatch({type:'tokenBtnLoader',payload:true}) 
    event.preventDefault();
    if (props?.isIdeoRequest || projectSaveDetails?.projectStatus == "Deploying" ||
    projectSaveDetails?.projectStatus == "Deployed") {
      dispatch({type:'projectsPoolsStaking',payload:true}) 
      dispatch({type:'projetTokenData',payload: props?.projectDetails?.projectsViewModel}) 
      dispatch({type:'tokenBtnLoader',payload:false}) 
    } else {
      let obj = {
        "id": props?.projectData?.id,
        "paymentType": state.paymentDetails.paymentType,
        "tokenSellingPrice": state.paymentDetails.tokenSellingPrice,
        "privateTokenEquivalentToPaymentType": state.paymentDetails.privateTokenEquivalentToPaymentType,
        "publicTokenEquivalentToPaymentType": state.paymentDetails.publicTokenEquivalentToPaymentType
      }
      let initialSupplyValue = obj?.privateTokenEquivalentToPaymentType
      let totalNumberOfTokenValue = obj?.publicTokenEquivalentToPaymentType

      if (typeof initialSupplyValue === 'string') {
        let sanitizedValue = initialSupplyValue.replace(/[^0-9.-]+/g, '');
        if (sanitizedValue.startsWith('.')) {
          sanitizedValue = '0' + sanitizedValue;
        }
        obj.privateTokenEquivalentToPaymentType = parseFloat(sanitizedValue);
      }
      if (typeof totalNumberOfTokenValue === 'string') {
        let sanitizedValue = totalNumberOfTokenValue.replace(/[^0-9.-]+/g, '');
        if (sanitizedValue.startsWith('.')) {
          sanitizedValue = '0' + sanitizedValue;
        }
        obj.publicTokenEquivalentToPaymentType = parseFloat(sanitizedValue);
      }
      const formErrors = validateForm(obj);
      if (Object.keys(formErrors)?.length > 0) {
        setErrors(formErrors)
        dispatch({ type: 'errors', payload: formErrors })
        dispatch({type:'projectsPoolsStaking',payload:false}) 
        dispatch({type:'tokenBtnLoader',payload:false}) 
      } 
      else {
      // }
      // if (form.checkValidity() === true) {        
        let res = await apiCalls.UpdateProjectPayments(obj);
        if (res.ok) {
          store.dispatch(projectePayment(res.data));
          dispatch({type:'tokenBtnLoader',payload:false}) 
          dispatch({type:'sucess',payload:true}) 
          dispatch({type:'errorMgs',payload:null}) 
          dispatch({type:'projectsPoolsStaking',payload:true}) 
          dispatch({type:'projetTokenData',payload:res.data}) 
          dispatch({type:'paymentDetails',payload:res.data}) 
          setTimeout(function () {
            dispatch({type:'sucess',payload:false}) 
          }, 2000);
        }
        else {
          dispatch({type:'errorMgs',payload:apiCalls.isErrorDispaly(res.data)}) 
          dispatch({type:'validated',payload:false}) 
          dispatch({type:'tokenBtnLoader',payload:false}) 
          window.scroll(0, 0);
          dispatch({type:'projectsPoolsStaking',payload:false}) 
        }
      }
      // else {
      //  dispatch({type:'projectsPoolsStaking',payload:false}) 
      //   dispatch({type:'tokenloader',payload:false}) 
      // }
    }
  }
  const getPayments = () => {
    dispatch({type:'paymentDetails',payload:props?.projectDetails?.projectPayment}) 
    setTimeout(function () {
      dispatch({type:'tokenloader',payload:false})
    }, 2000);
    
  }

  const idoRequestBredCrumd=()=>{
    navigate(mode === "projectsDetails" ? `/launchpad/investors` : `/launchpad/idorequest`)
    if(isAdmin?.isAdmin){
    props.closeProject(false)}
  }
  const clearErrorMsg=()=>{
    dispatch({type:'errorMgs',payload:null}) 
  }
  return (<>
    {state.tokenloader&&<div className="text-center"><Spinner ></Spinner></div>}
    {!state.projectsPoolsStaking && !state.tokenloader&&
    <div>
      
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
      <Form noValidate validated={state.validated} onSubmit={(e) => handleSavePaymentDetails(e)} className='launchpad-labels'>



      {isAdmin?.isAdmin&& window.location.pathname.includes('investors') &&   <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => navigate(mode === "projectsDetails" && `/launchpad/investors`)}>{mode === "projectsDetails" ? "Project Owners":"Projects"}</CLink>
          </CBreadcrumbItem>
          {props?.projectOwner && <CBreadcrumbItem >{props?.projectOwner}</CBreadcrumbItem>}
          {mode &&
            <CBreadcrumbItem>
              <CLink href="#" onClick={() =>  navigate(`/launchpad/investors/projects/${isProjectCardsId}`) }>Projects</CLink>
            </CBreadcrumbItem>}
            <CBreadcrumbItem >{projectSaveDetails?.projectName}</CBreadcrumbItem>
          <CBreadcrumbItem active>Payment method</CBreadcrumbItem>
        </CBreadcrumb>}
          
        { isAdmin?.isAdmin&& window.location.pathname.includes('idorequest')&&
        <CBreadcrumb>
           <CBreadcrumbItem>
          
           <CLink href="#" onClick={() => idoRequestBredCrumd()}>{"IDO Request"}</CLink>
         </CBreadcrumbItem>
         <CBreadcrumbItem >{projectSaveDetails?.projectName}</CBreadcrumbItem>
         <CBreadcrumbItem active>{"View"}</CBreadcrumbItem>
         </CBreadcrumb>}



      {!isAdmin?.isAdmin&& <CBreadcrumb>
        <CBreadcrumbItem>
        <CLink href="#" onClick={() => navigate(`/launchpad/projects/${isAdmin?.id}` )}>Projects</CLink>
          </CBreadcrumbItem>
          <CBreadcrumbItem >{projectSaveDetails?.projectName}</CBreadcrumbItem>
          <CBreadcrumbItem active>Payment method</CBreadcrumbItem>
      </CBreadcrumb>
      } 


        <div className='d-lg-flex align-items-center justify-content-between mb-2'><h3 className='section-title mb-4 mt-3'>Payment method</h3><p className='mb-0 page-number'><span className='active-number'>2</span> of 3</p></div>
        <h6 className='welcome-text mb-3'>Payment & Token Price</h6>
        <Row >
          
          <Col lg={6} md={12}>
          <Form.Label
              controlId="floatingInput"
              label="Private Token Equivalent to Payment Type*"
              className=""
            >Private Token Equivalent to Payment Type<span className="text-danger">*</span></Form.Label>
               <NumericFormat
                value={state.paymentDetails?.privateTokenEquivalentToPaymentType}
                name='privateTokenEquivalentToPaymentType'
                allowNegative={false}
                className='form-control'
                thousandSeparator={true}
                maxLength={22}
                decimalScale={6}
                placeholder="Private Token Equivalent to Payment Type"
                onChange={(e) => handleChange('privateTokenEquivalentToPaymentType', e.currentTarget.value)}
                onBlur={(e) => handleChange('privateTokenEquivalentToPaymentType', e.target.value.trim())}
                required
                isInvalid={!!(errors?.privateTokenEquivalentToPaymentType||state?.errors?.privateTokenEquivalentToPaymentType)}
                disabled={(projectSaveDetails?.projectStatus == "Deployed"
                  || projectSaveDetails?.projectStatus == "Deploying"
                  || props?.isIdeoRequest
                )}
              />
              {/* <Form.Control.Feedback type="invalid">{errors?.privateTokenEquivalentToPaymentType ||
               state?.errors?.privateTokenEquivalentToPaymentType}</Form.Control.Feedback> */}
              {(errors?.privateTokenEquivalentToPaymentType || state?.errors?.privateTokenEquivalentToPaymentType) && <span className='error-space'>
                {errors?.privateTokenEquivalentToPaymentType ||
                  state?.errors?.privateTokenEquivalentToPaymentType}</span>}
          </Col>
          <Col lg={6} md={12}>
          <Form.Label
              
              label="Public Token Equivalent to Payment Type*"
              className=""
            >Public Token Equivalent to Payment Type<span className="text-danger">*</span></Form.Label>
              <NumericFormat
                value={state.paymentDetails?.publicTokenEquivalentToPaymentType}
                name='publicTokenEquivalentToPaymentType'
                allowNegative={false}
                className='form-control'
                thousandSeparator={true}
                maxLength={22}
                decimalScale={6}
                placeholder="Public Token Equivalent to Payment Type"
                onChange={(e) => handleChange('publicTokenEquivalentToPaymentType', e.currentTarget.value)}
                onBlur={(e) => handleChange('publicTokenEquivalentToPaymentType', e.target.value.trim())}
                required
                isInvalid={!!(errors?.publicTokenEquivalentToPaymentType ||state?.errors?.privateTokenEquivalentToPaymentType)}
                disabled={(projectSaveDetails?.projectStatus == "Deployed"
                  || projectSaveDetails?.projectStatus == "Deploying"
                  || props?.isIdeoRequest
                )}
              />
              {/* <Form.Control.Feedback type="invalid">{errors?.publicTokenEquivalentToPaymentType ||
               state?.errors?.publicTokenEquivalentToPaymentType}</Form.Control.Feedback> */}
               {(errors?.publicTokenEquivalentToPaymentType || state?.errors?.publicTokenEquivalentToPaymentType) && <span className='error-space'>
                {errors?.publicTokenEquivalentToPaymentType ||
                  state?.errors?.publicTokenEquivalentToPaymentType}</span>}
          </Col>
        </Row>
        <div className='footer-btns mt-xl-5 mb-5 d-flex justify-content-end'>
          <div className='d-flex align-items-center c-pointer'>

           

              <Button className='cancel-btn me-2' onClick={props.onBack}>
                Back</Button>
              {' '}</div>
            <div>
              <Button className='button-secondary' type='submit'
                disabled={state.tokenloader}>
                <span>{state.tokenBtnLoader && <Spinner size="sm" className='text-light' />} </span>
                {(props?.isIdeoRequest) ? "Next" : "Save & Next"}
              </Button>{' '}
          </div>
        </div>


      </Form>
    </div>}
     
     {state.projectsPoolsStaking && <ProjectsTokenClaim isIdeoRequest={props?.isIdeoRequest} closeProject={props.closeProject} goBackToPoolsStaking={goBackToTokenDetails} 
     saveTiersDetails={state.saveTiersDetails} stakingDetails={state.stakingDetails} projectId={state.projetTokenData} 
     projectInfo={props?.projectDetails?.projectsViewModel} projectOwner={props?.projectOwner} />}  
     </>)
   
}
ProjectTokenDetails.propTypes = {
  onBack: PropTypes.banyool,
  projectData: PropTypes.any,
  projectDetails: PropTypes.any,
  projectDetailsReducerData :PropTypes.any,
  closeProject :PropTypes.any,
  isIdeoRequest : PropTypes.any
}



const connectDispatchToProps = (dispatch) => {
  return {
   projectDetailsReducerData: (id,callback) => {
      dispatch(projectDetailsData(id,callback));
    },
  }
}
export default connect(null, connectDispatchToProps)(ProjectTokenDetails);