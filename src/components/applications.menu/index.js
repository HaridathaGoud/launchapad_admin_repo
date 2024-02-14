import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
const Applications = (props) => {
    const renderTooltipKyc = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Kyc
        </Tooltip>
    );
    const renderTooltipLaunchPad = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            LaunchPad
        </Tooltip>
    );
    const renderTooltipMinting = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Minting
        </Tooltip>
    );
    const renderTooltipMarketPlace = (props) => (
        <Tooltip id="button-tooltip" {...props}>
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
export default Applications