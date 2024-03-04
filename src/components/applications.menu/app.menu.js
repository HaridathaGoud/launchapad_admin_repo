import { useSelector } from "react-redux"
import KycMenu from "./kyc";
import LaunchPadMenu from "./launchpad";
import MintingMenu from "./minting";
import MarketplaceMenu from "./marketplace";
import DaoMenu from "./dao";


function AppMenu({handleMenuNavigate}) {
    const app_name = useSelector(state => state.application.app_name);
    const appMenus = {
        "kyc": <KycMenu handleMenuNavigate={handleMenuNavigate} />,
        "launchpad": <LaunchPadMenu handleMenuNavigate={handleMenuNavigate} />,
        "dao":<DaoMenu handleMenuNavigate={handleMenuNavigate} />,
        "minting": <MintingMenu handleMenuNavigate={handleMenuNavigate} />,
        "marketplace": <MarketplaceMenu handleMenuNavigate={handleMenuNavigate} />
    }

    return (
        <>
            {appMenus[app_name]}
        </>
    )
}

export default AppMenu