import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import { useSelector} from 'react-redux';
function LaunchPadMenu(props){

  const isAdmin = useSelector(state => state.oidc?.adminDetails);
    const showSettings = useSelector(state => state.oidc?.isShowSettings);
    const viewedProject = useSelector(state => state.launchpad?.viewedProject);
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
    const renderTooltipProjects = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Projects
        </Tooltip>
    );
    const renderTooltipTransactions = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Transactions
        </Tooltip>
    );
    const popover = (
        <Popover id="popover-basic" className='settings-popover'>
          <Popover.Header as="h3" className='bg-transparent'>Settings</Popover.Header>
          <Popover.Body>
           <div onClick={()=>handleMenuNavigate('fcfs','true')}>Set FCFS Start Time</div>
           <div onClick={()=>handleMenuNavigate('fcfsendtime','true')}>Set FCFS End Time</div>
           <div onClick={()=>handleMenuNavigate('vestingtime','true')}>Set Vesting Time</div>
           <div onClick={()=>handleMenuNavigate('tokenlisting','true')}>Set Token Listing Time</div>
           <div onClick={()=>handleMenuNavigate('roundonestart','true')}>Set Round One Start Time</div>
           <div onClick={()=>handleMenuNavigate('roundoneend','true')}>Set Round One End Time</div>
           <div onClick={()=>handleMenuNavigate('allocation','true')}>Allocation</div>
           <div onClick={()=>handleMenuNavigate('allocationroundtwo','true')}> Round Two Allocation</div>
          </Popover.Body>
        </Popover>
      );
 
  const { handleMenuNavigate } = props;
  let locationSplit = location?.pathname?.split('/');
    if (isAdmin?.isAdmin) {
        return (
            <React.Fragment>
                {locationSplit[1]=="launchpad" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipDashboard} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard')}><span className="icon menu" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {isAdmin?.isAdmin && showSettings && viewedProject?.projectstatus=="Deployed"&&
                   <> {locationSplit[1] =="launchpad" && <CNavItem className={locationSplit[2] == "Settings" ? "active" : ""}>
                        <OverlayTrigger
                            placement="right"
                            trigger="focus"
                            overlay={popover} >
                            <Button variant="" className='setting-space' ><span className="icon nav-settings" /></Button>
                        </OverlayTrigger>
                    </CNavItem>}</>
                }
               {locationSplit[1] =="launchpad" && 
                <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipCustomers}
                    >
                        <CNavLink className='customer' onClick={() => handleMenuNavigate('launchpad/customers')}><span className="icon customer" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {locationSplit[1] =="launchpad" &&  <CNavItem className={locationSplit[2] == "investors" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipInvestorPage} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/investors')}
                        ><span className="icon investers me-0" /></CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {locationSplit[1] =="launchpad" && <CNavItem className={locationSplit[2] == "idorequest" ? "active" : ""}>
                    <> <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipIdoRequest} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/idorequest')}><span className="icon ido-request me-0" /></CNavLink>
                    </OverlayTrigger>
                    </>
                </CNavItem>}
                {locationSplit[1] =="launchpad" &&  <CNavItem className={locationSplit[2] == "transactions" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipTransactions} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/transactions')}><span className="icon transaction-list me-0" /></CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                
            </React.Fragment>
        )
    } else {
     return   (
        <React.Fragment>
            {locationSplit[1] =="launchpad" &&<CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
            <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipDashboard} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard')}><span className="icon menu" />
                        </CNavLink>
                    </OverlayTrigger>
                    </CNavItem>}
                    {locationSplit[1] =="launchpad" &&<CNavItem className={locationSplit[2] == "projects" ? "active" : ""}>
            <OverlayTrigger
                placement="right"
                overlay={renderTooltipProjects} >
                <CNavLink onClick={() => handleMenuNavigate(`launchpad/projects/${isAdmin.id}`)}><span className="icon ido-request me-0" /></CNavLink>
            </OverlayTrigger>
            </CNavItem>}
            </React.Fragment>
       )
    }
}
export default LaunchPadMenu;