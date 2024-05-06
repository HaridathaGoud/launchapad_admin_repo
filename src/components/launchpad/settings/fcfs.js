import React from 'react';
import SettingsComponent from './SettingComponent';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { showSettings } from 'src/reducers/authReducer';
import store from 'src/store/index';
const FcfsStart = () => {
  const isAdmin = useSelector(state => state.oidc?.adminDetails);
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  const redirection=()=>{
    store.dispatch(showSettings(false));
    navigate(`/launchpad/projects/${isAdmin?.id||userId}`)
  }


  return (<div>
    <CBreadcrumb>
  
      <CBreadcrumbItem>
        <CLink href="#" onClick={() => redirection()}>Projects</CLink>
      </CBreadcrumbItem>
  
    <CBreadcrumbItem>
        Settings
      </CBreadcrumbItem>
      <CBreadcrumbItem active>Set FCFS Start Time</CBreadcrumbItem>
    </CBreadcrumb>
    <SettingsComponent title="Settings" label="Set FCFS Start Time" placeholder="Set FCFS Start Time" funcName="setFCFSStartTime" ></SettingsComponent>
  </div>)

}

export default FcfsStart;
