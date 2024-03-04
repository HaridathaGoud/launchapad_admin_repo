import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector} from 'react-redux';

const DaoMenu = (props) => {
    const isAdmin = useSelector(state => state.oidc?.adminDetails);

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