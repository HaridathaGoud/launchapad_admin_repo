import React from 'react';
import SettingsComponent from './SettingComponent';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { showSettings } from 'src/reducers/authReducer';
const RoundOneEnd = () => {
  const navigate = useNavigate();
  const projectItem= useSelector(reducerstate =>  reducerstate.projectDetails?.project)

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
      <CBreadcrumbItem active>Set Round One End Time</CBreadcrumbItem>
    </CBreadcrumb>
    <SettingsComponent title="Settings" label="Set Round One End Time" placeholder="Set Round One End Time" funcName="setroundOneEndTime"></SettingsComponent>
  </div>
  )

}

export default RoundOneEnd;
