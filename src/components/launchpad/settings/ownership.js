import React from 'react';
import SettingsComponent from './SettingComponent';
import { CBreadcrumb, CBreadcrumbItem, CLink } from '@coreui/react'
import { useNavigate } from "react-router-dom";
const TransferOwner = () => {
  const navigate = useNavigate();
  return (<div>
    <CBreadcrumb>
      <CBreadcrumbItem>
        <CLink href="#" onClick={() => navigate('/projects')}>Projects</CLink>
      </CBreadcrumbItem>
      <CBreadcrumbItem>
        Settings
      </CBreadcrumbItem>
      <CBreadcrumbItem active>Transfer Ownership</CBreadcrumbItem>
    </CBreadcrumb>
    <SettingsComponent title="Settings" label="Transfer Ownership" placeholder="Transfer Ownership" funcName="setFCFSStartTime"></SettingsComponent>
  </div>)
}

export default TransferOwner;
