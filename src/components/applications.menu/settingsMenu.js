import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
const SettingsMenu = (props) => {
    const renderTooltipDashboard = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Dashboard
        </Tooltip>
    );
    const { handleMenuNavigate, app_name } = props;
    let locationSplit = location?.pathname?.split('/');

    return (
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
export default SettingsMenu;