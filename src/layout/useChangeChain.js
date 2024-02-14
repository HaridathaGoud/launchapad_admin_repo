export function changeNetwork() {
    async function switchNetwork() {
      return await window?.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId:process.env.REACT_APP_POLYGON_CHAIN_HEX_ID,
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
    return { switchNetwork };
  }
  