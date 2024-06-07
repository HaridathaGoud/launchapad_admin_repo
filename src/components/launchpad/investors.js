import React from 'react'
import { useNavigate } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { setProject } from '../../reducers/projectDetailsReducer';
import { useDispatch } from 'react-redux';
import InvestorsGrid from './settings/investorsGrid';
const Investors =()=>{
  const dispatchInvestors = useDispatch();
  const navigate = useNavigate();
  const handleProjects=(val)=>{
    dispatchInvestors(setProject(val))
    sessionStorage.setItem('userId',val?.id)
    sessionStorage.setItem('userName',val?.name?.split(/\s+/).filter(Boolean).join(' '))
    navigate(`/launchpad/investors/projects/${val?.id}`)
  }
  return(<>
   <h3 className='page-title mb-3'>Investors</h3>
    <CBreadcrumb>
      <CBreadcrumbItem>
        Launchpad
      </CBreadcrumbItem>
      <CBreadcrumbItem active>Investors</CBreadcrumbItem>
    </CBreadcrumb>
        
        <InvestorsGrid  getRedirect={handleProjects}/>
  </>)
}
export default Investors;