import React from 'react'
import { useSelector, useDispatch, connect } from 'react-redux'
import { CSidebar, CSidebarNav } from '@coreui/react'
import { useNavigate, useParams } from "react-router-dom";
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import Image from 'react-bootstrap/Image';
import navBrand from "../assets/images/Minnapad-Logo.svg";
import Applications from './applications.menu';
import AppMenu from './applications.menu/app.menu';
import { setApp } from 'src/reducers/applicationReducer';
import UseEthers from '../utils/useEthers';
import apiCalls from 'src/api/apiCalls';
import { setUserInfo } from 'src/reducers/profileReducer';
import { showSettings,setSettingsLoaders } from 'src/reducers/authReducer';
import store from 'src/store';
const AppSidebar = (props) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const navigate = useNavigate();
  const params = useParams()
  const { getAddress } = UseEthers();
  const app_name = useSelector(state => state.application.app_name);
  const showSetting = useSelector(state => state.oidc?.isShowSettings)
  const settingLoader = useSelector(state => state.oidc?.isSettingsLoading)
  const onAppSelect = (app_name) => {
    dispatch(setApp(app_name));
  }
  const handleMenuNavigate = (menuItem, isSettings, app_name) => {
    if (app_name) {
      onAppSelect(app_name);
    }
    if (!isSettings) {
      if (showSetting) {
        store.dispatch(showSettings(false));
      }
      navigate(`/${menuItem}`);
    }
    else {
      getWalletAddress(`/launchpad/investors/projects/${params?.projectId}/settings/${menuItem}`);
    }
  }

  const getWalletAddress = async (path) => {
    let walletAddress = await getAddress();
    if (walletAddress) {
      customerDetails(walletAddress, path);
    }
    else {
      navigate(path);
    }

  }
  const customerDetails = async (walletAddress, path) => {
    let res = await apiCalls.customerDetails(walletAddress);
    if (res.ok) {
      dispatch(setUserInfo(res.data));
    }
    let response = await apiCalls.adminOrSuperAdminDetails(props.adminDetails?.id);
    if (response.ok) {
      navigate(path);
    }
    if (res.data?.kycStatus != 'Completed' && response.data?.isAdmin) {
      navigate('/kycstatus');
      navigate(`/launchpad/investors/projects/${params?.projectId}/settings/${menuItem}`);
    }
    store.dispatch(setSettingsLoaders(false));
  }

  const logoRedirection=()=>{
    if(props.adminDetails.isInvestor){
      onAppSelect("minting");
      navigate('/minting/dashboard');
    }else{
      onAppSelect("kyc");
    navigate('/kyc/customers');
    }

  }

  return (
    <>
      <CSidebar

        position="fixed"
        className='menu-left superadmin-leftmenu bg-none'
        unfoldable={unfoldable}
        visible={true}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', visible })
        }}
      >
        <div className='nav-brand menu-left superadmin-leftmenu d-flex align-items-center justify-content-center p-2 c-pointer'>
          <Image src={navBrand} alt="" onClick={() =>  logoRedirection()} />
        </div>
        <div className='menu-left superadmin-leftmenu screen-height mt-2'>
          <CSidebarNav>
            <SimpleBar className='simplebar-height'>
              {app_name === null && <Applications handleMenuNavigate={handleMenuNavigate} />}
              {app_name !== null && <AppMenu handleMenuNavigate={handleMenuNavigate} />}
            </SimpleBar>
          </CSidebarNav>
        </div>
      </CSidebar>
    </>
  )
}

const connectStateToProps = ({ auth, oidc }) => {
  return { auth: auth, trackAuditLogData: oidc.trackAuditLogData, adminDetails: oidc.adminDetails };
};
export default connect(connectStateToProps, (dispatch) => {
  return { dispatch };
})(AppSidebar);
