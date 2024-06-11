import React, {  useEffect } from 'react';
import './scss/style.scss';
import '../src/assets/css/custom-styles.css';
import '../src/assets/css/launchpadadmin.css';
import '../src/assets/css/marketplace.css';
import '../src/assets/css/dark-theme.css';
import '../src/assets/css/dao-style.css';
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import DefaultLayout from './layout/DefaultLayout';
import HomePage from './components/home';
import ProfileInfo from './components/profile/profileInfo';
import UserInfo from './components/users';
import CallbackPage from"./authentication/callback.components";
import {  OidcProvider } from 'redux-oidc';
import store from "src/store/index";
import { userManager } from './authentication';
import { Provider, connect } from "react-redux";
import Alerts from './components/users/userGrid';
import UserProfile from './components/userProfile';
import Settings from './components/settings';
import CustomerInfo from './components/profile/CustomerInfo';
import CustomersInfo from './components/nftMarketplace/customers';
import NftKycDetails from './components/nftMarketplace/kyc';
import Nfts from './components/nftMarketplace/nfts';
import CollectionsView from './components/nftMarketplace/collectionsView';
import ActivityDetails from './components/nftMarketplace/activity';
import CustomerView from './components/nftMarketplace/customerView';
import BiddingDetails from './components/nftMarketplace/biddingdetails';
import KYCDashboard from './components/kyc/dasboard';
import KYCCustomers from './components/kyc/kycCustomers';
import LaunchPadDashboard from './components/launchpad/dashboard';
import IDORequest from './components/launchpad/idoRequest';
import Investors from './components/launchpad/investors';
import MarketplaceDashboard from './components/nftMarketplace/dashboardPage';
import Collections from './components/nftMarketplace/collections';
import ProjectCards from '../src/components/launchpad/projects/projectCards';
import Projects from '../src/components/launchpad/projects/projects';
import Transactions from '../src/components/launchpad/transactions';
import CustomerGrid from './components/minting/CustomerInfo';
import MintingDashboard from './components/minting/dashboard';
import MarketplaceCustomers from './components/nftMarketplace/customerGrid';
import LaunchpadCustomers from '../src/components/launchpad/customers';
import AppSidebar  from '../src/components/AppSidebar';
import FcfsStart from './components/launchpad/settings/fcfs';
import FcfsEndtime from './components/launchpad/settings/fcfsendtime';
import VestingTime from './components/launchpad/settings/vestingTime';
import TokenListing from './components/launchpad/settings/tokenListing';
import RoundOneStart from './components/launchpad/settings/roundOneStart';
import RoundOneEnd from './components/launchpad/settings/roundOneEnd';
import PeojectAllocation from './components/launchpad/settings/projectAllocation';
import AllocationRoundTwo from './components/launchpad/settings/allocationRoundTwo';
import CreatorPage from "./components/nftMarketplace/creatorPage"
import Auditlogs from './components/auditLog.component/auditLog'
import MintingGrid from './components/minting/mintedGrid'
import MintCustomersInfo from './components/minting/MintCustomerDetails'
import { getIpRegisteryData } from './reducers/authReducer';
import MintWhitelist from './components/minting/whitelist';
import Mintingsidemenu from './components/minting/minting';
import MintGeneral from './components/minting/mintgeneral';
import { WagmiConfig, createConfig,configureChains, mainnet } from 'wagmi'
import { createPublicClient, http } from 'viem'
import Referral from './components/minting/referral';
import Dao from './components/dao.component/proposalCards';
import CreatePraposal from './components/createpraposal.component/createpraposal';
import PublishProposal from './components/createpraposal.component/publishProposal';
import Success from './components/createpraposal.component/thankyou';
import ProposalView from './components/createpraposal.component/viewproposal';
import Voting from './components/voting.component/voting';
import Dashboard from './components/dashboard.component/daoCards';
import ProposalViewstatus from './components/createpraposal.component/viewproposalstatus';
import FirstPraposal from './components/firstpraposal.component/firstpraposal';
import LaunchPadProjectDetails from  "./components/launchpad/launchpadProject/projectDetails"
import Pageerror from './components/pagenotfound';
import ProjectsPoolsStaking from './components/launchpad/projects/projectPoolsStakingPercentage';
import ProjectsTokenClaim from './components/launchpad/projects/projectTokenClaim';
import ProjectTokenDetails from './components/launchpad/projects/projectTokenDetails';
import ErrorPage from './components/errorPage/errorPage'; 
import PropTypes from 'prop-types'
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { amoyNetwork } from './utils/amoyConfig';
import { polygon} from 'viem/chains';
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
const { chains, publicClient } = configureChains(
  [polygon,amoyNetwork],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.REACT_APP_RPC_URL || '',
      }),
    }),
  ],
)
const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Browser Wallet',
      },
    }),
  ],
  publicClient
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
       { path: "callback", element: <CallbackPage />, errorElement: <>Somthing went wrong</> },
       { path: "projects", element: <ProjectCards />, errorElement: <>Somthing went wrong</>, },
      { path: "home", element: <HomePage />, errorElement: <>Somthing went wrong</> },
      { path: "kyc/dashboard",index:true, element: <KYCDashboard />, errorElement: <>Somthing went wrong</> },
      { path: "kyc/customers", element: <KYCCustomers />, errorElement: <>Somthing went wrong</> },
      { path: "kyc/auditlogs", element: <Auditlogs />, errorElement: <>Somthing went wrong</> },
      { path: "kyc/customers/profileinfo/:address?/:id", element: <ProfileInfo />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad", element: <LaunchPadDashboard />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/dashboard", element: <LaunchPadDashboard />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/customers", element: <LaunchpadCustomers />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/customers/profileInfo/:type/:address?", element: <ProfileInfo />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/customers/profileInfo/profileinfo/:address?", element: <ProfileInfo />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/customers/profileInfo/profileinfo/:address/:tab?", element: <ProfileInfo />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/investors", element: <Investors />, errorElement: <>Somthing went wrong</> },
      
      { path: "launchpad/transactions", element: <Transactions />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/auditlogs", element: <Auditlogs />, errorElement: <>Somthing went wrong</> },


      { path: "launchpad/investors/projects/:projectId?", element: <ProjectCards />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/investors/userprofile/:id?/:view", element: <UserProfile />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/investors/projects/:pId?/:mode", element: <Projects />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/investors/addProjectdetails/:pId?", element: <Projects />, errorElement: <>Somthing went wrong</> },



      { path: "launchpad/idorequest", element: <IDORequest />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/idorequest/projectDetails/:pId?", element: <Projects />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/idorequest/projectDetails/:projectId/:paymentmethod?", element: <ProjectTokenDetails />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/idorequest/projectDetails/:projectId/:poolstaking?", element: <ProjectsPoolsStaking />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/idorequest/projectDetails/:projectId/:tokneclaim?", element: <ProjectsTokenClaim />, errorElement: <>Somthing went wrong</> },



      { path: "launchpad/transactions", element: <Transactions />, errorElement: <>Somthing went wrong</> },
      { path: "launchpad/projects/:projectId?", element: <ProjectCards />, errorElement: <>Somthing went wrong</> },
      
       { path: "launchpad/projects/projectdetails/:projectType?/:id", element: <LaunchPadProjectDetails />, errorElement: <>Somthing went wrong</> },
     
     
       { path: "minting/customers/profileinfo/:address?/:id", element: <MintCustomersInfo />,errorElement :<Pageerror /> },
      { path: "minting", element: <MintingDashboard />,errorElement :<Pageerror /> },
      { path: "minting/dashboard", element:  <MintingDashboard /> ,errorElement :<Pageerror /> },
      { path: "minting/customers", element: <CustomerGrid />,errorElement :<Pageerror />},
      { path: "minting/referral", element: <Referral></Referral>, errorElement :<Pageerror /> },
      { path: "minting/auditlogs", element: <Auditlogs />,errorElement :<Pageerror /> },
      { path: "minting/mintnow", element: <Mintingsidemenu />, errorElement :<Pageerror /> },
      { path: "minting/whitelist", element: <MintWhitelist />, errorElement :<Pageerror /> },
      { path: "minting/mintgeneral", element: <MintGeneral />,errorElement :<Pageerror /> },
      

      { path: "dao/proposal/:id", element: <Dao />,errorElement :<Pageerror /> },
      { path: "dao/createpraposal/:id", element: <CreatePraposal />,errorElement :<Pageerror /> },
      { path: "dao/publishproposal/:id", element: <PublishProposal/>,errorElement :<Pageerror /> },
      { path: "dao/success/:id", element: <Success/>,errorElement :<Pageerror /> },
      { path: "dao/proposalview/:id", element: <ProposalView/>,errorElement :<Pageerror />},
      { path: "/dao/voting", element: <Voting/>,errorElement :<Pageerror /> },
      { path: "/dao/dashboard", element: <Dashboard/>,errorElement :<Pageerror /> },
      { path: "dao/proposalviewstatus/:id?/:daoId?", element: <ProposalViewstatus/>,errorElement :<Pageerror /> },
      { path: "dao/firstproposal", element: <FirstPraposal/>, errorElement :<Pageerror /> },
      {
        path: "marketplace",
        element: <React.Suspense fallback={<>Loading....</>}><MarketplaceDashboard /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/dashboard",
        element: <React.Suspense fallback={<>Loading....</>}><MarketplaceDashboard /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/customers",
        element: <React.Suspense fallback={<>Loading....</>}><MarketplaceCustomers /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/auditlogs",
        element: <React.Suspense fallback={<>Loading....</>}><Auditlogs /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/customers/profileinfo/:key/:address?",
        element: <React.Suspense fallback={<>Loading....</>}><CustomersInfo /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/collections",
        element: <React.Suspense fallback={<>Loading....</>}><Collections /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/collections/nfts/:collectionId",
        element: <React.Suspense fallback={<>Loading....</>}><CollectionsView /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/customers/profileinfo/:tokenId/:collectionContractAddress/:id/view",
        element: <React.Suspense fallback={<>Loading....</>}><CustomerView /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/:accountType/profile/:address",
        element: <React.Suspense fallback={<>Loading....</>}><CreatorPage /></React.Suspense>,
        errorElement :<Pageerror />
      },
      {
        path: "marketplace/categoryview/:category",
        element: <React.Suspense fallback={<>Loading....</>}><CollectionsView /></React.Suspense>,
        errorElement :<Pageerror />
      },

      { path: "profileinfo/:address?", element: <ProfileInfo />, errorElement: <>Somthing went wrong</> },
      { path: "userprofile", element:<UserProfile/>, errorElement:<>Somthing went wrong</>,},
      { path: "settings", element:<Settings/>, errorElement:<>Somthing went wrong</>,},
      { path: "users", element: <UserInfo />, errorElement: <>Somthing went wrong</> },
      { path: "customerinfo", element: <CustomerInfo />, errorElement: <>Somthing went wrong</> },
      { path: "usergrid", element: <Alerts />, errorElement: <>Somthing went wrong</> },
      { path: "kyc", element: <NftKycDetails />, errorElement: <>Somthing went wrong</> },
      { path: "nfts", element: <Nfts />, errorElement: <>Somthing went wrong</> },
      { path: "activity", element: <ActivityDetails />, errorElement: <>Somthing went wrong</> },
      { path: "customerView", element: <CustomerView />, errorElement: <>Somthing went wrong</> },
      { path: "biddingdetails", element: <BiddingDetails />, errorElement: <>Somthing went wrong</> },
      { path: "auditlogs", element: <Auditlogs />, errorElement: <>Somthing went wrong</> },
      { path: "minting/mintednfts", element: <MintingGrid />, errorElement: <>Somthing went wrong</> },

      {
        path: "launchpad/investors/projects", element: <>
          <AppSidebar />
          <div className=" d-flex flex-column  content-bg"><Outlet />
          </div></>, children: [
            {
              path: ":pId/settings/fcfs", element: <FcfsStart />
            },
            {
              path: ":pId/settings/fcfsendtime", element: <FcfsEndtime />
            },
            {
              path: ":pId/settings/vestingtime", element: <VestingTime />
            },
            {
              path: ":pId/settings/tokenlisting", element: <TokenListing />
            },
            {
              path: ":pId/settings/roundonestart", element: <RoundOneStart />
            },
            {
              path: ":pId/settings/roundoneend", element: <RoundOneEnd />
            },
            {
              path: ":pId/settings/allocation", element: <PeojectAllocation />
            },
            {
              path: ":pId/settings/allocationroundtwo", element: <AllocationRoundTwo />
            },
          ]
      },
      {
        path: "*",
         element: <React.Suspense fallback={<div className="text-center"></div>}><Pageerror /></React.Suspense>
    },
      {
        path: "error",
         element: <React.Suspense fallback={<div className="text-center"></div>}><ErrorPage /></React.Suspense>
     },
  
  
    ]
  },
 
]);
const App =(props)=> {
  useEffect(()=>{
    props.trackauditlogs(props.user?.profile?.sub)
  },[])  

    return ( 
      <WagmiConfig config={config}>
      <Provider store={store}>
      <OidcProvider userManager={userManager} store={store}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
      </OidcProvider>
      </Provider>
      </WagmiConfig>
    )
  }
  
  App.propTypes = {
    user: PropTypes.any,
    trackauditlogs: PropTypes.any,
  }
const connectStateToProps = ({ userConfig, oidc }) => {
	return { userConfig: userConfig?.userProfileInfo, user: oidc?.profile }
  }
  const connectDispatchToProps = dispatch => {
	return {
    trackauditlogs: (useremail) => {
      dispatch(getIpRegisteryData(useremail));
    }
	}
  }
  
  export default connect(connectStateToProps,connectDispatchToProps)(App);
