import React from 'react';
import SettingsComponent from './SettingComponent';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { showSettings } from 'src/reducers/authReducer';
import store from 'src/store/index';
const RoundOneStart = () => {
  const projectItem= useSelector(reducerstate =>  reducerstate.projectDetails?.project)
  const navigate = useNavigate();

  const redirection=()=>{
    store.dispatch(showSettings(false));
    navigate(`/launchpad/investors/projects/${projectItem.id}`)
  }

  return (<div>
    <CBreadcrumb>
      <CBreadcrumbItem>
        <CLink href="#" onClick={() => redirection()}>Projects</CLink>
      </CBreadcrumbItem>
      <CBreadcrumbItem>
        Settings
      </CBreadcrumbItem>
      <CBreadcrumbItem active>Set Round One Start Time</CBreadcrumbItem>
    </CBreadcrumb>
    <SettingsComponent title="Settings" label="Set Round One Start Time" placeholder="Set Round One Start Time" funcName="setroundOneStartTime"></SettingsComponent>
  </div>
  )
}

export default RoundOneStart;
