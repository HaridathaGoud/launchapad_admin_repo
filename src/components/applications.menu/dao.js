import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector} from 'react-redux';
import PropTypes from 'prop-types'

const DaoMenu = (props) => {
    const isAdmin = useSelector(state => state.oidc?.adminDetails);

    const renderTooltipDashboard = (tooltipProps) => (
        <Tooltip id="button-tooltip" {...tooltipProps}> 
            Dashboard
        </Tooltip>
    );
    const { handleMenuNavigate ,app_name} = props;
    let locationSplit = location?.pathname?.split('/');
    if (isAdmin?.isAdmin) { 
        return (
            <React.Fragment>
               {locationSplit[1]=="dao" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                        <OverlayTrigger
                            placement="right"
                            overlay={renderTooltipDashboard} >
                            <CNavLink onClick={() => handleMenuNavigate('dao/dashboard',false,app_name)}><span className="icon menu" />
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
                            <CNavLink onClick={() => handleMenuNavigate('dao/dashboard',false,app_name)}><span className="icon menu" />
                            </CNavLink>
                        </OverlayTrigger>
                    </CNavItem>}
             
            </React.Fragment>
        )
    }
    
}
DaoMenu.propTypes = {
    handleMenuNavigate: PropTypes.any,
    app_name : PropTypes.any,
  };
export default DaoMenu;