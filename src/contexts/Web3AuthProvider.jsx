import { useState, useEffect, useCallback, useRef, Component } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { web3AuthConfig } from '../config/web3auth.config.js';
import { userProfileService } from '../services/userProfile.service.js';
import { tokenService } from '../services/tokenService.js';
import { nftService } from '../services/nftService.js';
import { Web3AuthContext } from './Web3AuthContext.js';
import PropTypes from 'prop-types';
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

// Simple debugging - only enable in development
const DEBUG_MODE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const log = (message, data = null) => {
  if (DEBUG_MODE) {
    console.log(`[Web3Auth Debug] ${message}`, data || '');
  }
};

// Wallet preference storage utilities
const CONNECTION_STORAGE_KEY = 'swarm_resistance_wallet_preference';

const saveWalletPreference = (walletType) => {
  try {
    localStorage.setItem(CONNECTION_STORAGE_KEY, walletType);
    log('Saved wallet preference:', walletType);
  } catch (error) {
    console.warn('Unable to save wallet preference:', error);
  }
};

const getWalletPreference = () => {
  try {
    const preference = localStorage.getItem(CONNECTION_STORAGE_KEY);
    log('Retrieved wallet preference:', preference);
    return preference;
  } catch (error) {
    console.warn('Unable to get wallet preference:', error);
    return null;
  }
};

const clearWalletPreference = () => {
  try {
    localStorage.removeItem(CONNECTION_STORAGE_KEY);
    log('Cleared wallet preference');
  } catch (error) {
    console.warn('Unable to clear wallet preference:', error);
  }
};

// Error Boundary Component for Web3Auth
class Web3AuthErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Web3Auth Error Boundary:', error, errorInfo);
    
    setTimeout(() => {
      this.setState({ hasError: false, error: null });
    }, 10000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-void-dark">
          <div className="text-center p-8 bg-red-900/20 border border-red-500/30 rounded-lg max-w-md">
            <h2 className="text-xl font-orbitron font-bold text-red-400 mb-4">
              Wallet Connection Error
            </h2>
            <p className="text-stellar-white mb-4 text-sm">
              Something went wrong with the wallet connection. The page will automatically retry in a few seconds.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-phoenix-primary px-4 py-2 text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

Web3AuthErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Web3AuthProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [medaGasBalance, setMedaGasBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [nftHoldings, setNftHoldings] = useState(null);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [isOnPolygon, setIsOnPolygon] = useState(true);

  // Use refs to track initialization status and prevent multiple calls
  const isInitialized = useRef(false);
  const isLoadingData = useRef(false);

  // Check if we're in production
  const isProduction = () => {
    return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  };

  // Enhanced MetaMask detection function with better logging
  const isMetaMaskInstalled = () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        log('No window.ethereum found');
        return false;
      }

      const { ethereum } = window;
      
      // Multiple detection methods for different MetaMask versions
      const isMetaMaskDirect = Boolean(ethereum && ethereum.isMetaMask);
      const hasMetaMaskProperty = Boolean(ethereum && ethereum._metamask);
      const hasMetaMaskInProviders = Boolean(
        ethereum && 
        ethereum.providers && 
        ethereum.providers.find(p => p.isMetaMask)
      );
      
      const isMetaMaskSelected = Boolean(
        ethereum && 
        ethereum.providers && 
        ethereum.selectedProvider && 
        ethereum.selectedProvider.isMetaMask
      );
      
      const hasLegacyMetaMask = Boolean(
        ethereum && 
        (ethereum.networkVersion || ethereum.chainId) &&
        !ethereum.isBitKeep && 
        !ethereum.isCoinbaseWallet &&
        !ethereum.isWalletConnect
      );
      
      const hasMetaMask = isMetaMaskDirect || hasMetaMaskProperty || hasMetaMaskInProviders || isMetaMaskSelected || hasLegacyMetaMask;

      log('MetaMask detection:', {
        hasEthereum: !!ethereum,
        isMetaMaskDirect,
        hasMetaMaskProperty,
        hasProviders: !!ethereum?.providers,
        providersCount: ethereum?.providers?.length || 0,
        hasMetaMaskInProviders,
        isMetaMaskSelected,
        hasLegacyMetaMask,
        selectedProvider: ethereum?.selectedProvider?.constructor?.name,
        version: ethereum?.version || 'unknown',
        finalResult: hasMetaMask,
        isProduction: isProduction()
      });

      return hasMetaMask;
    } catch (error) {
      console.error('Error detecting MetaMask:', error);
      return false;
    }
  };

  // Get current network
  const getCurrentNetwork = useCallback(async () => {
    if (!window.ethereum) return null;
    
    try {
      log('Getting current network...');
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      log('Current network:', chainId);
      return chainId;
    } catch (error) {
      console.error('Error getting current network:', error);
      return null;
    }
  }, []);

