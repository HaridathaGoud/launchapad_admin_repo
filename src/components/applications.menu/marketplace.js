import React from 'react';
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
const MarketplaceMenu = (props) => {
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
    return (
        <div className='marketplace-admin'>
            <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipDashboard} >
                    <CNavLink onClick={() => handleMenuNavigate('marketplace/dashboard')}><span className="icon menu" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>
            <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipCustomers}
                >
                    <CNavLink className='customer' onClick={() => handleMenuNavigate('marketplace/customers')}><span className="icon customer" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>
           
            
        </div>
    )
}
export default MarketplaceMenu;