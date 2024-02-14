import { useConnect, useAccount } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';

export function useConnectWallet() {

    const { connectAsync } = useConnect({ connector: new InjectedConnector() });
    const { isConnected } = useAccount();
    async function switchNetwork() {
        return await window?.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: process.env.REACT_APP_POLYGON_CHAIN_HEX_ID,
                    rpcUrls: [process.env.REACT_APP_RPC_URL],
                    chainName: process.env.REACT_APP_CHAIN_NETWORK,
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18,
                    },
                    blockExplorerUrls: [process.env.REACT_APP_BLOCKEXPLORER],
                },
            ],
        });
    }
    async function connectWallet() {
        if (window?.ethereum) {
            if (isConnected) {
                return true;
            } else {
                const {chain } = await connectAsync();
                if (chain.id == process.env.REACT_APP_POLYGON_CHAIN_HEX_ID || chain.id == process.env.REACT_APP_POLYGON_CHAIN_NUMARIC_ID) {
                    return true;
                }
                else {
                    await switchNetwork();
                    await connectAsync();
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