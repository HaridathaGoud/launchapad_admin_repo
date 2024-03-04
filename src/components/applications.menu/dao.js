import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector ,useDispatch} from "react-redux"
import { setApp } from 'src/reducers/applicationReducer';

const DaoMenu = (props) => {
    const isAdmin = useSelector(state => state.oidc?.adminDetails);
    const app_name = useSelector(state => state.application.app_name);
    const dispatch = useDispatch()
    const onAppSelect = (app_name) => {
        dispatch(setApp(app_name));
      }
      const handleMenuNavigateItem = (menuItem, isSettings, app_name) => {
        if (app_name) {
          onAppSelect(app_name);
        }
    }
    const renderTooltipDashboard = (props) => (
        <Tooltip id="button-tooltip" {...props}> 
            Dashboard
        </Tooltip>
    );
    const renderTooltipCustomers = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Customers
        </Tooltip>
    );
    // const logoRedirection=()=>{
    //     if (isAdmin?.isAdmin) {
    //       onAppSelect("launchpad");
    //       navigate('/launchpad/customers');
    //     }else{
    //        onAppSelect("launchpad");
    //       navigate('/launchpad/dashboard');
    //     }
    
    //   }
    const { handleMenuNavigate } = props;
    let locationSplit = location?.pathname?.split('/');
    if (isAdmin?.isAdmin) { 
        return (
            <React.Fragment>
               {locationSplit[1]=="dao" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                        <OverlayTrigger
                            placement="right"
                            overlay={renderTooltipDashboard} >
                            <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard')}><span className="icon menu" />
                            </CNavLink>
                        </OverlayTrigger>
                    </CNavItem>}

                    {locationSplit[1] =="dao" && 
                    <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                        <OverlayTrigger
                            placement="right"
                            overlay={renderTooltipCustomers}
                        >
                            <CNavLink className='customer' onClick={() => handleMenuNavigate('launchpad/customers')}><span className="icon customer" />
                            </CNavLink>
                        </OverlayTrigger>
                    </CNavItem>}
            </React.Fragment>
        )
    }else{
        return (
            <React.Fragment>
               {locationSplit[1]=="dao" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                        <OverlayTrigger
                            placement="right"
                            overlay={renderTooltipDashboard} >
                            <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard')}><span className="icon menu" />
                            </CNavLink>
                        </OverlayTrigger>
                    </CNavItem>}
             
            </React.Fragment>
        )
    }
    
}
export default DaoMenu;