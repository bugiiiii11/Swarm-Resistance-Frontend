import { useState, useEffect, useCallback, useRef } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { web3AuthConfig } from '../config/web3auth.config.js';
import { userProfileService } from '../services/userProfile.service.js';
import { tokenService } from '../services/tokenService.js';
import { nftService } from '../services/nftService.js';
import { Web3AuthContext } from './Web3AuthContext.js';
import PropTypes from 'prop-types';
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

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

  // Use refs to track initialization status and prevent multiple calls
  const isInitialized = useRef(false);
  const isLoadingData = useRef(false);

  const getAccounts = async (provider) => {
    try {
      const { ethers } = await import("ethers");
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
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
      
      // Initialize NFT service if not already done
      if (!nftService.isInitialized() && web3Provider) {
        await nftService.initialize(web3Provider);
      }
      
      if (nftService.isInitialized()) {
        const nftData = await nftService.getAllNFTs(address);
        setNftHoldings(nftData);
        console.log('Loaded NFT holdings:', nftData);
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
        
        const web3auth = new Web3Auth({
          clientId: web3AuthConfig.clientId,
          web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
          chainConfig: web3AuthConfig.chainConfig,
          privateKeyProvider: web3AuthConfig.privateKeyProvider,
        });

        // Configure MetaMask Adapter
        const metamaskAdapter = new MetamaskAdapter({
          clientId: web3AuthConfig.clientId,
          sessionTime: 3600,
          web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
          chainConfig: web3AuthConfig.chainConfig,
        });

        web3auth.configureAdapter(metamaskAdapter);
        await web3auth.initModal();
        setWeb3auth(web3auth);

        // Check if user is already logged in
        if (web3auth.connected) {
          const web3authProvider = web3auth.provider;
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

    init();
  }, [loadMedaGasBalance, loadNFTHoldings]);

  // Refresh functions with current provider and address
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

    try {
      const web3authProvider = await web3auth.connect();
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
      
      console.log("Logged in successfully!");
      return { user, provider: web3authProvider };
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }

    try {
      console.log("Starting logout process...");
      
      // Stop any ongoing data loading
      isLoadingData.current = false;
      
      // Clear state immediately
      setProvider(null);
      setUser(null);
      setWalletAddress(null);
      setUserProfile(null);
      setMedaGasBalance(null);
      setIsLoadingBalance(false);
      setNftHoldings(null);
      setIsLoadingNFTs(false);
      
      // Reset services
      tokenService.reset();
      nftService.reset();
      
      // Logout from Web3Auth if connected
      if (web3auth.connected) {
        console.log("Disconnecting from Web3Auth...");
        await web3auth.logout();
        console.log("Web3Auth logout completed");
      }
      
      console.log("Logout completed successfully!");
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
      
      // Reset services
      tokenService.reset();
      nftService.reset();
      
      // Don't throw the error, just log it
      console.log("Forced logout completed due to error");
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
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
};

Web3AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};