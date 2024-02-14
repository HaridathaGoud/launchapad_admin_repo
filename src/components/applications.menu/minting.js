import React from 'react';
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector } from 'react-redux';

const MintingMenu = (props) => {
    const daoLuData = useSelector(state => state?.oidc?.periodsData?.data);
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
    
    const renderTooltipMinting = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Minting
        </Tooltip>
    );
    const renderTooltipWhiteList = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Whitelist
        </Tooltip>
    );
    const renderTooltipReferral = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Referral's Bonus
        </Tooltip>
    );
  
    const { handleMenuNavigate } = props;
    let locationSplit = location?.pathname?.split('/');
    
    return (
        <>
        {daoLuData !=null && 
        <>
          <React.Fragment>
            {locationSplit[1]=="minting" &&<CNavItem  className={locationSplit[2] == "dashboard" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipDashboard}
                >
                    <CNavLink className='customer' onClick={() => handleMenuNavigate('minting/dashboard')}><span className="icon menu" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>}
           {locationSplit[1]=="minting" && <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipCustomers}
                >
                    <CNavLink className='customer' onClick={() => handleMenuNavigate('minting/customers')}><span className="icon customer" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>}
            
            {locationSplit[1]=="minting" &&<CNavItem className={locationSplit[2] == "mintnow" ? "active" : "" || locationSplit[2] == "mintgeneral" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipMinting}
                >
                    <CNavLink className='minting-icon' onClick={() => handleMenuNavigate('minting/mintnow')}><span className="icon mint" />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>}
            {locationSplit[1]=="minting" && <CNavItem className={locationSplit[2] == "whitelist" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipWhiteList}
                >
                    <CNavLink className='whitelist-icon' onClick={() => handleMenuNavigate('minting/whitelist')}><span className={`icon whitelist`} />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>}
            {locationSplit[1]=="minting" && <CNavItem className={locationSplit[2] == "referral" ? "active" : ""}>
                <OverlayTrigger
                    placement="right"
                    overlay={renderTooltipReferral}
                >
                    <CNavLink className='referral-icon' onClick={() => handleMenuNavigate('minting/referral')}><span className={`icon referral`} />
                    </CNavLink>
                </OverlayTrigger>
            </CNavItem>}
            
        </React.Fragment>
        </>}
        </>
    )
}
export default MintingMenu;