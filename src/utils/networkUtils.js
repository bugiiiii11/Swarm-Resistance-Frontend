// utils/networkUtils.js
// Helper utility for debugging and managing network connections

export const NETWORKS = {
  ETHEREUM: {
    chainId: '0x1',
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io'
  },
  POLYGON: {
    chainId: '0x89',
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  BSC: {
    chainId: '0x38',
    name: 'BSC Mainnet',
    currency: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com'
  },
  ARBITRUM: {
    chainId: '0xa4b1',
    name: 'Arbitrum One',
    currency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io'
  }
};

export const networkUtils = {
  // Get network info by chain ID
  getNetworkInfo: (chainId) => {
    return Object.values(NETWORKS).find(network => network.chainId === chainId) || {
      chainId,
      name: `Unknown Network (${chainId})`,
      currency: 'Unknown',
      rpcUrl: '',
      blockExplorer: ''
    };
  },

  // Check if current network is Polygon
  isPolygonNetwork: (chainId) => {
    return chainId === NETWORKS.POLYGON.chainId;
  },

  // Get current network from MetaMask
  getCurrentNetwork: async () => {
    if (!window.ethereum) {
      throw new Error('No ethereum provider found');
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return chainId;
    } catch (error) {
      console.error('Error getting current network:', error);
      throw error;
    }
  },

  // Check MetaMask connection status
  checkMetaMaskStatus: async () => {
    if (!window.ethereum) {
      return {
        installed: false,
        connected: false,
        network: null,
        accounts: []
      };
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      return {
        installed: true,
        connected: accounts.length > 0,
        network: networkUtils.getNetworkInfo(chainId),
        accounts
      };
    } catch (error) {
      console.error('Error checking MetaMask status:', error);
      return {
        installed: true,
        connected: false,
        network: null,
        accounts: [],
        error: error.message
      };
    }
  },

  // Switch to Polygon network
  switchToPolygon: async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    try {
      // Try to switch to Polygon
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.POLYGON.chainId }],
      });
      
      return { success: true, action: 'switched' };
      
    } catch (switchError) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: NETWORKS.POLYGON.chainId,
              chainName: NETWORKS.POLYGON.name,
              nativeCurrency: {
                name: NETWORKS.POLYGON.currency,
                symbol: NETWORKS.POLYGON.currency,
                decimals: 18,
              },
              rpcUrls: [NETWORKS.POLYGON.rpcUrl],
              blockExplorerUrls: [NETWORKS.POLYGON.blockExplorer],
            }],
          });
          
          return { success: true, action: 'added_and_switched' };
          
        } catch (addError) {
          throw new Error(`Failed to add Polygon network: ${addError.message}`);
        }
      } else if (switchError.code === 4001) {
        throw new Error('User rejected the network switch request');
      } else {
        throw new Error(`Failed to switch to Polygon: ${switchError.message}`);
      }
    }
  },

  // Debug function to log all network info
  debugNetworkInfo: async () => {
    console.group('🔍 Network Debug Info');
    
    try {
      const status = await networkUtils.checkMetaMaskStatus();
      console.log('MetaMask Status:', status);
      
      if (status.connected && status.network) {
        console.log('Current Network:', status.network);
        console.log('Is Polygon?', networkUtils.isPolygonNetwork(status.network.chainId));
        console.log('Connected Accounts:', status.accounts);
      }
      
      if (window.ethereum) {
        console.log('Provider Info:', {
          isMetaMask: window.ethereum.isMetaMask,
          version: window.ethereum.version,
          providers: window.ethereum.providers?.length || 0
        });
      }
      
    } catch (error) {
      console.error('Debug Error:', error);
    }
    
    console.groupEnd();
  },

  // Listen to network changes
  onNetworkChange: (callback) => {
    if (!window.ethereum) return;

    const handleChainChanged = (chainId) => {
      const networkInfo = networkUtils.getNetworkInfo(chainId);
      callback({
        chainId,
        network: networkInfo,
        isPolygon: networkUtils.isPolygonNetwork(chainId)
      });
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    
    // Return cleanup function
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  },

  // Listen to account changes
  onAccountChange: (callback) => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      callback({
        accounts,
        connected: accounts.length > 0
      });
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    // Return cleanup function
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }
};

// Debug helper - call this in console to debug network issues
window.debugNetwork = networkUtils.debugNetworkInfo;