
export const amoyNetwork = {
    id: 80002,
    name: 'Polygon Amoy',
    network:'matic',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
      default: { http: [process.env.REACT_APP_JSONRPC_URL || ""] },
      public: { http: [process.env.REACT_APP_JSONRPC_URL || ""] },
      alchemy: {http: [process.env.REACT_APP_ALCHEMY_PROVIDER || ""]}
    },
    blockExplorers: {
      default: { name: 'Polygon Amoy', url: 'https://amoy.polygonscan.com/' },
    },
    contracts: {
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      },
      ensUniversalResolver: {
        address: '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
      },
   
    },
  }