// Enhanced function to switch to Polygon network - HOSTINGER OPTIMIZED with better error handling
const switchToPolygon = useCallback(async () => {
  if (!window.ethereum) {
    log('No ethereum provider found - using Web3Auth internal network handling');
    return true;
  }

  // Check if we're on Hostinger (production)
  const isHostinger = window.location.hostname.includes('cryptomeda.tech') || 
                     window.location.hostname.includes('.hostinger.') ||
                     (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

  try {
    log('Attempting to switch to Polygon network...');
    log('Environment:', isHostinger ? 'Hostinger/Production' : 'Localhost');
    
    if (isHostinger) {
      // HOSTINGER-SPECIFIC: Focus the window first to prevent popup blocking
      window.focus();
      
      // Wait for user interaction to be "fresh" 
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to bring MetaMask to front if possible
      if (window.ethereum.isMetaMask) {
        try {
          // Request accounts first to ensure MetaMask is "awake"
          await window.ethereum.request({ method: 'eth_accounts' });
        } catch (accountError) {
          log('Account check failed, continuing with network switch...');
        }
      }
    }
    
    // The actual network switch request
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x89' }],
    });
    
    log('Successfully switched to Polygon network');
    
    // Wait longer on Hostinger for the switch to complete
    if (isHostinger) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return true;
    
  } catch (switchError) {
    log('Switch failed, error code:', switchError.code, 'message:', switchError.message);
    
    if (switchError.code === 4001) {
      // User rejected the request
      log('User rejected network switch request');
      if (isHostinger) {
        throw new Error('Network switch was cancelled. Please manually switch to Polygon network in MetaMask and try again.');
      } else {
        throw new Error('Network switch rejected by user. Please switch to Polygon network manually to continue.');
      }
      
    } else if (switchError.code === 4902) {
      // Chain not added - try to add it
      log('Polygon network not found in MetaMask, attempting to add...');
      return await addPolygonNetwork();
      
    } else if (switchError.code === -32002) {
      // Request already pending - very common on Hostinger
      log('Network switch request already pending...');
      
      if (isHostinger) {
        // On Hostinger, show specific instructions
        throw new Error('MetaMask is processing a network request. Please check MetaMask and complete the network switch, then try connecting again.');
      } else {
        // Wait for the pending request to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if we're now on Polygon
        const currentChainId = await getCurrentNetwork();
        if (currentChainId === '0x89') {
          log('Network switch completed successfully');
          return true;
        } else {
          throw new Error('Please complete the network switch in MetaMask and try again.');
        }
      }
      
    } else if (switchError.code === -32603) {
      // Internal error - common with popup blocking
      log('Internal error detected, likely popup blocked');
      
      if (isHostinger) {
        throw new Error('MetaMask popup was blocked. Please allow popups for this site and manually switch to Polygon network in MetaMask.');
      } else {
        throw new Error('MetaMask internal error. Please try again.');
      }
      
    } else if (switchError.message?.includes('nativeCurrency') || 
               switchError.message?.includes('currency symbol')) {
      // Currency conflict - network exists but with different config
      log('Polygon network exists with different configuration, continuing...');
      return true;
      
    } else {
      console.error('Unexpected error switching networks:', switchError);
      
      // Hostinger-specific error messages
      if (isHostinger) {
        if (switchError.message?.includes('popup') || switchError.message?.includes('blocked')) {
          throw new Error('MetaMask popup was blocked. Please allow popups for this site and manually switch to Polygon network.');
        } else {
          throw new Error('Network switch failed. Please manually switch to Polygon network in MetaMask and try connecting again.');
        }
      } else {
        throw new Error(`Failed to switch to Polygon network: ${switchError.message}`);
      }
    }
  }
}, [getCurrentNetwork]);

  // Add Polygon network - PRODUCTION OPTIMIZED
  const addPolygonNetwork = useCallback(async () => {
  const isHostinger = window.location.hostname.includes('cryptomeda.tech') || 
                     window.location.hostname.includes('.hostinger.') ||
                     (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

  try {
    log('Adding Polygon network to MetaMask...');
    
    if (isHostinger) {
      // Focus window and prepare for popup
      window.focus();
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const polygonConfig = {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com'],
    };
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [polygonConfig],
    });
    
    log('Successfully added Polygon network');
    
    // Wait longer on Hostinger for the addition to complete
    if (isHostinger) {
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
    
    return true;
    
  } catch (addError) {
    console.error('Failed to add Polygon network:', addError);
    
    if (addError.code === 4001) {
      throw new Error('Adding Polygon network was rejected by user');
    }
    
    if (addError.code === -32002) {
      // Request already pending
      log('Add network request already pending...');
      
      if (isHostinger) {
        throw new Error('MetaMask is processing a request. Please check MetaMask, complete the add network request, then try again.');
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
      }
    }
    
    if (addError.code === -32603) {
      // Internal error / popup blocked
      if (isHostinger) {
        throw new Error('MetaMask popup was blocked. Please allow popups for this site and manually add Polygon network.');
      }
    }
    
    // If adding fails but network exists, try switching again
    if (addError.message?.includes('nativeCurrency') || 
        addError.message?.includes('currency symbol')) {
      log('Network exists with different config, attempting direct switch...');
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x89' }],
        });
        log('Successfully switched to existing Polygon network');
        
        if (isHostinger) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        return true;
      } catch (finalError) {
        console.error('Final switch attempt failed:', finalError);
        
        if (isHostinger) {
          throw new Error('Please manually switch to Polygon network in MetaMask.');
        } else {
          throw new Error('Failed to switch to Polygon network');
        }
      }
    }
    
    throw new Error(`Failed to add Polygon network: ${addError.message}`);
  }
}, []);

  // Check and ensure Polygon network BEFORE connection - PRODUCTION OPTIMIZED
  const ensurePolygonNetworkBeforeLogin = useCallback(async () => {
    if (!window.ethereum) {
      return true; // Non-MetaMask wallets handle this internally
    }

    try {
      const currentChainId = await getCurrentNetwork();
      log('Current network before login:', currentChainId);
      
      if (currentChainId === '0x89') {
        log('Already on Polygon network');
        return true;
      }
      
      log('Not on Polygon network, requesting switch...');
      
      // In production, show a user-friendly message first
      if (isProduction()) {
        log('Production mode: Preparing network switch for better compatibility...');
      }
      
      return await switchToPolygon();
      
    } catch (error) {
      console.error('Error ensuring Polygon network:', error);
      
      // In production, provide clearer error messages
      if (isProduction()) {
        if (error.message?.includes('pending')) {
          throw new Error('Please complete the network switch in MetaMask and try connecting again.');
        } else if (error.message?.includes('rejected')) {
          throw new Error('Network switch was cancelled. Please switch to Polygon network manually in MetaMask.');
        } else {
          throw new Error('Unable to switch to Polygon network. Please manually switch to Polygon in MetaMask and try again.');
        }
      }
      
      throw error;
    }
  }, [getCurrentNetwork, switchToPolygon]);

  // Post-login network verification
  const verifyPolygonNetwork = useCallback(async () => {
    if (!window.ethereum) {
      return true; // Non-MetaMask wallets handle this internally
    }

    try {
      const currentChainId = await getCurrentNetwork();
      log('Verifying network after login:', currentChainId);
      
      setCurrentNetwork(currentChainId);
      const onPolygon = currentChainId === '0x89';
      setIsOnPolygon(onPolygon);
      
      if (onPolygon) {
        log('Network verification successful - on Polygon');
        return true;
      }
      
      console.warn('Network verification failed - not on Polygon network');
      log('App will continue, but some features may not work correctly');
      
      // Show network warning but don't block
      const networkNames = {
        '0x1': 'Ethereum',
        '0x38': 'BSC',
        '0xa4b1': 'Arbitrum',
        '0xe708': 'Linea',
        '0x89': 'Polygon'
      };
      
      const currentNetworkName = networkNames[currentChainId] || `Network ${currentChainId}`;
      log(`Currently on ${currentNetworkName}. For best experience, please switch to Polygon.`);
      
      return false;
    } catch (error) {
      console.error('Error verifying network:', error);
      return false;
    }
  }, [getCurrentNetwork]);

  const getAccounts = async (provider) => {
    try {
      log('Getting accounts from provider');
      const { ethers } = await import("ethers");
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      log('Got account address:', address);
      return address;
    } catch (error) {
      console.error("Error getting accounts:", error);
      return null;
    }
  };

  // Load Meda Gas balance from blockchain
  const loadMedaGasBalance = useCallback(async (address, web3Provider) => {
    if (!address || isLoadingData.current) {
      return;
    }

    try {
      setIsLoadingBalance(true);
      isLoadingData.current = true;
      
      log('Loading Meda Gas balance for:', address);
      
      // Initialize token service if not already done
      if (!tokenService.isInitialized() && web3Provider) {
        await tokenService.initialize(web3Provider);
      }
      
      if (tokenService.isInitialized()) {
        const balanceData = await tokenService.getMedaGasBalance(address);
        setMedaGasBalance(balanceData);
        
        // Update user profile with real balance
        if (balanceData && !balanceData.error) {
          userProfileService.updateProfile(address, {
            medaGas: balanceData.balance
          });
          setUserProfile(userProfileService.getProfile(address));
        }
      }
      
    } catch (error) {
      console.error("Error loading Meda Gas balance:", error);
      setMedaGasBalance({
        balance: 0,
        balanceFormatted: '0',
        balanceWei: '0',
        error: error.message
      });
    } finally {
      setIsLoadingBalance(false);
      isLoadingData.current = false;
    }
  }, []);

  // Load NFT holdings from blockchain
  const loadNFTHoldings = useCallback(async (address, web3Provider) => {
    if (!address || isLoadingData.current) {
      return;
    }

    try {
      setIsLoadingNFTs(true);
      
      log('Loading NFT holdings for:', address);
      
      // Initialize NFT service if not already done
      if (!nftService.isInitialized() && web3Provider) {
        await nftService.initialize(web3Provider);
      }
      
      if (nftService.isInitialized()) {
        const nftData = await nftService.getAllNFTs(address);
        setNftHoldings(nftData);
        log('Loaded NFT holdings:', nftData);
      }
      
    } catch (error) {
      console.error("Error loading NFT holdings:", error);
      setNftHoldings({
        heroes: { nfts: [], count: 0, error: error.message },
        weapons: { nfts: [], count: 0, error: error.message },
        lands: { nfts: [], count: 0, error: error.message },
        totalCount: 0
      });
    } finally {
      setIsLoadingNFTs(false);
    }
  }, []);

  // Initialize Web3Auth only once
  useEffect(() => {
    const init = async () => {
      if (isInitialized.current) return;
      
      try {
        isInitialized.current = true;
        log('Initializing Web3Auth...');
        
        const web3auth = new Web3Auth({
          clientId: web3AuthConfig.clientId,
          web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
          chainConfig: web3AuthConfig.chainConfig,
          privateKeyProvider: web3AuthConfig.privateKeyProvider,
        });

        // Only configure MetaMask adapter if MetaMask is detected
        const metamaskInstalled = isMetaMaskInstalled();
        log('MetaMask installation check:', metamaskInstalled);

        if (metamaskInstalled) {
          try {
            log('Configuring MetaMask adapter...');
            
            const metamaskAdapter = new MetamaskAdapter({
              clientId: web3AuthConfig.clientId,
              sessionTime: 3600,
              web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
              chainConfig: web3AuthConfig.chainConfig,
            });

            web3auth.configureAdapter(metamaskAdapter);
            log('MetaMask adapter configured successfully');
          } catch (metamaskError) {
            console.warn('Failed to configure MetaMask adapter:', metamaskError);
          }
        } else {
          log('MetaMask not detected, skipping MetaMask adapter configuration');
        }

        await web3auth.initModal();
        setWeb3auth(web3auth);
        log('Web3Auth initialization completed');

        // Check if user is already logged in
        if (web3auth.connected) {
          log('User already connected, setting up...');
          
          const web3authProvider = web3auth.provider;
          setProvider(web3authProvider);
          
          const user = await web3auth.getUserInfo();
          setUser(user);
          
          if (web3authProvider) {
            // Verify network after reconnection
            await verifyPolygonNetwork();
            
            const address = await getAccounts(web3authProvider);
            setWalletAddress(address);
            
            // Initialize services
            await tokenService.initialize(web3authProvider);
            await nftService.initialize(web3authProvider);
            
            // Load user profile
            const profile = userProfileService.getProfile(address);
            setUserProfile(profile);
            
            // Load data
            await loadMedaGasBalance(address, web3authProvider);
            await loadNFTHoldings(address, web3authProvider);
            
            // Update profile with Web3Auth user info
            if (user && profile) {
              userProfileService.updateProfile(address, {
                email: user.email || profile.email,
                nickname: user.name || profile.nickname,
                avatar: user.profileImage || profile.avatar,
              });
              setUserProfile(userProfileService.getProfile(address));
            }
          }
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      init();
    }, 100);

    return () => clearTimeout(timer);
  }, [loadMedaGasBalance, loadNFTHoldings, verifyPolygonNetwork]);

  // Setup network and account change listeners
  useEffect(() => {
    if (!window.ethereum || !walletAddress) return;

    const handleChainChanged = async (chainId) => {
      log('Network changed to:', chainId);
      
      // Update network status
      setCurrentNetwork(chainId);
      
      // Check if still on Polygon
      const onPolygon = chainId === '0x89';
      setIsOnPolygon(onPolygon);
      
      // Reinitialize services if switched to Polygon
      if (onPolygon && provider && walletAddress) {
        try {
          log('Reinitializing services after network change to Polygon...');
          await tokenService.initialize(provider);
          await nftService.initialize(provider);
          
          // Reload data
          await loadMedaGasBalance(walletAddress, provider);
          await loadNFTHoldings(walletAddress, provider);
        } catch (error) {
          console.error('Error reinitializing after network change:', error);
        }
      }
    };

    const handleAccountsChanged = (accounts) => {
      log('Accounts changed:', accounts);
      
      if (accounts.length === 0) {
        // User disconnected
        log('User disconnected wallet');
        logout();
      } else if (accounts[0] !== walletAddress) {
        // User switched accounts - reload the page for clean state
        log('User switched accounts, reloading page...');
        window.location.reload();
      }
    };

    // Listen for changes
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Cleanup on unmount
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [walletAddress, provider, loadMedaGasBalance, loadNFTHoldings]);

  // Refresh functions
  const refreshNFTHoldings = useCallback(async () => {
    if (walletAddress && provider && !isLoadingData.current) {
      await loadNFTHoldings(walletAddress, provider);
    }
  }, [walletAddress, provider, loadNFTHoldings]);

  const refreshMedaGasBalance = useCallback(async () => {
    if (walletAddress && provider && !isLoadingData.current) {
      await loadMedaGasBalance(walletAddress, provider);
    }
  }, [walletAddress, provider, loadMedaGasBalance]);

  const login = async () => {
  if (!web3auth) {
    console.error("Web3Auth not initialized");
    return;
  }

  const isHostinger = window.location.hostname.includes('cryptomeda.tech') || 
                     window.location.hostname.includes('.hostinger.') ||
                     (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

  try {
    log('Starting login process...');
    log('Environment:', isHostinger ? 'Hostinger/Production' : 'Localhost');
    
    // Check MetaMask availability
    const metamaskAvailable = isMetaMaskInstalled();
    log('MetaMask available for login:', metamaskAvailable);

    // CRITICAL: Ensure Polygon network BEFORE Web3Auth connection
    if (metamaskAvailable) {
      log('MetaMask detected, ensuring Polygon network before login...');
      
      try {
        // On Hostinger, give user a heads up about what's happening
        if (isHostinger) {
          log('Production environment: Preparing network check...');
        }
        
        await ensurePolygonNetworkBeforeLogin();
        log('Network check passed, proceeding with login...');
        
      } catch (networkError) {
        console.error('Network switch failed:', networkError);
        
        // On Hostinger, provide more specific error messages
        if (isHostinger) {
          if (networkError.message?.includes('popup')) {
            throw new Error('MetaMask popup was blocked. Please allow popups for this site, manually switch to Polygon network, and try again.');
          } else if (networkError.message?.includes('processing')) {
            throw new Error('MetaMask is busy. Please complete any pending requests in MetaMask and try again.');
          }
        }
        
        throw networkError;
      }
    }

    // Now connect with Web3Auth
    log('Connecting with Web3Auth...');
    const web3authProvider = await web3auth.connect();
    
    // Save wallet preference for future connections
    if (metamaskAvailable) {
      saveWalletPreference('metamask');
    } else {
      saveWalletPreference('social');
    }
    
    // Verify network after connection (non-blocking)
    if (metamaskAvailable) {
      setTimeout(async () => {
        await verifyPolygonNetwork();
      }, isHostinger ? 2000 : 1000); // Wait longer on Hostinger
    }
    
    setProvider(web3authProvider);
    
    const user = await web3auth.getUserInfo();
    setUser(user);
    
    if (web3authProvider) {
      const address = await getAccounts(web3authProvider);
      setWalletAddress(address);
      
      // Initialize services
      await tokenService.initialize(web3authProvider);
      await nftService.initialize(web3authProvider);
      
      // Load user profile
      const profile = userProfileService.getProfile(address);
      
      // Load data
      await loadMedaGasBalance(address, web3authProvider);
      await loadNFTHoldings(address, web3authProvider);
      
      // Update profile with Web3Auth user info
      if (user) {
        userProfileService.updateProfile(address, {
          email: user.email || profile.email,
          nickname: user.name || profile.nickname,
          avatar: user.profileImage || profile.avatar,
        });
      }
      
      setUserProfile(userProfileService.getProfile(address));
    }
    
    log("Login completed successfully!");
    return { user, provider: web3authProvider };
    
  } catch (error) {
    console.error("Error during login:", error);
    
    // Provide helpful error messages based on environment
    if (error.message?.includes('popup')) {
      throw new Error('MetaMask popup was blocked. Please allow popups for this site and try again.');
    } else if (error.message?.includes('Network switch rejected') || error.message?.includes('rejected')) {
      throw new Error('Please switch to Polygon network in MetaMask to continue.');
    } else if (error.message?.includes('pending') || error.message?.includes('processing')) {
      throw new Error('MetaMask is processing a request. Please complete it and try again.');
    } else if (error.message?.includes('Wallet is not installed') || 
        error.message?.includes('Metamask extension is not installed')) {
      console.log('MetaMask detection failed. Please ensure MetaMask is properly installed and enabled.');
    } else if (error.message?.includes('manually switch')) {
      throw new Error('Please manually switch to Polygon network in MetaMask and try connecting again.');
    }
    
    throw error;
  }
};

  const logout = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }

    try {
      log("Starting logout process...");
      
      // Stop any ongoing data loading
      isLoadingData.current = false;
      
      // Clear wallet preference
      clearWalletPreference();
      
      // Clear state immediately
      setProvider(null);
      setUser(null);
      setWalletAddress(null);
      setUserProfile(null);
      setMedaGasBalance(null);
      setIsLoadingBalance(false);
      setNftHoldings(null);
      setIsLoadingNFTs(false);
      setCurrentNetwork(null);
      setIsOnPolygon(true);
      
      // Reset services
      tokenService.reset();
      nftService.reset();
      
      // Logout from Web3Auth if connected
      if (web3auth.connected) {
        log("Disconnecting from Web3Auth...");
        await web3auth.logout();
        log("Web3Auth logout completed");
      }
      
      log("Logout completed successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
      
      // Force clear state even if logout fails
      setProvider(null);
      setUser(null);
      setWalletAddress(null);
      setUserProfile(null);
      setMedaGasBalance(null);
      setIsLoadingBalance(false);
      setNftHoldings(null);
      setIsLoadingNFTs(false);
      setCurrentNetwork(null);
      setIsOnPolygon(true);
      
      // Reset services
      tokenService.reset();
      nftService.reset();
      
      log("Forced logout completed due to error");
    }
  };

  const getUserInfo = async () => {
    if (!web3auth || !web3auth.connected) {
      return null;
    }

    try {
      const user = await web3auth.getUserInfo();
      return user;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  };

  const getBalance = async () => {
    if (!provider || !walletAddress) return "0";
    
    try {
      const { ethers } = await import("ethers");
      const ethersProvider = new ethers.BrowserProvider(provider);
      const balance = await ethersProvider.getBalance(walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      return "0";
    }
  };

  const updateUserProfile = (updates) => {
    if (walletAddress) {
      const updated = userProfileService.updateProfile(walletAddress, updates);
      setUserProfile(updated);
      return updated;
    }
    return null;
  };

  const addMedaGas = (amount) => {
    if (walletAddress) {
      const updated = userProfileService.addMedaGas(walletAddress, amount);
      setUserProfile(updated);
      return updated;
    }
    return null;
  };

  const value = {
    web3auth,
    provider,
    user,
    walletAddress,
    userProfile,
    medaGasBalance,
    nftHoldings,
    currentNetwork,
    isOnPolygon,
    isLoading,
    isLoadingBalance,
    isLoadingNFTs,
    login,
    logout,
    getUserInfo,
    getBalance,
    updateUserProfile,
    addMedaGas,
    refreshMedaGasBalance,
    refreshNFTHoldings,
    isConnected: !!walletAddress,
    // Network switching functions for manual use
    switchToPolygon,
    getCurrentNetwork,
    verifyPolygonNetwork,
    // Wallet preferences
    getWalletPreference,
    saveWalletPreference,
    clearWalletPreference,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      <Web3AuthErrorBoundary>
        {children}
      </Web3AuthErrorBoundary>
    </Web3AuthContext.Provider>
  );
};

Web3AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};