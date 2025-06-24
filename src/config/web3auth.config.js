import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = "BOCzzfHpvqRAcEwjN7P37ChbxlCOXEv-5wETWpEyY2H73d9fUC4ATOI9cq5b11YcOZxPTxgaE3O1zyfBiZySei0";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89", // Polygon Mainnet
  rpcTarget: "https://polygon-rpc.com",
  displayName: "Polygon Mainnet",
  blockExplorer: "https://polygonscan.com",
  ticker: "MATIC",
  tickerName: "Polygon",
};

// Use SAPPHIRE_MAINNET for production
const web3AuthNetwork = WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Basic configuration for FREE plan - NO UI customization allowed
export const web3AuthConfig = {
  clientId,
  web3AuthNetwork,
  chainConfig,
  privateKeyProvider,
  // NO modalConfig for free plan
  // NO uiConfig for free plan
  // NO adapters config for free plan
};