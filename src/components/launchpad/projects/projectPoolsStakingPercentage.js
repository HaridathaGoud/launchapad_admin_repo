import React, { useEffect,useReducer } from 'react';
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProjectsTokenClaim from './projectTokenClaim';
import apiCalls from 'src/api/apiCalls';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useParams,useNavigate } from 'react-router-dom';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { useSelector } from 'react-redux';


const reducer = (state, action) => {
  switch (action.type) {
    case "tokenClaimShow":
      return { ...state, tokenClaimShow: action.payload };
    case "saveTiersDetails":
      return { ...state, saveTiersDetails: action.payload };
    case "errorMgs":
      return { ...state, errorMgs: action.payload };
    case "stakingDetails":
      return { ...state, stakingDetails: action.payload };
    case "stakingloader":
      return { ...state, stakingloader: action.payload };
    case "validated":
      return { ...state, validated: action.payload };
    case "scuess":
      return { ...state, scuess: action.payload };
     
    default:
      return state;
  }
}
const initialState = {
  tokenClaimShow:false,
  saveTiersDetails:[],
  errorMgs: null,
  stakingDetails:null,
  stakingloader:false,
  validated:false,
  scuess:false,

};


const ProjectsPoolsStaking = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  let { projectId, mode } = useParams();
  const isProjectCardsId = useSelector(reducerstate => reducerstate.oidc?.isProjectCardsId)
  const isAdmin = useSelector(reducerstate =>  reducerstate.oidc?.adminDetails);
  const projectSaveDetails = useSelector(reducerstate => reducerstate.launchpad?.projectSaveDetails);


  useEffect(() => {
    dispatch({type:'stakingloader',payload:true})
    getTiers();
  }, []);


  
  const handleChange = (e, type) => {
    let value = e.target.value;
    let _data = Object.assign([], state.saveTiersDetails);

    let obj = {
      "name": type,
      "type": 'percentage',
      "volume": value
    }
    if (type == "Bronze") {
      _data[0] = obj;
    }
    else if (type == "Silver") {
      _data[1] = obj;
    }
    else if (type == "Gold") {
      _data[2] = obj;
    }
    else if (type == "Platinum") {
      _data[3] = obj;
    }
    else if (type == "Diamond") {
      _data[4] = obj;
    }
    else if (type == "BlueDiamond") {
      _data[5] = obj;
    }
    dispatch({type:'saveTiersDetails',payload:_data}) 
 
  }

  const goBackToPoolsStaking = () => {
    dispatch({type:'tokenClaimShow',payload:false}) 
    dispatch({type:'stakingloader',payload:false})
  }
  const savetier = async (event) => {
    dispatch({type:'stakingloader',payload:true})
    event.preventDefault();
    dispatch({type:'errorMgs',payload:null}) 
    dispatch({type:'validated',payload:true}) 
    dispatch({type:'scuess',payload:false}) 
    if (props?.projectInfo?.projectStatus && props?.projectInfo?.projectStatus !== "Submitted"&&
    props?.projectInfo?.projectStatus !== "Draft") {
      dispatch({type:'tokenClaimShow',payload:true})
    } else {
      dispatch({type:'stakingloader',payload:true})
      const form = event.currentTarget;
      if (form.checkValidity() === true) {
        
        let res = await apiCalls.savetiers(projectSaveDetails?.id == null ?props?.projectTokenData?.id:projectSaveDetails?.id, state.saveTiersDetails);
        if (res.ok) {
          dispatch({type:'sucess',payload:true})
          dispatch({type:'saveTiersDetails',payload:res.data})
          dispatch({type:'stakingDetails',payload:res.data})
          dispatch({type:'tokenClaimShow',payload:true})
          dispatch({type:'stakingloader',payload:false})
          setTimeout(function () {
            dispatch({type:'sucess',payload:false})
          }, 2000);

        } else {
          dispatch({type:'errorMgs',payload:apiCalls.isErrorDispaly(res)})
          dispatch({type:'validate',payload:false})
          window.scroll(0, 0);
          dispatch({type:'tokenClaimShow',payload:false})
          dispatch({type:'stakingloader',payload:false})
        }
      } else {
        dispatch({type:'validate',payload:true})
        dispatch({type:'tokenClaimShow',payload:false})
        dispatch({type:'stakingloader',payload:false})
      }
    }

  }
  const getTiers = async () => {
    dispatch({type:'stakingloader',payload:true})
    dispatch({type:'errorMgs',payload:null})
    let res = await apiCalls.getTiers(projectSaveDetails?.id == null ? (projectId || props.projectInfo?.id) :projectSaveDetails?.id);
    if (res.ok) {
      dispatch({type:'saveTiersDetails',payload:res?.data})
      dispatch({type:'stakingloader',payload:false})
    }
    else {
      dispatch({type:'errorMgs',payload:apiCalls.isErrorDispaly(res)})
      dispatch({type:'stakingloader',payload:false})
    }
  };
  const idoRequestBredCrumd=()=>{
    navigate(mode === "projectsDetails" ? `/launchpad/investors` : `/launchpad/idorequest`)
    if(isAdmin.isAdmin){
      props.closeProject(false)
    }
   
  }


  return (<>
{state.stakingloader&&<div className="text-center"><Spinner ></Spinner></div>}
    {!state.tokenClaimShow && !state.stakingloader&&
     <div>
      {state.errorMgs && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
          <span className='icon error-alert'></span>
          <p className='m1-2' style={{ color: 'red' }}>{state.errorMgs}</p>
          </div>
        </Alert>
      )}
      <Form noValidate validated={state.validated} onSubmit={(e) => savetier(e)} className='launchpad-labels'>

      {isAdmin?.isAdmin&& window.location.pathname.includes('investors') &&  <CBreadcrumb>
          <CBreadcrumbItem>
            <CLink href="#" onClick={() => navigate(mode === "projectsDetails" && `/launchpad/investors`)}>{mode === "projectsDetails" ? "Inverstors":"Projects"}</CLink>
          </CBreadcrumbItem>
          {mode &&
            <CBreadcrumbItem>
              <CLink href="#" onClick={() => navigate(`/launchpad/investors/projects/${isProjectCardsId}`) }>Projects</CLink>
            </CBreadcrumbItem>}
          <CBreadcrumbItem active>Pools staking percentage</CBreadcrumbItem>
        </CBreadcrumb>}

        {isAdmin?.isAdmin && window.location.pathname.includes('idorequest')&&
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
          <CBreadcrumbItem active>Pools staking percentage</CBreadcrumbItem>
      </CBreadcrumb>
      } 
        <div className='d-lg-flex align-items-center justify-content-between mb-4 mt-3'><h3 className='section-title mb-0'>Pools staking percentage</h3><p className='mb-0 page-number'><span className='active-number'>3</span> of 4</p></div>
        <h6 className='welcome-text mb-2'>Pool Weight</h6>

        <Row>
          <Col lg={6} md={12}>
            <Form.Label
              controlId="floatingInput"
              label="Bronze Tier*"
              className=""
            >Bronze Tier*</Form.Label>
              <Form.Control className='mb-0' type="text" name={"Bronze"} value={state.saveTiersDetails[0]?.volume}
                onKeyPress={(event) => {
                  const allowedKeys = /[0-9\b.]/;
                        if (!allowedKeys.test(event.key)) {
                          event.preventDefault();
                        }
                }}
                placeholder="Bronze Tier" onChange={(e) => handleChange(e, "Bronze")} required
                disabled={
                  (projectSaveDetails?.projectStatus =="Deployed" ||
                  projectSaveDetails?.projectStatus =="Rejected" ||
                  projectSaveDetails?.projectStatus =="Approved")}
              />
              <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
           

          </Col>
          <Col lg={6} md={12}>
            <Form.Label
              controlId="floatingInput"
              label="Silver Tier*"
              className=""
            >Silver Tier*</Form.Label>
              <Form.Control type="text" name={"Silver"} value={state.saveTiersDetails[1]?.volume}
                onKeyPress={(event) => {
                  const allowedKeys = /[0-9\b.]/;
                  if (!allowedKeys.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                placeholder="Silver Tier" onChange={(e) => handleChange(e, "Silver")} required
                disabled={
                  (projectSaveDetails?.projectStatus =="Deployed" ||
                  projectSaveDetails?.projectStatus =="Rejected" ||
                  projectSaveDetails?.projectStatus =="Approved") }
              />
              <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
           

          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12}>
            <Form.Label
              controlId="floatingInput"
              label="Gold Tier*"
              className=""
            >Gold Tier*</Form.Label>
              <Form.Control type="text" name={"Gold"} value={state.saveTiersDetails[2]?.volume}
                onKeyPress={(event) => {
                  const allowedKeys = /[0-9\b.]/;
                        if (!allowedKeys.test(event.key)) {
                          event.preventDefault();
                        }
                }}
                placeholder="Gold Tier" onChange={(e) => handleChange(e, "Gold")} required
                disabled={
                  (projectSaveDetails?.projectStatus =="Deployed" ||
                  projectSaveDetails?.projectStatus =="Rejected" ||
                  projectSaveDetails?.projectStatus =="Approved") }
              />
              <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
           

          </Col>
          <Col lg={6} md={12}>
           
            <Form.Label
              controlId="floatingInput"
              label="Platinum Tier*"
              className=""
            >Platinum Tier*</Form.Label>
              <Form.Control type="text" name={"Platinum"} value={state.saveTiersDetails[3]?.volume}
                onKeyPress={(event) => {
                  const allowedKeys = /[0-9\b.]/;
                        if (!allowedKeys.test(event.key)) {
                          event.preventDefault();
                        }
                }}
                placeholder="Platinum Tier" onChange={(e) => handleChange(e, "Platinum")} required
                disabled={
                  (projectSaveDetails?.projectStatus =="Deployed" ||
                  projectSaveDetails?.projectStatus =="Rejected" ||
                  projectSaveDetails?.projectStatus =="Approved") }
              />
              <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
          
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12}>
            <Form.Label
              
              label="Diamond Tier*"
              className=""
            >Diamond Tier*</Form.Label>
              <Form.Control type="text" name={"Diamond"} value={state.saveTiersDetails[4]?.volume}
                onKeyPress={(event) => {
                  const allowedKeys = /[0-9\b.]/;
                  if (!allowedKeys.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                placeholder="Diamond Tier" onChange={(e) => handleChange(e, "Diamond")} required
                disabled={
                  (projectSaveDetails?.projectStatus =="Deployed" ||
                  projectSaveDetails?.projectStatus =="Rejected" ||
                  projectSaveDetails?.projectStatus =="Approved") }
              />
              <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
            
          </Col>
          <Col lg={6} md={12}>
            <Form.Label
              controlId="floatingInput"
              label="Blue Diamond Tier*"
              className=""
            >Blue Diamond Tier*</Form.Label>
              <Form.Control type="text" name={"BlueDiamond"} value={state.saveTiersDetails[5]?.volume}
                onKeyPress={(event) => {
                  const allowedKeys = /[0-9\b.]/;
                  if (!allowedKeys.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                placeholder="Blue Diamond Tier" onChange={(e) => handleChange(e, "BlueDiamond")} required
                disabled={
                  (projectSaveDetails?.projectStatus =="Deployed" ||
                  projectSaveDetails?.projectStatus =="Rejected" ||
                  projectSaveDetails?.projectStatus =="Approved")}
              />
              <Form.Control.Feedback type="invalid">Is required</Form.Control.Feedback>
          

          </Col>
        </Row>

        <div className='footer-btns mt-xl-5 mb-5 d-flex justify-content-end'>
          <div className='d-flex align-items-center c-pointer'>
            <Button className='cancel-btn me-4'
           onClick={props?.goBackToTokenDetails}><span className='icon back-arrow me-1' ></span> Back</Button>
           
           {' '}</div>
          <div>
            <Button className='primary-btn' type='submit'
            disabled={state.stakingloader}
            >
              <span>{state.stakingloader && <Spinner size="sm" />} </span>
              {
                  (projectSaveDetails?.projectStatus =="Deployed" ||
                  projectSaveDetails?.projectStatus =="Rejected" ||
                  projectSaveDetails?.projectStatus =="Approved") ? "Next" : "Save & Next"}
            </Button>{' '}
          </div>
        </div>
      </Form>
    </div>}
    {state.tokenClaimShow && <ProjectsTokenClaim closeProject={props.closeProject} goBackToPoolsStaking={goBackToPoolsStaking} saveTiersDetails={state.saveTiersDetails} stakingDetails={state.stakingDetails} projectId={props?.projectTokenData?.id} projectInfo={props?.projectInfo} />}
  </>)
}
// ProjectsPoolsStaking.propTypes = {
//   goBackToTokenDetails: PropTypes.bool,
//   projectData: PropTypes.isRequired,
//   projectTokenData: PropTypes.isRequired,
//   projectInfo: PropTypes.isRequired
// }
export default ProjectsPoolsStaking;
