import React,{useState,useReducer} from 'react'
import { CNavItem, CNavLink } from '@coreui/react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import { useSelector} from 'react-redux';
const reducer = (state, action) => {
    switch (action.type) {
      case "isVissble":
        return { ...state, isVissble: action.payload };
      default:
        return state;
    }
  }
  const initialState = {
    isVissble: false,
  };
function LaunchPadMenu(props){
    const [state, dispatch] = useReducer(reducer, initialState);

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
    const renderTooltipSettings = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Settings
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
      const handleHoverButtonClick = () => {
       dispatch({ type: 'isVissble', payload: true })

    };
    const handleFocusButtonClick=()=>{
        setTimeout(() => {
            dispatch({ type: 'isVissble', payload: false })
        }, 4000);
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
                {isAdmin?.isAdmin && showSettings && viewedProject?.projectstatus=="Deployed"&&
                   <> {locationSplit[1] =="launchpad" && <CNavItem className={locationSplit[2] == "Settings" ? "active" : ""}>
                 {!state.isVissble&& <OverlayTrigger
                       placement="right"
                       trigger="hover"
                       overlay={  renderTooltipSettings}
                       >
                 <Button variant="" className='setting-space' onClick={handleHoverButtonClick}><span className="icon nav-settings ms-1" /></Button>
                   </OverlayTrigger>}

                   {state.isVissble &&<OverlayTrigger
                       placement="right"
                       trigger="focus"
                       overlay={popover}
                       >
                 <Button variant="" className='setting-space' onClick={handleFocusButtonClick}><span className="icon nav-settings ms-1" /></Button>
                   </OverlayTrigger>}
               </CNavItem>}</>
           }
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
     return   (
        <React.Fragment>
            {locationSplit[1] =="launchpad" &&<CNavItem className={locationSplit[2] == "dashboard" ? "active" : ""}>
            <OverlayTrigger
                        placement="right"
                        overlay={renderTooltipDashboard} >
                        <CNavLink onClick={() => handleMenuNavigate('launchpad/dashboard',false,app_name)}><span className="icon menu" />
                        </CNavLink>
                    </OverlayTrigger>
                    </CNavItem>}
                    {locationSplit[1] =="launchpad" &&<CNavItem className={locationSplit[2] == "projects" ? "active" : ""}>
            <OverlayTrigger
                placement="right"
                overlay={renderTooltipProjects} >
                <CNavLink onClick={() => handleMenuNavigate(`launchpad/projects/${isAdmin.id}`,false,app_name)}><span className="icon ido-request me-0" /></CNavLink>
            </OverlayTrigger>
            </CNavItem>}
            </React.Fragment>
       )
    }
}
export default LaunchPadMenu;