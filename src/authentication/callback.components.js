import React from "react";
import { CallbackComponent } from "redux-oidc";
import { getAdminDetails, profileSuccess } from "../reducers/authReducer";
import { userManager } from "./index";
import { useNavigate } from "react-router-dom";
import store from 'src/store/index';
const CallbackPage = () => {
    const navigate = useNavigate();
    const handleSuccess = (user) => {
        handleRedirect(user)
    }
    const handleRedirect = (user) => {
        store.dispatch(profileSuccess(user));
         if(user?.profile?.isInvestor){
          return navigate("/launchpad/dashboard");
            // navigate("/minting/dashboard")
        }
        else{
           navigate("/launchpad/dashboard");
            // const url = localStorage.getItem("__url");
            // localStorage.removeItem("__url");
            // navigate(url && url !== "/callback" ? url : "/launchpad/dashboard")
            // navigate(url && url !== "/callback" ? url : "/kyc/customers")
        }
       
    }

    return (
        <CallbackComponent
            userManager={userManager}
            successCallback={(user) => handleSuccess(user)}
           
        >
            <div className="loader">Loading .....</div>
        </CallbackComponent>
    );

}
export default (CallbackPage);