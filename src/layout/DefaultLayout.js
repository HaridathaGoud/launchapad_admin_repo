import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import { useSelector,useDispatch } from 'react-redux'
import { userManager } from '../authentication';
import { setApp } from 'src/reducers/applicationReducer'

import AppSidebar from 'src/components/AppSidebar';
const DefaultLayout = () => {
  const navigate = useNavigate();
  const User = useSelector((state) => state.oidc.user);
  const appName = useSelector((state) => state.application.app_name);
  const dispatch = useDispatch()


  const onAppSelect = (app_name) => {
    dispatch(setApp(app_name));
  }
  useEffect(() => {
    if ((!User || User.expire) && !window.location.pathname.includes('callback')) {
      userManager.clearStaleState().then(() => {
        userManager.signinRedirect();
      });
    }
    if (window.location.pathname === '/') {
      // onAppSelect("kyc");
      onAppSelect("launchpad");
      if(User?.profile?.isInvestor){
      return navigate('/launchpad/dashboard');
      //  return navigate("minting/dashboard")
      }else{
        return navigate('/launchpad/dashboard');
        // navigate("/kyc/customers")
      }
       
    }
  }, [])
  if ((!User || User.expired) && !window.location.pathname.includes('callback')) {
    return <div className="loader">Loading .....</div>
  }
  return (
    <div>
      {appName !== null && <AppSidebar />}
      <div className="wrapper d-flex flex-column min-vh-100 content-bg">
       <AppHeader />
        <div className="body flex-grow-1 px-lg-3 px-2">
           <Outlet />
       </div>
       <AppFooter />
        </div> 
    </div>
  )
}

export default DefaultLayout
