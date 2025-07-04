import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// Get environment variables
const getClientId = () => {
  const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
  if (!clientId) {
    console.error('VITE_WEB3AUTH_CLIENT_ID environment variable is not set');
    return "BOCzzfHpvqRAcEwjN7P37ChbxlCOXEv-5wETWpEyY2H73d9fUC4ATOI9cq5b11YcOZxPTxgaE3O1zyfBiZySei0"; // fallback
  }
  return clientId;
};

const getWeb3AuthNetwork = () => {
  const network = import.meta.env.VITE_WEB3AUTH_NETWORK;
  return network === 'sapphire_mainnet' ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;
};

// Detect environment
const isProduction = () => {
  return (
    import.meta.env.VITE_APP_ENV === 'production' ||
    import.meta.env.PROD ||
    window.location.hostname === 'www.cryptomeda.tech' ||
    window.location.hostname === 'cryptomeda.tech' ||
    window.location.hostname.includes('vercel.app')
  );
};

const isDevelopment = () => {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    import.meta.env.DEV
  );
};

// Get current origin for redirect URIs
const getCurrentOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for SSR or initial load
  if (isProduction()) {
    return 'https://www.cryptomeda.tech';
  }
  
  return 'http://localhost:3000';
};

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89", // Polygon Mainnet
  rpcTarget: "https://polygon-rpc.com",
  displayName: "Polygon Mainnet",
  blockExplorer: "https://polygonscan.com",
  ticker: "MATIC",
  tickerName: "Polygon",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Create configuration based on environment
export const web3AuthConfig = {
  clientId: getClientId(),
  web3AuthNetwork: getWeb3AuthNetwork(),
  chainConfig,
  privateKeyProvider,
  // Add redirect URI configuration
  redirectUrl: getCurrentOrigin(),
  // Add additional configuration for better compatibility
  storageKey: "local", // Use localStorage instead of sessionStorage
  sessionTime: 86400, // 24 hours
};

// Debug logging for environment detection
if (isDevelopment()) {
  console.log('[Web3Auth Config] Environment: Development');
  console.log('[Web3Auth Config] Origin:', getCurrentOrigin());
  console.log('[Web3Auth Config] Client ID:', getClientId());
} else if (isProduction()) {
  console.log('[Web3Auth Config] Environment: Production');
  console.log('[Web3Auth Config] Origin:', getCurrentOrigin());
}

// Export environment helpers
export const environmentConfig = {
  isProduction: isProduction(),
  isDevelopment: isDevelopment(),
  currentOrigin: getCurrentOrigin(),
};