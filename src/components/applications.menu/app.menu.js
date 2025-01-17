import { useSelector } from "react-redux"
import KycMenu from "./kyc";
import LaunchPadMenu from "./launchpad";
import MintingMenu from "./minting";
import MarketplaceMenu from "./marketplace";
import DaoMenu from "./dao";
import UserMenu from './userMenu';
import SettingsMenu from "./settingsMenu";
import PropTypes from 'prop-types'

function AppMenu({handleMenuNavigate}) {
    const app_name = useSelector(state => state.application.app_name);
    const appMenus = {
        "kyc": <KycMenu handleMenuNavigate={handleMenuNavigate} />,
        "launchpad": <LaunchPadMenu handleMenuNavigate={handleMenuNavigate} app_name="launchpad"/>,
        "dao":<DaoMenu handleMenuNavigate={handleMenuNavigate} app_name="dao"/>,
        "minting": <MintingMenu handleMenuNavigate={handleMenuNavigate} />,
        "marketplace": <MarketplaceMenu handleMenuNavigate={handleMenuNavigate} app_name="marketplace"/>,
        "userprofile":<UserMenu handleMenuNavigate={handleMenuNavigate} app_name="launchpad" />,
        "Settings":<SettingsMenu handleMenuNavigate={handleMenuNavigate} app_name="launchpad"/>,
    }

    return (
        <>
            {appMenus[app_name]}
        </>
    )
}
AppMenu.propTypes = {
    handleMenuNavigate: PropTypes.any,
  };
export default AppMenu