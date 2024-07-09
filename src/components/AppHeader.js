import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch,connect } from 'react-redux';
import {
  CNavLink, CForm, CNavItem,
  CHeader,
  CHeaderNav,
  CHeaderToggler,CSidebar, CSidebarNav
} from '@coreui/react';
import UseEthers from '../utils/useEthers';
import { Link, useNavigate, useLocation,useParams } from 'react-router-dom';
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
import Popover from 'react-bootstrap/Popover';
import SimpleBar from 'simplebar-react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Collapse from 'react-bootstrap/Collapse';
import { setUserInfo } from 'src/reducers/profileReducer';
import { CopyToClipboard } from "react-copy-to-clipboard";


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
  const isAdmin = useSelector(state => state.oidc?.adminDetails);
  const showSetting = useSelector(state => state.oidc?.isShowSettings)
  const viewedProject = useSelector(state => state.launchpad?.viewedProject);
  const [url, setUrl] = useState(null);
  const [menu, setMenu] = useState(null);
  const [copied,setCopied]=useState(false);
  const [walletAddres, setWalletAddres]=useState()
  const navigate = useNavigate();
  const params = useParams()

  const location = useLocation(); // once ready it returns the 'window.location' object
  useEffect(() => {
    let locationSplit = location.pathname.split('/');
    setUrl(locationSplit[1]);
    getWalletddressDetails();
  },[location]);

  const onAppSelect = (app_name) => {
    dispatch(setApp(app_name));
  }

  const handleDaoLu = (data) => {
    dispatch(setDefaultDao(data));

  };
