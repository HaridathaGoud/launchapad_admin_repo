import React,{useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CBreadcrumb,CBreadcrumbItem,CLink
} from '@coreui/react'
import apiCalls from 'src/api/apiCalls'

const KYCDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    getProjectDetail();
    getDashboardDetails();
}, []);
  const getProjectDetail=async()=>{
   await apiCalls.getProjectDetails("7F5EDC4B-C1C9-4FA7-8F2F-003788836275");
  }
  const getDashboardDetails=async()=>{
    await apiCalls.getDashboardDetails(`7F5EDC4B-C1C9-4FA7-8F2F-003788836275`);
  }
  const redirectToPartcpt=()=>{
    navigate('/Participant')
  }

  return (
    <>
      <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink  onClick={()=> navigate('/home')}>Kyc</CLink>
                </CBreadcrumbItem>
                <CBreadcrumbItem active>Dashboard</CBreadcrumbItem>
              </CBreadcrumb>

      <div className='dashboard-text'>
      <h4 className='welcome-text text-center'>Welcome to</h4>
      <h3 className='section-title text-center'>Dashboard</h3>
      <p className='common-text text-center'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has <br/>{"been the industry's standard dummy text "}</p>
        </div>
      <CRow className='db-cardsection'>
      <CCol xs={12} md={6} xl={4}>
      <CCard className="mb-4 dashboard-card">
        <CCardBody className=''  onClick={redirectToPartcpt}>
        <h2>60</h2>
              <h4>Number of participants</h4>
             <span className='icon add-participant'></span>
        </CCardBody>
        </CCard>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
      <CCard className="mb-4 dashboard-card">
        <CCardBody className=''>
        <h2>16</h2>
          <h4>Tokens sold</h4>
              <span className='icon token'></span>
        </CCardBody>
        </CCard>
        </CCol>
        <CCol xs={12} md={6} xl={4}>
      <CCard className="mb-4 dashboard-card">
        <CCardBody className=''>
        <h2>43</h2>
              <h4>Total no of transactions</h4>
              <span className='icon transactions'></span>
        </CCardBody>
        </CCard>
        </CCol>
        </CRow>
    </>
  )
}

export default KYCDashboard
