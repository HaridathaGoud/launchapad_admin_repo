import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch,connect } from 'react-redux';
import {
   CForm,
  CHeader,
  CHeaderNav,
  CHeaderToggler,CSidebar
} from '@coreui/react';
import UseEthers from '../utils/useEthers';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import defaultAvathar from "../../src/assets/images/default-avatar.jpg"
import { userManager } from 'src/authentication';
import { clearProfile,setDefaultDao } from '../reducers/authReducer'
import PropTypes from 'prop-types';
import { setApp } from 'src/reducers/applicationReducer';
import Image from 'react-bootstrap/Image';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { getDaoCardDetailsLu } from 'src/reducers/authReducer';
import Spinner from 'react-bootstrap/esm/Spinner';
import navBrand from "../assets/images/YB-Logo.svg";

function AppHeader(props){
  const [open, setOpen] = useState(false);
  const { getAddress } = UseEthers();
  const dispatch = useDispatch()
  const daoLuData = useSelector(state => state?.oidc?.periodsData?.data);
  const DefaultdaoData = useSelector(state => state?.oidc?.defaultData);
  const loading = useSelector(state => state?.oidc?.periodsData?.loading)
  const UserProfile = useSelector(state => state.oidc?.user?.profile)
  const UserInfo = useSelector(state => state.oidc?.profile?.profile)
  const adminDetails = useSelector(state => state.oidc?.adminDetails)
  const adminProfileImg = useSelector(state => state.oidc?.adminProfileImg)
  const [url, setUrl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // once ready it returns the 'window.location' object
  useEffect(() => {
    let locationSplit = location.pathname.split('/');
    setUrl(locationSplit[1]);
  },[location]);
  
  const onAppSelect = (app_name) => {
    dispatch(setApp(app_name));
  }

  const handleDaoLu = (data) => {
    dispatch(setDefaultDao(data));

  };

  const redirectToProfile = () => {
     onAppSelect("userprofile")
    navigate('/userprofile')
  }
  const redirectToSettings = () => {
    onAppSelect("Settings")
    navigate('/Settings')
  }
  const redirectToKyc = () => {
    navigate('/kyc/customers')
  }

  const handleLogout = () => {
    dispatch(clearProfile())
    userManager?.signoutRedirect();
    onAppSelect("launchpad");
    navigate('/launchpad/dashboard')
    // onAppSelect("kyc");
    // navigate('/kyc/customers')
  }



  const gotoMinting=()=>{
    dispatch(setApp("minting"))
    let obj={
      id: UserInfo?.role=="Admin" ? JSON.parse(UserInfo?.daos):null,
      role:UserInfo?.role
    }
    props?.periodsLuData(obj)
  }


  return (

    <CHeader position="sticky" className="mb-4 custom-header herader-top">
      {url == "minting" ?

         <CSidebar className={`${daoLuData !=null &&  "bg-none" } menu-left superadmin-leftmenu cust-header-daopf`}>
        {url == "minting" && !props?.oidc?.adminDetails?.isInvestor ?
         <div className="text-center">{loading && <Spinner></Spinner>}
          {!loading && daoLuData !=null && (<>
            <NavDropdown className='dao-pf-style'
              title={<div className='d-flex align-items-center'><div className='profile-size no-hover header-profile-size profile-rspace daos-img '><span className='image-box'><Image src={DefaultdaoData?.daoName ? DefaultdaoData?.logo : ""} alt="" className='image-setup' /></span></div><p >{DefaultdaoData?.daoName ? DefaultdaoData?.daoName : ""}</p></div>}
              id="nav-dropdown"
            >
              {daoLuData?.map((item) =>
              (<NavDropdown.Item eventKey={item.id} key={item?.id}
                className={`${item?.daoName != DefaultdaoData?.daoName ? "dropdwn-liststyle" : "dropdwn-liststyle selected"}`}
                onClick={() => handleDaoLu(item)}>
                <div className='d-flex align-items-center'>
                  <div className='profile-size no-hover header-profile-size profile-rspace daos-img '>
                    <span className='image-box'>
                      <Image src={item?.logo} alt="" className='image-setup' />
                    </span></div><p >{item?.daoName}</p>
                </div>
              </NavDropdown.Item>
              ))}
            </NavDropdown> </>)}</div> : ""}
      </CSidebar> : <CSidebar className='bg-none menu-left superadmin-leftmenu '></CSidebar>}
      
      <CHeaderToggler className='mb-show icon toggole-icon d-md-none' onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open} />
        <Image width={72} className='mobile-nav' src={navBrand} alt="" onClick={() => {
            // onAppSelect("kyc");
            // navigate('/kyc/customers');
            onAppSelect("launchpad");
            navigate('/launchpad/dashboard');
          }} />
      <CHeaderNav className="ms-3 align-items-center">
        <ul className='header-menu'>
        {/* {props?.oidc?.adminDetails?.isInvestor == false  &&
          <li><Link to="/kyc/customers" className={"underline" + (url === ("kyc") ? " active" : "")}
           onClick={() => dispatch(setApp("kyc"))}>KYC</Link></li>} */}

          {/* <li><Link to="/minting/dashboard" className={"underline" + (url === "minting" ? " active" : "")} onClick={() => gotoMinting()} >Minting</Link></li> */}
          {/* <li><Link to="/minting/dashboard" className={"underline" + (url === "minting" ? " active" : "")} onClick={() => dispatch(setApp("minting"))}>Minting</Link></li> */}

          {props?.userInfo?.role=="Admin"&&<li><Link to="/launchpad/dashboard" className={"underline" + (url === "launchpad" ? " active" : "")} onClick={() => dispatch(setApp("launchpad"))}>Launchpad</Link></li>}
          {props?.userInfo?.role=="Admin"&&<li><Link to={`/dao/dashboard`} className={"underline" + (url === "dao" ? " active" : "")} onClick={()=>dispatch(setApp("dao"))}>DAO</Link></li>}

          {props?.userInfo?.role=="Super Admin"&& <li><Link to="/launchpad/dashboard" className={"underline" + (url === "launchpad" ? " active" : "")} onClick={() => dispatch(setApp("launchpad"))}>Launchpad</Link></li>}
           {props?.userInfo?.role=="Super Admin"&&  <li><Link to="/dao/dashboard" className={"underline" + (url === "dao" ? " active" : "")} onClick={()=>dispatch(setApp("dao"))}>DAO</Link></li>}
           {props?.userInfo?.role=="Super Admin"&&
          <li><Link to="/marketplace/dashboard" className={"underline" + (url === "marketplace" ? " active" : "")} onClick={() => dispatch(setApp("marketplace"))}>Marketplace</Link></li>}

          
         
        </ul>
        <CForm className="d-flex ml-8 sm-d-none">
        </CForm>
        <div className='p-relative'>
        <DropdownButton className='section-custom'
          align="end"
          title={<div className='d-flex align-items-center'>
            <div className='profile-size no-hover header-profile-size profile-rspace' >
              <span className='image-box'>
                <img className='image-setup' src={adminProfileImg ||props?.oidc?.custUser?.profilePicUrl || props?.oidc?.profilePicUrl || adminDetails?.profilePicUrl || defaultAvathar} alt="profile img" />
              </span>
            </div>
            <div className='mb-hide '>
              <div className='user-head profile-value text-light'>{UserProfile?.name}</div>
            </div>
          </div>}
          id="dropdown-menu-align-end">
          <Dropdown.Item eventKey="1" onClick={() => redirectToProfile()} ><span className='icon profile me-1'></span>Profile</Dropdown.Item>
          <Dropdown.Item eventKey="2" onClick={() => redirectToSettings()} ><span className='icon settings me-1'></span>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="4" onClick={() => handleLogout()}><span className='icon logout me-1'></span>Logout</Dropdown.Item> 
        </DropdownButton>
        <span className='icon downarrow-white header-downarrow'></span>
        </div>     
      </CHeaderNav>
    </CHeader>

  )
}

AppHeader.propTypes = {
  periodsLuData: PropTypes.isRequired,
  oidc: PropTypes.string,
  userInfo: PropTypes.isRequired,
}
const connectStateToProps = ({ auth, oidc }) => {
  return {
    auth: auth,
    oidc: oidc,
    userInfo:oidc?.profile?.profile,
  };
};
const connectDispatchToProps = dispatch => {
  return {
    periodsLuData: (obj) => {
      dispatch(getDaoCardDetailsLu(obj))
    },
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(AppHeader);
AppHeader.propTypes = {
};