const getWalletddressDetails = async() =>{
  let walletAddress = await getAddress();
  setWalletAddres(walletAddress)
}
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
  const handleMenuNavigate = (menuItem, isSettings, app_name) => {
    if (app_name) {
      onAppSelect(app_name);
    }
    if (!isSettings) {
      if(showSetting){
        store.dispatch(showSettings(false));
      }
      navigate(`/${menuItem}`);
    }
    else {
      getWalletAddress(`/launchpad/investors/projects/${params?.pId}/settings/${menuItem}`);
    }
  }

  const getWalletAddress = async (path) => {
    let walletAddress = await getAddress();
    if (walletAddress) {
      customerDetails(walletAddress,path);
      setWalletAddres(walletAddress)
    }
    else {
      navigate(path);
    }
  }
  const customerDetails = async (walletAddress,path) => {
    let res = await apiCalls.customerDetails(walletAddress);
    if (res.ok) {
      dispatch(setUserInfo(res.data));
      navigate("/projects");
    }
    let response = await apiCalls.adminOrSuperAdminDetails(adminDetails?.id);
    if (response.ok) {
      navigate(path);
    }
    if (res.data?.kycStatus != 'Completed' && response.data?.isAdmin) {
      navigate('/kycstatus');
      navigate(`/launchpad/investors/projects/${params?.pId}/settings/${menuItem}`);
    }
  }
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }
  const handleLogout = () => {
    dispatch(clearProfile())
    userManager?.signoutRedirect();
    onAppSelect("launchpad");
    navigate('/launchpad/dashboard')
    // onAppSelect("kyc");
    // navigate('/kyc/customers')
  }

  const renderTooltipKyc = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Kyc
    </Tooltip>
  );
  const renderTooltipLaunchPad = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Launchpad
    </Tooltip>
  );
  const renderTooltipMinting = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Minting
    </Tooltip>
  );
  const renderTooltipMarketPlace = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      MarketPlace
    </Tooltip>
  );
  const renderTooltipUserPage = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Users
    </Tooltip>
  );
  const renderTooltipDashboard = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Dashboard
    </Tooltip>
  );

  const renderTooltipInvestorPage = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Project Owners
    </Tooltip>
  );
  const renderTooltipIdoRequest = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      IDO Request
    </Tooltip>
  );
  const renderTooltipTransactions = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Transactions
    </Tooltip>
  );
  const renderTooltipProjects = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Projects
    </Tooltip>
  );
  const renderTooltipCustomers = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Customers
    </Tooltip>
  );

  const gotoMinting=()=>{
    dispatch(setApp("minting"))
    let obj={
      id: UserInfo?.role=="Admin" ? JSON.parse(UserInfo?.daos):null,
      role:UserInfo?.role
    }
    props?.periodsLuData(obj)
  }

  const popover = (
    <Popover id="popover-basic" className='settings-popover'>
      <Popover.Header as="h3" className='bg-transparent'>Settings</Popover.Header>
      <Popover.Body>
       <div onClick={()=>handleMenuNavigate('fcfs','true')}>Set FCFS Start Time</div>

       <div onClick={()=>handleMenuNavigate('vestingtime','true')}>Set Vesting Time</div>
       <div onClick={()=>handleMenuNavigate('tokenlisting','true')}>Set Token Listing Time</div>
       <div onClick={()=>handleMenuNavigate('roundonestart','true')}>Set Round One Start Time</div>
       <div onClick={()=>handleMenuNavigate('roundoneend','true')}>Set Round One End Time</div>

       <div onClick={()=>handleMenuNavigate('allocation','true')}>Allocation</div>
       <div onClick={()=>handleMenuNavigate('allocationroundtwo','true')}> Round Two Allocation</div>
      </Popover.Body>
    </Popover>
  );
  return (
<>
    <CHeader position="sticky" className="custom-header herader-top">
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

     <div> <CHeaderToggler className='mb-show icon toggole-icon d-md-none' onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open} />
        <Image width={25} className='mobile-nav' src={navBrand} alt="" onClick={() => {
            // onAppSelect("kyc");
            // navigate('/kyc/customers');
            onAppSelect("launchpad");
            navigate('/launchpad/dashboard');
          }} /></div>
      <CHeaderNav className="ms-3 align-items-center">
      {walletAddres && <li><div className='login-user'><span className='text-word-br'>{walletAddres.substring(0, 4) + "...." + walletAddres.slice(-4)}</span>
              <CopyToClipboard text={walletAddres.substring(0, 4) + "...." + walletAddres.slice(-4)} options={{ format: 'text/plain' }}
                onCopy={() => handleCopy()}
              >
                <span className={copied ? "icon copied-check ms-2" : "icon copy c-pointer"} />
              </CopyToClipboard></div></li>}
        <ul className='header-menu'>
        {/* {props?.oidc?.adminDetails?.isInvestor == false  &&
          <li><Link to="/kyc/customers" className={"underline" + (url === ("kyc") ? " active" : "")}
           onClick={() => dispatch(setApp("kyc"))}>KYC</Link></li>} */}

          {/* <li><Link to="/minting/dashboard" className={"underline" + (url === "minting" ? " active" : "")} onClick={() => gotoMinting()} >Minting</Link></li> */}
          {/* <li><Link to="/minting/dashboard" className={"underline" + (url === "minting" ? " active" : "")} onClick={() => dispatch(setApp("minting"))}>Minting</Link></li> */}

          {props?.userInfo?.role=="Admin"&&<li><Link to="/launchpad/dashboard" className={"underline" + (url === "launchpad" ? " active" : "")} onClick={() => dispatch(setApp("launchpad"))}>Launchpad</Link></li>}
          {props?.userInfo?.role=="Admin"&&<li><Link to={`/dao/dashboard`} className={"underline" + (url === "dao" ? " active" : "")} onClick={()=>dispatch(setApp("dao"))}>DAOS</Link></li>}

          {props?.userInfo?.role=="Super Admin"&& <li><Link to="/launchpad/dashboard" className={"underline" + (url === "launchpad" ? " active" : "")} onClick={() => dispatch(setApp("launchpad"))}>Launchpad</Link></li>}
           {props?.userInfo?.role=="Super Admin"&&  <li><Link to="/dao/dashboard" className={"underline" + (url === "dao" ? " active" : "")} onClick={()=>dispatch(setApp("dao"))}>DAOS</Link></li>}
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
              <p className='user-head profile-value text-light mb-0'>{UserProfile?.name}</p>
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

