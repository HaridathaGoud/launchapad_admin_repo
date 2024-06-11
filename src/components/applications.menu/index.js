import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types'

const Applications = (props) => {
    const renderTooltipKyc = (tooltipProps) => (
        <Tooltip id="button-tooltip" {...tooltipProps}>
            Kyc
        </Tooltip>
    );
    const renderTooltipLaunchPad = (tooltipProps) => (
        <Tooltip id="button-tooltip" {...tooltipProps}>
            LaunchPad
        </Tooltip>
    );
    const renderTooltipMinting = (tooltipProps) => (
        <Tooltip id="button-tooltip" {...tooltipProps}>
            Minting
        </Tooltip>
    );
    const renderTooltipMarketPlace = (tooltipProps) => (
        <Tooltip id="button-tooltip" {...tooltipProps}>
            MarketPlace
        </Tooltip>
    );

    const { handleMenuNavigate } = props;
    return (
        <React.Fragment>
            <CNavItem>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipKyc} >
                    <CNavLink className='kyc' onClick={() => handleMenuNavigate('kyc/customers',false,"kyc")}><span className="icon kyc" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>
            <CNavItem onClick={()=>onAppSelect("launchpad")}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipLaunchPad} >
                    <CNavLink className='launchpad' onClick={() => handleMenuNavigate('launchpad/dashboard',false,"launchpad")}><span className="icon launchpad" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>
            <CNavItem onClick={()=>onAppSelect("minting")}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipMinting} >
                    <CNavLink className='minting' onClick={() => handleMenuNavigate('minting/customers',false,"minting")}><span className="icon minting" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>
            <div className='marketplace-admin'>
                <CNavItem onClick={()=>onAppSelect("marketplace")}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipMarketPlace} >
                        <CNavLink className='marketplace' onClick={() => handleMenuNavigate('marketplace/dashboard',false,"marketplace")}><span className="icon marketplace" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>
            </div>
        </React.Fragment>
    );
}
Applications.propTypes = {
    handleMenuNavigate: PropTypes.any,
  };
export default Applications