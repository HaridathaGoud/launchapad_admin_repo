import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
const KycMenu = (props) => {
    const renderTooltipCustomers = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Customers
        </Tooltip>
    );
  
    const { handleMenuNavigate } = props;
    let locationSplit = location?.pathname?.split('/');
    return (
        <React.Fragment>
           {locationSplit[1]=="kyc" && <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipCustomers}
                >
                    <CNavLink onClick={() => handleMenuNavigate('kyc/customers')}><span className="icon customer" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>}
         
        </React.Fragment>
    )
}
export default KycMenu;