<div className='mobile-nav menu-left'>
      <Collapse in={open} dimension="width" className='mobile-nav-content' >
        <div id="example-collapse-text">
          <div className='mobile-navitems'>
            <CSidebar style={{ top: '80px' }}>
              <CSidebarNav>
                <SimpleBar className='simplebar-height'>
                  {/* {window.location.pathname.includes('home') && <> <CNavItem>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipKyc} >
                      <CNavLink className='kyc' onClick={() => redirectToKyc()}><span className="icon kyc" /><span className='mt-2 mx-1'>Kyc</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem>
                  </>} */}
                  {/* <CNavItem className='mobile-active-menu'>
                    <CNavItem><Link to="/kyc/customers" className={"underline" + (url === ("kyc") ? " active" : "")} onClick={() => dispatch(setApp("kyc"))}>KYC</Link></CNavItem>
                    {window.location.pathname.includes('kyc') && <>   <CNavItem className={"underline" + (menu === "customers" ? " customer active" : " ")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipCustomers}

                    >
                      <CNavLink onClick={() => redirectToKyc()} className='p-0'><span className="icon customer" /><span className=' mx-2'>Customers</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}
                    <CNavItem><Link to="/minting/dashboard" className={"underline" + (url === "minting" ? " active" : "")} onClick={() => gotoMinting()}>Minting</Link></CNavItem>

                  </CNavItem> */}
                    {/* {walletAddres && <div className='login-user'><img src={user} alt=''></img><span className='text-word-br'>{walletAddres}</span>
                      <CopyToClipboard text={walletAddres} options={{ format: 'text/plain' }}
                        onCopy={() => handleCopy()}
                      >
                        <span className={copied ? "icon copied-check ms-2" : "icon copy c-pointer"} />
                      </CopyToClipboard></div>} */}
                  {window.location.pathname.includes('') && <> <CNavItem  className='mobile-active-menu'>
                    <OverlayTrigger

                      placement="right"
                      overlay={renderTooltipLaunchPad} >
                      <CNavLink  onClick={() => navigate('launchpad/dashboard')} className={"underline" + (url === "launchpad" ? " active" : "")}>

                        <span className=''>LaunchPad</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}

                  {window.location.pathname.includes('launchpad') && <> <CNavItem className={"underline" + (menu=== "dashboard" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipDashboard} >
                      <CNavLink onClick={() => navigate('launchpad/dashboard')}><span className="icon menu" /><span className=' mx-1'>Dashboard</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}

                  {window.location.pathname.includes('launchpad')&&
                  isAdmin?.isAdmin && showSetting && viewedProject?.projectstatus=="Deployed"&&
                   <CNavItem className={"underline" + (menu=== "Settings" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={popover} >
                        <CNavLink className='customer' ><span className="icon nav-settings" /><span className=' mx-1'>Settings</span></CNavLink>

                    </OverlayTrigger>
                  </CNavItem>}

                  {window.location.pathname.includes('launchpad') && props?.userInfo?.role=="Super Admin"&& <>   <CNavItem  className={"underline" + (menu=== "customers" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipCustomers}
                    >
                      <CNavLink className='customer' onClick={() => navigate('launchpad/customers')}><span className="icon customer" /><span className=' mx-1'>Customers</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}

                  {window.location.pathname.includes('launchpad') && props?.userInfo?.role=="Admin"&& <>   <CNavItem  className={"underline" + (menu=== "projects" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipProjects}
                    >
                      <CNavLink className='projects' onClick={() => navigate(`launchpad/projects/${isAdmin.id}`)}><span className="icon customer" /><span className=' mx-1'>Projects</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}

                  {window.location.pathname.includes('launchpad')  && props?.userInfo?.role=="Super Admin"&& <> <CNavItem className={"underline" + (menu=== "investors" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipInvestorPage} >
                      <CNavLink onClick={() => navigate('launchpad/investors')}
                      ><span className="icon investers me-0" /><span className=' mx-1'>Investors</span></CNavLink>
                    </OverlayTrigger>
                  </CNavItem>
                  </>}
                  {window.location.pathname.includes('launchpad') && props?.userInfo?.role=="Super Admin"&&
                    <CNavItem className={"underline" + (menu=== "idorequest" ? " active" : "")}>
                      <> <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipIdoRequest} >
                        <CNavLink onClick={() => navigate('launchpad/idorequest')}><span className="icon ido-request me-0" /><span className=' mx-1'>IDO Request</span></CNavLink>
                      </OverlayTrigger>
                      </>
                    </CNavItem>
                  }

                  {window.location.pathname.includes('launchpad') && props?.userInfo?.role=="Super Admin"&&
                    <CNavItem className={"underline" + (menu=== "transactions" ? " active" : "")}>
                      <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipTransactions} >
                        <CNavLink onClick={() => navigate('launchpad/transactions')}><span className="icon transaction-list me-0" /><span className=' mx-1'>Transactions</span></CNavLink>
                      </OverlayTrigger>
                    </CNavItem>
                  }
                  {window.location.pathname.includes('home') && daoLuData !=null && <> <CNavItem className={"underline" + (menu === " dashboard" ? "customer active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipMinting}
                    >
                      <CNavLink className='minting' onClick={() => navigate('minting/dashboard')}><span className="icon minting" /><span className='mt-2 mx-1'>Minting</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}

                  <CNavItem className='mobile-active-menu'>
                    <CNavLink className='nav-item'>
                      {props?.userInfo?.role=="Super Admin"&& <Link to={`/dao/dashboard`} className={"underline" + (url === "dao" ? " active" : "")} onClick={()=>dispatch(setApp("dao"))}>DAO</Link>}
                      {props?.userInfo?.role=="Admin"&&<Link to={`/dao/dashboard`} className={"underline" + (url === "dao" ? " active" : "")} onClick={()=>dispatch(setApp("dao"))}>DAO</Link>}
                     </CNavLink>
                      </CNavItem>

                  {window.location.pathname.includes('dao') &&    <CNavItem  className={"underline" + (menu=== "projects" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipDashboard}
                    >
                      <CNavLink className='projects' onClick={() => navigate(`dao/dashboard`)}><span className="icon menu" /><span className=' mx-1'>Dashboard</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem>}
                  {props?.userInfo?.role=="Super Admin"&& window.location.pathname.includes('dao') &&    <CNavItem  className={"underline" + (menu=== "projects" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipCustomers}
                    >
                      <CNavLink className='projects' onClick={() => navigate(`launchpad/customers`)}><span className="icon customer" /><span className=' mx-1'>Customers</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem>}

                  {/* {window.location.pathname.includes('minting') && daoLuData !=null && <>
                  {url == "minting" ? <div className="text-center">{loading && <Spinner></Spinner>}
                    {!loading && (<>
                      <NavDropdown className='dao-pf-style sm-dao'
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
                   <CNavItem  className={"underline" + (menu=== "dashboard" ? " active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipDashboard} >
                      <CNavLink className='customer' onClick={() => navigate('minting/dashboard')}><span className="icon menu" /><span className=' mx-2'>Dashboard</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}

                  {window.location.pathname.includes('minting') && daoLuData !=null && <>   <CNavItem className={"underline" + (menu === "customers" ? " customer active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipCustomers}
                    >
                      <CNavLink className='customer' onClick={() => navigate('minting/customers')}><span className="icon customer" /><span className=' mx-2'>Customers</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}
                  {window.location.pathname.includes('minting') && daoLuData !=null && <>   <CNavItem  className={"underline" + (menu === "mintnow" ? " whitelist-icon active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipCustomers}
                    >
                      <CNavLink className='minting-icon' onClick={() => navigate('minting/mintnow')}><span className="icon mint" /><span className=' mx-2'>Minting</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}
                  {window.location.pathname.includes('minting') && daoLuData !=null && <>   <CNavItem className={"underline" + (menu === "whitelist" ? " whitelist-icon active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipCustomers}
                    >
                      <CNavLink className='whitelist-icon' onClick={() => navigate('minting/whitelist')}><span className="icon whitelist" /><span className=' mx-2'>Whitelist</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>}
                  {window.location.pathname.includes('minting') && daoLuData !=null && <>   <CNavItem className={"underline" + (menu === "referral" ? " referral-icon active" : "")}>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipCustomers}
                    >
                      <CNavLink className='referral-icon' onClick={() => navigate('minting/referral')}><span className="icon referral" /><span className=' mx-2'>Referral's Bonus</span>
                      </CNavLink>
                    </OverlayTrigger>
                  </CNavItem></>} */}
                  {/* <div className='marketplace-admin'> */}

                  <CNavItem className='mobile-active-menu'>

                    {props?.userInfo?.role=="Super Admin"&&<CNavItem><Link to="/marketplace/dashboard" className={"underline" + (url === "marketplace" ? " active" : "")} onClick={() => dispatch(setApp("marketplace"))}>Marketplace</Link></CNavItem>}
                  </CNavItem>
                    {window.location.pathname.includes('home') && <>  <CNavItem>
                      <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipMarketPlace} >
                        <CNavLink className='marketplace' onClick={() => navigate('marketplace/dashboard')}><span className="icon marketplace" /><span className='mt-2 mx-1'>MarketPlace</span>
                        </CNavLink>
                      </OverlayTrigger>
                    </CNavItem></>}

                    {window.location.pathname.includes('marketplace') && <> <CNavItem  className={"underline" + (menu=== "dashboard" ? " active" : "")}>
                      <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipDashboard} >
                        <CNavLink onClick={() => navigate('marketplace/dashboard')}><span className="icon menu" /><span className=' mx-2'>Dashboard</span>
                        </CNavLink>
                      </OverlayTrigger>
                    </CNavItem></>}

                    {window.location.pathname.includes('marketplace') && <>   <CNavItem>
                      <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipCustomers}
                      >
                        <CNavLink className='customer' onClick={() => navigate('marketplace/customers')}><span className="icon customer" /><span className=' mx-2'>Customers</span>
                        </CNavLink>
                      </OverlayTrigger>
                    </CNavItem></>}



                  {window.location.pathname.includes('home') && <> <CNavItem>
                    <OverlayTrigger
                      placement="right"
                      overlay={renderTooltipUserPage} >
                      <CNavLink onClick={() => navigate('userpage')}><span className="icon user me-0" /><span className='mt-2 mx-1'>Users</span></CNavLink>
                    </OverlayTrigger>
                  </CNavItem>
                  </>}








                </SimpleBar>
              </CSidebarNav>
            </CSidebar>
          </div>
        </div>
      </Collapse>
    </div>
  </>)
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