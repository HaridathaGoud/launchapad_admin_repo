import React, { useEffect, useState} from 'react'
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect, useSelector } from 'react-redux';
import { SuperAdminDetails, UpComingProjectDetails, getAdminDashboardDetails } from './launchpadReducer/launchpadReducer';
import store from 'src/store';
import { showSettings } from 'src/reducers/authReducer';
import PropTypes from 'prop-types'
import LaunchpadShimmer from '../shimmers/launchpaddashboard';
import { getAdminDetails } from '../../reducers/authReducer';


const DashboardPage = (props) => {
  const AdminDetails = useSelector(reducerstate => reducerstate.oidc?.adminDetails)
  const isAdmin = useSelector(reducerstate => reducerstate.oidc?.adminDetails?.isAdmin);
  const SuperAdminDetail =useSelector(reducerstate=>reducerstate?.launchpad?.superAdminDetails)
  const adminDashboard =useSelector(reducerstate=>reducerstate?.launchpad?.adminDashboardDetails)
  const showSetting = useSelector(reducerstate => reducerstate.oidc?.isShowSettings)
  const [loader,setLoader] = useState(false);

  useEffect(() => {
  adminDashboardDetails()
  }, [AdminDetails]);

  const adminDashboardDetails = async () => {
    setLoader(true)
      if (AdminDetails?.isInvestor) {
        props.upcomingProjectsDetails()
        await props.adminDashboardDetails(AdminDetails?.id);
        setTimeout(() => {setLoader(false)}, 2000);
      } else {
        props.superAdminDetails((callback) => {
          if (callback?.data) {
            setLoader(false)
          }
        })
      }
      if (showSetting) {
        store.dispatch(showSettings(false));
      }
  }

  return (
    <>
    {loader ? <LaunchpadShimmer/> : 
    <div className='bg-dashboard'>
    <div className='text-center pt-5'>
    <h3 className='page-title mb-3 fs-3'>Welcome To <br/>Launchpad Dashboard</h3>
    <p className='db-content'>The Launchpad dashboard provides users with a comprehensive <br className='d-none d-md-block'/>
       overview of various projects, tasks, and activities within an organization.</p>
    </div>
     
      {(SuperAdminDetail.errorMsg||adminDashboard.errorMsg) && (
        <Alert variant="danger">
          <div className='d-flex align-items-center'>
            <span className='icon error-alert'></span>
            <p className='m1-2' style={{ color: 'red' }}>{(SuperAdminDetail.errorMsg || adminDashboard.errorMsg)}</p>
          </div>
        </Alert>
      )}
       
          {isAdmin && !loader && <>
            <Row className='card-row mt-3 justify-content-center'>
              <Col xl={2} className='ps-md-0'><div className='status-card bg-user'
              ><div><span className='icon user-count'></span></div><h6 className='status-text mt-4 mb-0'>Users</h6><h3 className='status-value'>{SuperAdminDetail?.data?.users}</h3></div></Col>
              <Col xl={2}><div className='status-card bg-staker'
              ><div><span className='icon stakers-count'></span></div><h6 className='status-text mt-4 mb-0'>Stakers</h6><h3 className='status-value'>{SuperAdminDetail?.data?.stakers}</h3></div></Col>
              <Col xl={2}><div className='status-card bg-investor'
              ><div><span className='icon investers-count'></span></div><h6 className='status-text mt-4 mb-0'>Investors</h6><h3 className='status-value'>{SuperAdminDetail?.data?.investors}</h3></div></Col>
            </Row>
          </>}

          { !loader && !isAdmin &&<>
            <Row className='card-row justify-content-center'>
              <Col xl={2}><div className='status-card bg-user' ><div><span className='icon closed'></span></div><h6 className='status-text  mt-3'>Closed Projects</h6><h3 className='status-value'>{adminDashboard?.data?.closedProjects}</h3></div></Col>
              <Col xl={2}><div className='status-card bg-staker'><div><span className='icon ongoing'></span></div><h6 className='status-text mt-4 mb-0'>Ongoing Projects</h6><h3 className='status-value'>{adminDashboard?.data?.ongoingProjects}</h3></div></Col>
              <Col xl={2}><div className='status-card bg-investor' ><div><span className='icon total'></span></div><h6 className='status-text mt-4 mb-0'>Total Projects</h6><h3 className='status-value'>{adminDashboard?.data?.totalProjects}</h3></div></Col>
              <Col xl={2}><div className='status-card bg-user' ><div><span className='icon upcoming'></span></div><h6 className='status-text mt-4 mb-0'>Upcoming Projects</h6><h3 className='status-value'>{adminDashboard?.data?.upcomingProjects}</h3></div></Col>

            </Row>
          </>}
    </div> }
    </>
  )
}
DashboardPage.propTypes = {
  superAdminDetails: PropTypes.isRequired,
  upcomingProjectsDetails: PropTypes.isRequired,
  adminDashboardDetails: PropTypes.isRequired,
  AdminDetails:PropTypes.isRequired,
}
const connectDispatchToProps = (dispatch) => {
  return {
    AdminDetails: (userId) => {
      dispatch(getAdminDetails(userId))
    },
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