import React from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import { useSelector} from 'react-redux';
import { useParams,useNavigate } from "react-router-dom";

function LaunchPadMenu(props){
  const {pId} = useParams();
  const isAdmin = useSelector(state => state.oidc?.adminDetails);
  const projectContractDetails = useSelector((reducerstore) => reducerstore.launchpad.projectDetails?.data?.projectsViewModel)

  const navigate = useNavigate();

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
    const renderTooltipSettings = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Settings
        </Tooltip>
    );
    const popover = (
        <Popover id="popover-basic" className='settings-popover'>
          <Popover.Header as="h3" className='bg-transparent'>Settings</Popover.Header>
          <Popover.Body>
                <div className='btn-transparent' onClick={() => handlenavigatemenu('fcfs')}>
                    Set FCFS Start Time
                </div>
                <div className='btn-transparent' onClick={() => handlenavigatemenu('fcfsendtime')}>
                    Set FCFS End Time
                </div>
                {/* <div className='btn-transparent' onClick={() => handlenavigatemenu('vestingtime')}>
                    Set Vesting Time
                </div> 
                <div className='btn-transparent' onClick={() => handlenavigatemenu('tokenlisting')}>
                    Set Token Listing Time
                </div>*/}
                <div className='btn-transparent' onClick={() => handlenavigatemenu('roundonestart')}>
                    Set Round One Start Time
                </div>
                <div className='btn-transparent' onClick={() => handlenavigatemenu('roundoneend')}>
                    Set Round One End Time
                </div>
                <div className='btn-transparent' onClick={() => handlenavigatemenu('allocation')}>
                    Allocation
                </div>
                <div className='btn-transparent' onClick={() => handlenavigatemenu('allocationroundtwo')}>
                    Round Two Allocation
                </div>
          </Popover.Body>
        </Popover>
      );
    const handlenavigatemenu = (menuItem) => {
        navigate(`/launchpad/investors/projects/${pId}/settings/${menuItem}`);
    }
  const { handleMenuNavigate,app_name } = props;
  let locationSplit = location?.pathname?.split('/');
    if (isAdmin?.isAdmin) {
        return (
            <React.Fragment>
                {locationSplit[1]=="launchpad" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipDashboard} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard',false,app_name)}><span className="icon menu" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
               {locationSplit[1] =="launchpad" && 
                <CNavItem className={locationSplit[2] == "customers" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipCustomers}
                    >
                        <CNavLink className='customer' onClick={() => handleMenuNavigate('launchpad/customers',false,app_name)}><span className="icon customer" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {locationSplit[1] =="launchpad" &&  <CNavItem className={locationSplit[2] == "investors" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipInvestorPage} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/investors',false,app_name)}
                        ><span className="icon investers me-0" /></CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {locationSplit[1] =="launchpad" && <CNavItem className={locationSplit[2] == "idorequest" ? "active" : ""}>
                    <> <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipIdoRequest} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/idorequest',false,app_name)}><span className="icon ido-request me-0" /></CNavLink>
                    </OverlayTrigger>
                    </>
                </CNavItem>}
                {locationSplit[1] =="launchpad" &&  <CNavItem className={locationSplit[2] == "transactions" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipTransactions} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/transactions',false,app_name)}><span className="icon transaction-list me-0" /></CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                {locationSplit[1] == "launchpad" && <CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipDashboard} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard', false, app_name)}><span className="icon menu" />
                        </CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {locationSplit[1] == "launchpad" && <CNavItem className={locationSplit[2] == "projects" ? "active" : ""}>
                    <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipProjects} >
                        <CNavLink onClick={() => handleMenuNavigate(`launchpad/projects/${isAdmin.id}`, false, app_name)}><span className="icon ido-request me-0" /></CNavLink>
                    </OverlayTrigger>
                </CNavItem>}
                {projectContractDetails?.projectStatus == "Deployed" && pId && projectContractDetails?.tokenType==="ERC-20"&&
                    <> {locationSplit[1] == "launchpad" &&
                        <OverlayTrigger
                            placement="right"
                            trigger="focus"
                            overlay={popover}
                        >
                            <div> <CNavItem className={locationSplit.includes("settings") ? "active" : ""}>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={renderTooltipSettings}
                                >
                                    <Button variant="" className='setting-space'><span className="icon nav-settings ms-1" /></Button>
                                </OverlayTrigger>
                            </CNavItem> </div>
                        </OverlayTrigger>
                    }
                    </>
                }
            </React.Fragment>
        )
    }
}
export default LaunchPadMenu;