import React, { useEffect,useRef, useState} from 'react'
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect, useSelector } from 'react-redux';
import { SuperAdminDetails, UpComingProjectDetails, getAdminDashboardDetails } from './launchpadReducer/launchpadReducer';
import store from 'src/store';
import { showSettings } from 'src/reducers/authReducer';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types'

const DashboardPage = (props) => {
  const isAdmin = useSelector(reducerstate => reducerstate.oidc?.adminDetails?.isAdmin);
   const AdminId = useSelector(reducerstate => reducerstate.oidc?.adminDetails?.id);
  const SuperAdminDetail =useSelector(reducerstate=>reducerstate?.launchpad?.superAdminDetails)
  const adminDashboard =useSelector(reducerstate=>reducerstate?.launchpad?.adminDashboardDetails)
  const showSetting = useSelector(reducerstate => reducerstate.oidc?.isShowSettings)
  const shouldLog = useRef(true);
  const [loader,setLoader] = useState(false);
  useEffect(() => {
    setLoader(true)
    if (shouldLog.current) {
      shouldLog.current = false;
      props.superAdminDetails((callback)=>{
        if(callback?.data){
          setLoader(false)
        }
      })
      props.upcomingProjectsDetails()
      props.adminDashboardDetails(AdminId)
      if(showSetting){
        store.dispatch(showSettings(false));
      }
    }
  }, [AdminId]);
  return (
    <>
    {loader ? <div className="text-center"><Spinner ></Spinner></div> : 
    <>
     <CBreadcrumb>
        <CBreadcrumbItem className='text-opacity-50'>
          Launchpad
        </CBreadcrumbItem>
        <CBreadcrumbItem active>Dashboard</CBreadcrumbItem>
      </CBreadcrumb>
      {(SuperAdminDetail.errorMsg||adminDashboard.errorMsg) && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{(SuperAdminDetail.errorMsg || adminDashboard.errorMsg)}</p>
          </div>
        </Alert>
      )}

      {(!SuperAdminDetail.loader|| !adminDashboard.loader) && (
        <>
        
          {isAdmin && <>
            <h3 className='page-title mb-4'>Dashboard</h3>
           {SuperAdminDetail.loader && <div className="text-center"><Spinner ></Spinner></div> }
           { !SuperAdminDetail.loader &&<Row className='card-row'>
              <Col xl={2} className='ps-0'><div className='status-card '
               ><div><span className='icon user-count'></span></div><h6 className='status-text mt-4'>Users</h6><h3 className='status-value'>{SuperAdminDetail?.data?.users}</h3></div></Col>
              <Col xl={2}><div className='status-card ' 
               ><div><span className='icon stakers-count'></span></div><h6 className='status-text mt-4'>Stakers</h6><h3 className='status-value'>{SuperAdminDetail?.data?.stakers}</h3></div></Col>
              <Col xl={2}><div className='status-card ' 
              ><div><span className='icon investers-count'></span></div><h6 className='status-text mt-4'>Investors</h6><h3 className='status-value'>{SuperAdminDetail?.data?.investors}</h3></div></Col>
            </Row>}</>}

          {!isAdmin && <>
          {adminDashboard.loader && <div className="text-center"><Spinner ></Spinner></div> }
            {!adminDashboard.loader &&<Row className='card-row'>
              <Col xl={2}><div className='status-card ' ><div><span className='icon closed'></span></div><h6 className='status-text  mt-4'>Closed Projects</h6><h3 className='status-value'>{adminDashboard?.data?.closedProjects}</h3></div></Col>
              <Col xl={2}><div className='status-card '><div><span className='icon ongoing'></span></div><h6 className='status-text mt-4'>Ongoing Projects</h6><h3 className='status-value'>{adminDashboard?.data?.ongoingProjects}</h3></div></Col>
              <Col xl={2}><div className='status-card ' ><div><span className='icon total'></span></div><h6 className='status-text mt-4'>Total Projects</h6><h3 className='status-value'>{adminDashboard?.data?.totalProjects}</h3></div></Col>
              <Col xl={2}><div className='status-card ' ><div><span className='icon upcoming'></span></div><h6 className='status-text mt-4'>Upcoming Projects</h6><h3 className='status-value'>{adminDashboard?.data?.upcomingProjects}</h3></div></Col>

            </Row>}</>}
        </>)}
    </> }
    </>
  )
}
DashboardPage.propTypes = {
  superAdminDetails: PropTypes.isRequired,
  upcomingProjectsDetails: PropTypes.isRequired,
  adminDashboardDetails: PropTypes.isRequired,
}
const connectDispatchToProps = (dispatch) => {
  return {
    superAdminDetails: (callback) => {
          dispatch(SuperAdminDetails(callback))
      },
      upcomingProjectsDetails: () => {
        dispatch(UpComingProjectDetails())
    },
    adminDashboardDetails: (AdminId) => {
      dispatch(getAdminDashboardDetails(AdminId))
  }
  }
}
export default connect(null, connectDispatchToProps)(DashboardPage);