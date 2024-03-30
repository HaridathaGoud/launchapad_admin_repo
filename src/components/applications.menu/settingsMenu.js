import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector} from 'react-redux';

const SettingsMenu = (props) => {
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
    const renderTooltipInvestorPage = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Investors
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
    const { handleMenuNavigate, app_name } = props;
    let locationSplit = location?.pathname?.split('/');

    if (isAdmin?.isAdmin) {
        return (
            <React.Fragment>
                {locationSplit[1]=="Settings" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipDashboard} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard',false,app_name)}><span className="icon menu" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
               {locationSplit[1] =="Settings" && 
                <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipCustomers}
                    >
                        <CNavLink className='customer' onClick={() => handleMenuNavigate('launchpad/customers',false,app_name)}><span className="icon customer" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {locationSplit[1] =="Settings" &&  <CNavItem className={locationSplit[2] == "investors" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipInvestorPage} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/investors',false,app_name)}
                        ><span className="icon investers me-0" /></CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {locationSplit[1] =="Settings" && <CNavItem className={locationSplit[2] == "idorequest" ? "active" : ""}>
                    <> <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipIdoRequest} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/idorequest',false,app_name)}><span className="icon ido-request me-0" /></CNavLink>
                    </OverlayTrigger>
                    </>
                </CNavItem>}
                {locationSplit[1] =="Settings" &&  <CNavItem className={locationSplit[2] == "transactions" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipTransactions} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/transactions',false,app_name)}><span className="icon transaction-list me-0" /></CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                
            </React.Fragment>
        )
    } else {
     return   (
         <React.Fragment>
             {locationSplit[1] == "Settings" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                 <OverlayTrigger
                     placement="right"
                     overlay={renderTooltipDashboard} >
                     <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard', false, app_name)}><span className="icon menu" />
                     </CNavLink>
                 </OverlayTrigger>
             </CNavItem>}
         </React.Fragment>
       )
    }
}
export default SettingsMenu;