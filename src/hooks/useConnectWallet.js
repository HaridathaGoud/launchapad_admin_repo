import { useConnect, useAccount } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';
import { switchNetwork } from 'wagmi/actions';
export function useConnectWallet() {

    const { connectAsync } = useConnect({ connector: new InjectedConnector() });
    const { isConnected } = useAccount();
    async function connectWallet() {
        if (window?.ethereum) {
            if (isConnected) {
                return true;
            } else {
                const {chain } = await connectAsync();
                if (chain?.id !== Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID)) {
                    await switchNetwork({
                        chainId: Number(process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID) || 0,
                    });
                    return true;
                }
                else {
                    return true;
                }
            }
        } else {
            window.open("https://metamask.io/download/", "_blank");
        }
    }
    return {
        connectWallet
    }
}