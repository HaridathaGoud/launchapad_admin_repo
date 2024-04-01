import React from 'react';
import SettingsComponent from './SettingComponent';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { showSettings } from 'src/reducers/authReducer';
import store from 'src/store/index';
const Fcfsendtime = () => {
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
      <CBreadcrumbItem active>Set FCFS End Time</CBreadcrumbItem>
    </CBreadcrumb>
    <SettingsComponent title="Settings" label="Set FCFS End Time" placeholder="Set FCFS End Time" funcName="setFCFSEndTime"></SettingsComponent>
  </div>
  )
}
export default Fcfsendtime;

