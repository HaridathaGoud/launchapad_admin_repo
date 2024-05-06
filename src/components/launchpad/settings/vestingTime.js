import React from 'react';
import SettingsComponent from './SettingComponent';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import store from 'src/store/index';
import { showSettings } from 'src/reducers/authReducer';
const VestingTime = () => {
  const isAdmin = useSelector(state => state.oidc?.adminDetails)
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
      <CBreadcrumbItem active>Set Vesting Time</CBreadcrumbItem>
    </CBreadcrumb>
    <SettingsComponent title="Settings" label="Set Vesting Time(hour)" placeholder="Set Vesting Time" funcName="setVestingTime"></SettingsComponent>

  </div>
  )

}

export default VestingTime;
