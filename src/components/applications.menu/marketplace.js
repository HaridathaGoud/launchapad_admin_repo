import React from 'react';
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types'

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
 
    const { handleMenuNavigate ,app_name } = props;
    let locationSplit = location?.pathname?.split('/');
    return (
        <div className='marketplace-admin'>
            {locationSplit[1]=="marketplace" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipDashboard} >
                    <CNavLink onClick={() => handleMenuNavigate('marketplace/dashboard',false, app_name)}><span className="icon menu" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>
            }
            {locationSplit[1]=="marketplace" && <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipCustomers}
                >
                    <CNavLink className='customer' onClick={() => handleMenuNavigate('marketplace/customers',false, app_name)}><span className="icon customer" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>
        }
            
        </div>
    )
}
MarketplaceMenu.propTypes = {
    handleMenuNavigate: PropTypes.any,
    app_name: PropTypes.any,
  };
export default MarketplaceMenu;