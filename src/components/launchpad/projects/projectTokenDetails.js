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

  const handleChange = (field,event) => {
    let _data = { ...state.paymentDetails };
    _data[event.target.name] = event.target.value;
    dispatch({type:'paymentDetails',payload:_data}) 
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }
  const goBackToTokenDetails = () => {
    dispatch({type:'projectsPoolsStaking',payload:false})
  }
  const validateForm = (obj) => {
    const { privateTokenEquivalentToPaymentType,publicTokenEquivalentToPaymentType } = obj;
    const newErrors = {};
    if (!privateTokenEquivalentToPaymentType || privateTokenEquivalentToPaymentType === '') {
      newErrors.privateTokenEquivalentToPaymentType = 'Is required';
    }
    if (!publicTokenEquivalentToPaymentType || publicTokenEquivalentToPaymentType === '') {
      newErrors.publicTokenEquivalentToPaymentType = 'Is required';
    }
    return newErrors;
  };
  const handleSavePaymentDetails = async (event) => {
    dispatch({type:'validated',payload:true}) 
    dispatch({type:'scuess',payload:false}) 
    event.preventDefault();
    if (props?.projectDetails?.projectsViewModel?.projectStatus &&
      props?.projectDetails?.projectsViewModel?.projectStatus !== "Submitted" &&
      props?.projectDetails?.projectsViewModel?.projectStatus !== "Draft") {
      dispatch({type:'projectsPoolsStaking',payload:true}) 
      dispatch({type:'projetTokenData',payload: props?.projectDetails?.projectsViewModel}) 
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
        dispatch({type:'tokenloader',payload:false}) 
      } 
      else {
        
      // }
      // if (form.checkValidity() === true) {
        dispatch({type:'tokenloader',payload:true}) 
        
        let res = await apiCalls.UpdateProjectPayments(obj);
        if (res.ok) {
          store.dispatch(projectePayment(res.data));
          dispatch({type:'tokenloader',payload:false}) 
          dispatch({type:'sucess',payload:true}) 
          dispatch({type:'errorMgs',payload:null}) 
          dispatch({type:'tokenloader',payload:false}) 
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
          dispatch({type:'tokenloader',payload:false}) 
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

  const handleNumericInput = (event) => {
    const allowedKeys = /[0-9\b.]/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
    }
  };

  return (<>
    {state.tokenloader&&<div className="text-center"><Spinner ></Spinner></div>}
    {!state.projectsPoolsStaking && !state.tokenloader&&
    <div>
      
      {state.errorMgs && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{state.errorMgs}</p>
          </div>
        </Alert>
      )}
      <Form noValidate validated={state.validated} onSubmit={(e) => handleSavePaymentDetails(e)} className='launchpad-labels'>



      {isAdmin?.isAdmin&& window.location.pathname.includes('investors') &&   <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => navigate(mode === "projectsDetails" && `/launchpad/investors`)}>{mode === "projectsDetails" ? "Inverstors":"Projects"}</CLink>
          </CBreadcrumbItem>
          {mode &&
            <CBreadcrumbItem>
              <CLink href="#" onClick={() =>  navigate(`/launchpad/investors/projects/${isProjectCardsId}`) }>Projects</CLink>
            </CBreadcrumbItem>}
          <CBreadcrumbItem active>Payment method</CBreadcrumbItem>
        </CBreadcrumb>}

        { isAdmin?.isAdmin&& window.location.pathname.includes('idorequest')&&
        <CBreadcrumb>
           <CBreadcrumbItem>
          
           <CLink href="#" onClick={() => idoRequestBredCrumd()}>{"IDO Request"}</CLink>
         </CBreadcrumbItem>
         <CBreadcrumbItem active>{"View"}</CBreadcrumbItem>
         </CBreadcrumb>}



      {!isAdmin?.isAdmin&& <CBreadcrumb>
        <CBreadcrumbItem>
        <CLink href="#" onClick={() => navigate(`/launchpad/projects/${isAdmin?.id}` )}>Projects</CLink>
          </CBreadcrumbItem>
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
            >Private Token Equivalent to Payment Type*</Form.Label>
              <Form.Control 
              type="text" 
              value={state.paymentDetails?.privateTokenEquivalentToPaymentType}
               name='privateTokenEquivalentToPaymentType'
                 onKeyPress={handleNumericInput}
                placeholder="Private Token Equivalent to Payment Type" 
                onChange={(e) => handleChange("privateTokenEquivalentToPaymentType",e)} 
                isInvalid={!!errors?.privateTokenEquivalentToPaymentType}
                required
                disabled={
                 (props?.projectDetails?.projectsViewModel?.projectStatus=="Deployed" ||
                  props?.projectDetails?.projectsViewModel?.projectStatus=="Rejected" ||
                  props?.projectDetails?.projectsViewModel?.projectStatus=="Approved")}

                  

              />
              {/* <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback> */}
              <Form.Control.Feedback type="invalid">{errors?.privateTokenEquivalentToPaymentType ||
               state?.errors?.privateTokenEquivalentToPaymentType}</Form.Control.Feedback>

          </Col>
          <Col lg={6} md={12}>
          <Form.Label
              
              label="Public Token Equivalent to Payment Type*"
              className=""
            >Public Token Equivalent to Payment Type*</Form.Label>
              <Form.Control type="text" value={state.paymentDetails?.publicTokenEquivalentToPaymentType} 
              name='publicTokenEquivalentToPaymentType'
              onKeyPress={handleNumericInput}
                placeholder="Public Token Equivalent to Payment Type" 
                onChange={(e) => handleChange("publicTokenEquivalentToPaymentType",e)}
                 required
                isInvalid={!!errors?.publicTokenEquivalentToPaymentType}
                disabled={
                  (props?.projectDetails?.projectsViewModel?.projectStatus=="Deployed" ||
                   props?.projectDetails?.projectsViewModel?.projectStatus=="Rejected" ||
                   props?.projectDetails?.projectsViewModel?.projectStatus=="Approved")}
              />
              {/* <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback> */}
              <Form.Control.Feedback type="invalid">{errors?.publicTokenEquivalentToPaymentType ||
               state?.errors?.publicTokenEquivalentToPaymentType}</Form.Control.Feedback>
          </Col>
        </Row>
        <div className='footer-btns mt-xl-5 mb-5 d-flex justify-content-end'>
          <div className='d-flex align-items-center c-pointer'>

           

<Button className='cancel-btn me-2' onClick={props.onBack}>
              <span className='icon back-arrow me-1'></span> Back</Button>
              {' '}</div>
          <div>
            <Button className='primary-btn' type='submit'
            disabled={state.tokenloader}
            >
              <span>{state.tokenloader && <Spinner size="sm" />} </span>
              

{(props?.projectDetails?.projectsViewModel?.projectStatus=="Deployed"
                        ||props?.projectDetails?.projectsViewModel?.projectStatus=="Rejected"
                        ||props?.projectDetails?.projectsViewModel?.projectStatus=="Approved"
                        )? 
                        "Next" : "Save & Next"}

            </Button>{' '}
          </div>
        </div>


      </Form>
    </div>}
     
     {state.projectsPoolsStaking && <ProjectsTokenClaim closeProject={props.closeProject} goBackToPoolsStaking={goBackToTokenDetails} saveTiersDetails={state.saveTiersDetails} stakingDetails={state.stakingDetails} projectId={state.projetTokenData} projectInfo={props?.projectDetails?.projectsViewModel} />}  
     </>)
   
}
ProjectTokenDetails.propTypes = {
  onBack: PropTypes.bool,
  projectData: PropTypes.isRequired,
  projectDetails: PropTypes.isRequired,
  projectDetailsReducerData :PropTypes.isRequired,
  closeProject :PropTypes.isRequired,
}



const connectDispatchToProps = (dispatch) => {
  return {
   projectDetailsReducerData: (id,callback) => {
      dispatch(projectDetailsData(id,callback));
    },
  }
}
export default connect(null, connectDispatchToProps)(ProjectTokenDetails);