import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Edit2, Save, X, Calendar, Shield, Sword, MapPin, RefreshCw, Copy, Check, Wallet } from 'lucide-react';
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { RANKS } from '../services/userProfile.service';

const ProfilePage = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    isConnected, 
    walletAddress,
    medaGasBalance, 
    isLoadingBalance, 
    refreshMedaGasBalance,
    nftHoldings,
    isLoadingNFTs,
    refreshNFTHoldings,
    login,
    isLoading
  } = useWeb3Auth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('heroes');
  const [editedProfile, setEditedProfile] = useState({
    nickname: '',
    email: '',
  });
  const [imageErrors, setImageErrors] = useState(new Set());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setEditedProfile({
        nickname: userProfile.nickname || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile]);

  // Enhanced floating particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: i * 0.3,
    duration: 12 + Math.random() * 6,
    size: 1.5 + Math.random() * 2.5,
    left: Math.random() * 100,
    color: i % 4 === 0 ? "#FF8C00" : i % 4 === 1 ? "#60A5FA" : i % 4 === 2 ? "#8B5CF6" : "#22C55E"
  }));

  // Phoenix fire particles
  const fireParticles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    delay: i * 1.2,
    duration: 6 + Math.random() * 3,
    left: 10 + Math.random() * 80,
  }));

  const handleImageError = (heroId) => {
    setImageErrors(prev => new Set([...prev, heroId]));
  };

  // Helper function to determine rarity based on the actual cardTypeSznId from blockchain
  const getHeroRarityFromCardType = (cardTypeSznId) => {
    const cardType = parseInt(cardTypeSznId);
    if (cardType >= 1000 && cardType <= 1999) return 'Collectible';
    if (cardType >= 2000 && cardType <= 2999) return 'Revolution';
    if (cardType >= 3000 && cardType <= 3999) return 'Legacy';
    return 'Unknown'; // For debugging
  };

  if (!isConnected) {
    return (
      <div className="full-screen-section relative overflow-hidden bg-void-primary">
        {/* Enhanced background layers */}
        <div className="absolute inset-0 w-full h-full">
          {/* Starfield background */}
          <div 
            className="absolute inset-0 w-full h-full opacity-40"
            style={{ 
              backgroundImage: `radial-gradient(2px 2px at 20px 30px, #FF8C00, transparent),
                               radial-gradient(2px 2px at 40px 70px, #60A5FA, transparent),
                               radial-gradient(1px 1px at 90px 40px, #8B5CF6, transparent),
                               radial-gradient(1px 1px at 130px 80px, #22C55E, transparent),
                               radial-gradient(2px 2px at 160px 30px, #FF8C00, transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 100px'
            }}
          />
          
          {/* Nebula overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/30 via-transparent to-void-primary/60" />
          <div className="absolute inset-0 bg-gradient-conic from-phoenix-primary/10 via-resistance-primary/10 to-energy-purple/10 opacity-30" />
        </div>

        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 6}px ${particle.color}`,
              }}
              animate={{
                y: ['120vh', '-10vh'],
                x: [0, Math.sin(particle.id * 0.5) * 150],
                opacity: [0, 0.8, 0.8, 0],
                scale: [0.5, 1, 1, 0.3]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Phoenix fire particles */}
          {fireParticles.map(particle => (
            <motion.div
              key={`fire-${particle.id}`}
              className="absolute fire-particle"
              style={{
                left: `${particle.left}%`,
                background: 'linear-gradient(to top, #FF8C00, #FFB84D)',
              }}
              animate={{
                y: ['100vh', '-50px'],
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.2, 1, 0.6]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 min-h-screen w-full pt-16 md:pl-64">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
            <motion.div 
              className="text-center glassmorphism p-8 rounded-xl max-w-md mx-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Shield size={64} className="text-meda-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stellar-white mb-4">Access Restricted</h2>
              <p className="text-gray-400 mb-6">Connect your wallet to access your resistance profile and join the fight against the Swarm.</p>
              {/* Connect Wallet Button - Same style as TopBar */}
              <motion.button 
                onClick={login}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 relative font-orbitron font-bold rounded-lg overflow-hidden px-6 py-3 text-lg w-full"
                style={{
                  background: 'linear-gradient(45deg, rgba(15, 35, 15, 0.95), rgba(34, 197, 94, 0.9))',
                  border: '2px solid rgba(34, 197, 94, 0.9)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.6), inset 0 0 15px rgba(34, 197, 94, 0.1)',
                  opacity: isLoading ? 0.5 : 1
                }}
                whileHover={{ 
                  scale: isLoading ? 1 : 1.05,
                  boxShadow: isLoading ? undefined : "0 0 30px rgba(34, 197, 94, 0.8), inset 0 0 20px rgba(34, 197, 94, 0.15)"
                }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
              >
                {/* Green shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent rounded-lg"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <Wallet size={20} className="relative z-10" />
                
                <span 
                  className="font-bold relative z-10"
                  style={{
                    textShadow: '0 0 10px rgba(74, 222, 128, 0.8)'
                  }}
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="full-screen-section relative overflow-hidden bg-void-primary">
        {/* Enhanced background layers */}
        <div className="absolute inset-0 w-full h-full">
          {/* Starfield background */}
          <div 
            className="absolute inset-0 w-full h-full opacity-40"
            style={{ 
              backgroundImage: `radial-gradient(2px 2px at 20px 30px, #FF8C00, transparent),
                               radial-gradient(2px 2px at 40px 70px, #60A5FA, transparent),
                               radial-gradient(1px 1px at 90px 40px, #8B5CF6, transparent),
                               radial-gradient(1px 1px at 130px 80px, #22C55E, transparent),
                               radial-gradient(2px 2px at 160px 30px, #FF8C00, transparent)`,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 100px'
            }}
          />
          
          {/* Nebula overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/30 via-transparent to-void-primary/60" />
          <div className="absolute inset-0 bg-gradient-conic from-phoenix-primary/10 via-resistance-primary/10 to-energy-purple/10 opacity-30" />
        </div>

        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 6}px ${particle.color}`,
              }}
              animate={{
                y: ['120vh', '-10vh'],
                x: [0, Math.sin(particle.id * 0.5) * 150],
                opacity: [0, 0.8, 0.8, 0],
                scale: [0.5, 1, 1, 0.3]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Phoenix fire particles */}
          {fireParticles.map(particle => (
            <motion.div
              key={`fire-${particle.id}`}
              className="absolute fire-particle"
              style={{
                left: `${particle.left}%`,
                background: 'linear-gradient(to top, #FF8C00, #FFB84D)',
              }}
              animate={{
                y: ['100vh', '-50px'],
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1.2, 1, 0.6]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen w-full pt-16 md:pl-64">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
            <div className="text-center glassmorphism p-8 rounded-xl">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-meda-gold mx-auto mb-4"></div>
              <p className="text-xl text-gray-400">Loading resistance profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateUserProfile(editedProfile);
    setIsEditing(false);
  };

  // Get real or fallback Meda Gas balance
  const getMedaGasDisplay = () => {
    if (isLoadingBalance) {
      return {
        balance: '...',
        isLoading: true
      };
    }
    
    if (medaGasBalance && !medaGasBalance.error) {
      return {
        balance: medaGasBalance.balanceFormatted,
        isLoading: false,
        isReal: true
      };
    }
    
    // Fallback to localStorage value
    return {
      balance: userProfile.medaGas.toLocaleString(),
      isLoading: false,
      isReal: false
    };
  };

  // Get real NFT data
  const getNFTData = () => {
    if (isLoadingNFTs) {
      return {
        heroes: [],
        weapons: [],
        lands: [],
        heroesCount: '...',
        weaponsCount: '...',
        landsCount: '...',
        isLoading: true
      };
    }
    
    if (nftHoldings && !nftHoldings.heroes?.error) {
      return {
        heroes: nftHoldings.heroes.nfts || [],
        weapons: nftHoldings.weapons.nfts || [],
        lands: nftHoldings.lands.nfts || [],
        heroesCount: nftHoldings.heroes.count || 0,
        weaponsCount: nftHoldings.weapons.count || 0,
        landsCount: nftHoldings.lands.count || 0,
        isLoading: false,
        isReal: true
      };
    }
    
    // Return empty arrays if no data
    return {
      heroes: [],
      weapons: [],
      lands: [],
      heroesCount: 0,
      weaponsCount: 0,
      landsCount: 0,
      isLoading: false,
      isReal: false
    };
  };

  const nftData = getNFTData();
  const medaGasDisplay = getMedaGasDisplay();
  const currentRankInfo = RANKS.find(r => r.name === userProfile.rank);
  const nextRankInfo = RANKS.find(r => r.minGas > userProfile.medaGas);
  const progressToNextRank = nextRankInfo 
    ? ((userProfile.medaGas - (currentRankInfo?.minGas || 0)) / (nextRankInfo.minGas - (currentRankInfo?.minGas || 0))) * 100
    : 100;

  const tabs = [
    { id: 'heroes', name: 'NFT Heroes', icon: Shield },
    { id: 'weapons', name: 'NFT Weapons', icon: Sword },
    { id: 'lands', name: 'NFT Lands', icon: MapPin },
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Revolution':
        return 'text-meda-gold border-meda-gold/30 bg-meda-gold/10';
      case 'Legacy':
        return 'text-nebula-pink border-nebula-pink/30 bg-nebula-pink/10';
      case 'Collectible':
        return 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Tier 3':
        return 'text-meda-gold border-meda-gold/30 bg-meda-gold/10';
      case 'Tier 2':
        return 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10';
      case 'Tier 1':
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="full-screen-section relative overflow-hidden bg-void-primary">
      {/* Enhanced background layers */}
      <div className="absolute inset-0 w-full h-full">
        {/* Starfield background */}
        <div 
          className="absolute inset-0 w-full h-full opacity-40"
          style={{ 
            backgroundImage: `radial-gradient(2px 2px at 20px 30px, #FF8C00, transparent),
                             radial-gradient(2px 2px at 40px 70px, #60A5FA, transparent),
                             radial-gradient(1px 1px at 90px 40px, #8B5CF6, transparent),
                             radial-gradient(1px 1px at 130px 80px, #22C55E, transparent),
                             radial-gradient(2px 2px at 160px 30px, #FF8C00, transparent)`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 100px'
          }}
        />
        
        {/* Nebula overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/30 via-transparent to-void-primary/60" />
        <div className="absolute inset-0 bg-gradient-conic from-phoenix-primary/10 via-resistance-primary/10 to-energy-purple/10 opacity-30" />
      </div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 6}px ${particle.color}`,
            }}
            animate={{
              y: ['120vh', '-10vh'],
              x: [0, Math.sin(particle.id * 0.5) * 150],
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.5, 1, 1, 0.3]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Phoenix fire particles */}
        {fireParticles.map(particle => (
          <motion.div
            key={`fire-${particle.id}`}
            className="absolute fire-particle"
            style={{
              left: `${particle.left}%`,
              background: 'linear-gradient(to top, #FF8C00, #FFB84D)',
            }}
            animate={{
              y: ['100vh', '-50px'],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 1, 0.6]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Main content - properly centered accounting for sidebar */}
      <div className="relative z-10 min-h-screen w-full pt-16 md:pl-64">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
          
          {/* Header Section */}
          <motion.div 
            className="glassmorphism rounded-xl p-8 mb-8 w-full"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <motion.div 
                  className="relative mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-32 h-32 rounded-full border-4 border-meda-gold overflow-hidden relative">
                    <img 
                      src={userProfile.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div 
                    className="absolute -bottom-2 -right-2 rounded-full p-3 border-2 border-void-black"
                    style={{ 
                      backgroundColor: currentRankInfo?.color,
                      boxShadow: `0 0 15px ${currentRankInfo?.color}80`
                    }}
                  >
                    <Trophy size={20} className="text-void-black" />
                  </div>
                </motion.div>

                {/* Rank Badge */}
                <motion.div 
                  className="glassmorphism px-4 py-2 rounded-full mb-2"
                  style={{ 
                    border: `2px solid ${currentRankInfo?.color}`,
                    boxShadow: `0 0 10px ${currentRankInfo?.color}40`
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span 
                    className="font-bold text-lg"
                    style={{ color: currentRankInfo?.color }}
                  >
                    {userProfile.rank}
                  </span>
                </motion.div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 text-center lg:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editedProfile.nickname}
                        onChange={(e) => setEditedProfile({ ...editedProfile, nickname: e.target.value })}
                        className="bg-space-blue/50 border border-cosmic-purple/30 rounded-lg px-4 py-3 text-stellar-white text-lg"
                        placeholder="Resistance Codename"
                      />
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="bg-space-blue/50 border border-cosmic-purple/30 rounded-lg px-4 py-3 text-stellar-white text-lg"
                        placeholder="Secure Communications"
                      />
                    </div>
                    <div className="flex gap-3 justify-center lg:justify-start">
                      <motion.button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-6 py-3 bg-energy-green/20 hover:bg-energy-green/30 rounded-lg transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Save size={18} />
                        Save Changes
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedProfile({
                            nickname: userProfile.nickname || '',
                            email: userProfile.email || '',
                          });
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-nebula-pink/20 hover:bg-nebula-pink/30 rounded-lg transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={18} />
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                      <h1 className="text-4xl font-bold text-stellar-white">{userProfile.nickname}</h1>
                      <motion.button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-neon-cyan transition-colors p-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit2 size={20} />
                      </motion.button>
                    </div>
                    
                    {/* Email */}
                    <p className="text-gray-400 mb-2 text-lg">{userProfile.email || 'No secure comm channel set'}</p>
                    
                    {/* Token Address */}
                    <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                      <span className="text-gray-500 text-sm font-mono">
                        Token: {walletAddress ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}` : 'No wallet connected'}
                      </span>
                      {walletAddress && (
                        <motion.button
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="text-gray-400 hover:text-neon-cyan transition-colors p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Copy full token address"
                        >
                          {copied ? (
                            <Check size={14} className="text-energy-green" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </motion.button>
                      )}
                    </div>
                    
                    {/* Resistance Member Since */}
                    <div className="flex items-center gap-2 text-gray-400 justify-center lg:justify-start mb-6">
                      <Calendar size={16} />
                      <span>Resistance Member Since {new Date(userProfile.joinDate).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Key Stats Row - Updated with new categories */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="glassmorphism p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Zap size={24} className="text-energy-green" />
                          {medaGasDisplay.isReal && !medaGasDisplay.isLoading && (
                            <motion.button
                              onClick={refreshMedaGasBalance}
                              className="text-gray-400 hover:text-energy-green transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Refresh balance"
                            >
                              <RefreshCw size={16} />
                            </motion.button>
                          )}
                        </div>
                        <div className={`text-2xl font-bold ${medaGasDisplay.isLoading ? 'text-gray-400' : 'text-energy-green'}`}>
                          {medaGasDisplay.balance}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                          Meda Gas
                          {medaGasDisplay.isReal && !medaGasDisplay.isLoading && (
                            <div className="w-2 h-2 bg-energy-green rounded-full" title="Live blockchain data" />
                          )}
                          {!medaGasDisplay.isReal && !medaGasDisplay.isLoading && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Cached data" />
                          )}
                        </div>
                        {medaGasBalance?.error && (
                          <div className="text-xs text-red-400 mt-1">
                            Connection error
                          </div>
                        )}
                      </div>
                      <div className="glassmorphism p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Shield size={24} className="text-meda-gold" />
                          {nftData.isReal && !nftData.isLoading && (
                            <motion.button
                              onClick={refreshNFTHoldings}
                              className="text-gray-400 hover:text-meda-gold transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Refresh NFTs"
                            >
                              <RefreshCw size={16} />
                            </motion.button>
                          )}
                        </div>
                        <div className={`text-2xl font-bold ${nftData.isLoading ? 'text-gray-400' : 'text-meda-gold'}`}>
                          {nftData.heroesCount}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                          Heroes
                          {nftData.isReal && !nftData.isLoading && (
                            <div className="w-2 h-2 bg-meda-gold rounded-full" title="Live blockchain data" />
                          )}
                          {!nftData.isReal && !nftData.isLoading && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Mock data" />
                          )}
                        </div>
                      </div>
                      <div className="glassmorphism p-4 rounded-lg text-center">
                        <Sword size={24} className="text-neon-cyan mx-auto mb-2" />
                        <div className={`text-2xl font-bold ${nftData.isLoading ? 'text-gray-400' : 'text-neon-cyan'}`}>
                          {nftData.weaponsCount}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                          Weapons
                          {nftData.isReal && !nftData.isLoading && (
                            <div className="w-2 h-2 bg-neon-cyan rounded-full" title="Live blockchain data" />
                          )}
                          {!nftData.isReal && !nftData.isLoading && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Mock data" />
                          )}
                        </div>
                      </div>
                      <div className="glassmorphism p-4 rounded-lg text-center">
                        <MapPin size={24} className="text-nebula-pink mx-auto mb-2" />
                        <div className={`text-2xl font-bold ${nftData.isLoading ? 'text-gray-400' : 'text-nebula-pink'}`}>
                          {nftData.landsCount}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                          Lands
                          {nftData.isReal && !nftData.isLoading && (
                            <div className="w-2 h-2 bg-nebula-pink rounded-full" title="Live blockchain data" />
                          )}
                          {!nftData.isReal && !nftData.isLoading && (
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Mock data" />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rank Progress Bar */}
            {!isEditing && nextRankInfo && (
              <motion.div 
                className="mt-8 p-6 glassmorphism rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 font-medium">Advancement to {nextRankInfo.name}</span>
                  <span className="text-gray-400">
                    {userProfile.medaGas.toLocaleString()} / {nextRankInfo.minGas.toLocaleString()} Meda Gas
                  </span>
                </div>
                <div className="w-full bg-space-blue/50 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-meda-gold via-neon-cyan to-energy-green relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressToNextRank, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                  </motion.div>
                </div>
                <div className="text-right mt-2">
                  <span className="text-sm text-meda-gold font-medium">
                    {Math.round(progressToNextRank)}% Complete
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Tab Navigation */}
          <motion.div 
            className="glassmorphism rounded-2xl p-6 mb-8 w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-stellar-white mb-6 text-center font-orbitron">
              Resistance Arsenal
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border-meda-gold bg-meda-gold/10 shadow-phoenix-md'
                        : 'border-cosmic-purple/30 bg-space-blue/20 hover:border-meda-gold/50 hover:bg-meda-gold/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background glow effect */}
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-meda-gold/20 via-meda-gold/10 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    <div className="relative flex flex-col items-center text-center">
                      <div className={`p-4 rounded-full mb-3 transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-meda-gold/20 text-meda-gold' 
                          : 'bg-cosmic-purple/20 text-gray-400'
                      }`}>
                        <Icon size={32} />
                      </div>
                      
                      <h3 className={`font-bold text-lg mb-2 transition-colors ${
                        activeTab === tab.id ? 'text-meda-gold' : 'text-stellar-white'
                      }`}>
                        {tab.name}
                      </h3>
                      
                      <div className={`text-sm transition-colors ${
                        activeTab === tab.id ? 'text-meda-gold/80' : 'text-gray-400'
                      }`}>
                        {tab.id === 'heroes' && `${nftData.heroesCount} Heroes`}
                        {tab.id === 'weapons' && `${nftData.weaponsCount} Weapons`}
                        {tab.id === 'lands' && `${nftData.landsCount} Lands`}
                      </div>
                      
                      {/* Active indicator */}
                      {activeTab === tab.id && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 w-12 h-1 bg-meda-gold rounded-full"
                          initial={{ scaleX: 0, x: '-50%' }}
                          animate={{ scaleX: 1, x: '-50%' }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content - centered */}
          <div className="w-full max-w-5xl">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'heroes' && (
                <div className="glassmorphism rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">NFT Heroes</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400">
                        {nftData.isLoading ? '...' : `${nftData.heroesCount} Heroes`}
                      </div>
                      {nftData.isReal && !nftData.isLoading && (
                        <motion.button
                          onClick={refreshNFTHoldings}
                          className="text-gray-400 hover:text-meda-gold transition-colors p-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Refresh Heroes"
                        >
                          <RefreshCw size={20} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {nftData.isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-meda-gold mx-auto mb-4"></div>
                      <p className="text-xl text-gray-400">Loading Heroes from blockchain...</p>
                    </div>
                  ) : nftData.heroes.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {nftData.heroes.map((hero) => {
                      const heroKey = hero.id || hero.tokenId;
                      const hasImageError = imageErrors.has(heroKey);
                      const shouldShowImage = hero.image && !hasImageError;
                      
                      // Use the cardTypeSznId from the NFT service (already fetched from blockchain)
                      const cardTypeSznId = hero.cardTypeSznId || 'Unknown';
                      const heroRarity = hero.cardTypeSznId ? getHeroRarityFromCardType(hero.cardTypeSznId) : 'Unknown';
                      
                      const totalPower = hero.attributes 
                        ? hero.attributes.security + hero.attributes.anonymity + hero.attributes.innovation
                        : hero.power || 0;
                      
                      return (
                        <motion.div
                          key={heroKey}
                          className="bg-space-blue/30 rounded-xl border border-cosmic-purple/30 overflow-hidden"
                          whileHover={{ scale: 1.02, borderColor: 'rgba(255, 182, 30, 0.5)' }}
                        >
                          {/* Hero Image - Full Display */}
                          <div className="aspect-[637/1000] bg-gradient-to-br from-cosmic-purple to-space-blue flex items-center justify-center overflow-hidden">
                            {shouldShowImage ? (
                              <img 
                                src={hero.image} 
                                alt={`Hero ${hero.tokenId}`}
                                className="w-full h-full object-contain"
                                onError={() => handleImageError(heroKey)}
                              />
                            ) : (
                              <Shield size={48} className="text-meda-gold" />
                            )}
                          </div>
                          
                          {/* Hero Info Below Image */}
                          <div className="p-4 space-y-4">
                            
                            {/* Power - Same style as weapons (WITH ICON) */}
                            <div className="text-center mb-4">
                              <motion.div 
                                className="inline-flex items-center gap-2 glassmorphism px-6 py-3 rounded-xl border border-energy-green/40"
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                              >
                                <Zap size={20} className="text-energy-green" />
                                <span className="text-2xl font-bold text-energy-green font-orbitron">
                                  Power {totalPower}
                                </span>
                              </motion.div>
                            </div>
                            
                            {/* Attributes - Enhanced with label and better spacing */}
                            {hero.attributes && (
                              <div className="mb-4">
                                <div className="text-center mb-3">
                                  <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    Attributes
                                  </span>
                                </div>
                                <div className="flex justify-center gap-2">
                                  <motion.div 
                                    className="relative glassmorphism px-4 py-3 rounded-lg border border-blue-400/30 text-center min-w-[60px]"
                                    whileHover={{ scale: 1.05, borderColor: 'rgba(96, 165, 250, 0.6)' }}
                                    title="Security"
                                  >
                                    <div className="text-xl font-bold text-blue-400">{hero.attributes.security}</div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
                                    </div>
                                  </motion.div>
                                  <motion.div 
                                    className="relative glassmorphism px-4 py-3 rounded-lg border border-purple-400/30 text-center min-w-[60px]"
                                    whileHover={{ scale: 1.05, borderColor: 'rgba(167, 139, 250, 0.6)' }}
                                    title="Anonymity"
                                  >
                                    <div className="text-xl font-bold text-purple-400">{hero.attributes.anonymity}</div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
                                    </div>
                                  </motion.div>
                                  <motion.div 
                                    className="relative glassmorphism px-4 py-3 rounded-lg border border-cyan-400/30 text-center min-w-[60px]"
                                    whileHover={{ scale: 1.05, borderColor: 'rgba(34, 211, 238, 0.6)' }}
                                    title="Innovation"
                                  >
                                    <div className="text-xl font-bold text-cyan-400">{hero.attributes.innovation}</div>
                                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                      <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-60"></div>
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            )}
                            
                            {/* Bottom Row - Enhanced with better spacing and styling (NO CARD TYPE) */}
                            <div className="flex justify-between items-center">
                              <motion.span 
                                className={`text-sm px-3 py-1.5 rounded-full border font-medium ${getRarityColor(heroRarity)}`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {heroRarity}
                              </motion.span>
                              <div className="text-right">
                                <span className="text-sm text-gray-400 font-mono">
                                  Token ID #{hero.tokenId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield size={64} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No heroes detected</p>
                      <p className="text-sm text-gray-500">
                        Your wallet does not contain any Hero NFTs from the resistance collection
                      </p>
                      {nftHoldings?.heroes?.error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-400 text-sm">Error loading Heroes: {nftHoldings.heroes.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'weapons' && (
                <div className="glassmorphism rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">NFT Weapons</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400">
                        {nftData.isLoading ? '...' : `${nftData.weaponsCount} Weapons`}
                      </div>
                      {nftData.isReal && !nftData.isLoading && (
                        <motion.button
                          onClick={refreshNFTHoldings}
                          className="text-gray-400 hover:text-neon-cyan transition-colors p-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Refresh Weapons"
                        >
                          <RefreshCw size={20} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {nftData.isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan mx-auto mb-4"></div>
                      <p className="text-xl text-gray-400">Loading Weapons from blockchain...</p>
                    </div>
                  ) : nftData.weapons.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {nftData.weapons.map((weapon) => {
                        const totalPower = weapon.attributes 
                          ? weapon.attributes.attribute1 + weapon.attributes.attribute2 + weapon.attributes.attribute3
                          : weapon.power || 0;
                        
                        return (
                          <motion.div
                            key={weapon.id || weapon.tokenId}
                            className="bg-space-blue/30 rounded-xl border border-cosmic-purple/30 overflow-hidden"
                            whileHover={{ scale: 1.02, borderColor: 'rgba(255, 182, 30, 0.5)' }}
                          >
                            {/* Weapon Image/Video - Full Display */}
                            <div className="aspect-[637/1000] bg-gradient-to-br from-cosmic-purple to-space-blue flex items-center justify-center overflow-hidden">
                              {weapon.video ? (
                                <video 
                                  src={weapon.video} 
                                  autoPlay
                                  loop
                                  muted
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    // Fallback to icon if video fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className="w-full h-full flex items-center justify-center"
                                style={{ display: weapon.video ? 'none' : 'flex' }}
                              >
                                <Sword size={48} className="text-neon-cyan" />
                              </div>
                            </div>
                            
                            {/* Weapon Info Below Image */}
                            <div className="p-4 space-y-4">
                              
                              {/* Power - Top Center with enhanced styling */}
                              <div className="text-center mb-4">
                                <motion.div 
                                  className="inline-flex items-center gap-2 glassmorphism px-6 py-3 rounded-xl border border-energy-green/40"
                                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                                >
                                  <Zap size={20} className="text-energy-green" />
                                  <span className="text-2xl font-bold text-energy-green font-orbitron">
                                    Power {totalPower}
                                  </span>
                                </motion.div>
                              </div>
                              
                              {/* Attributes - Enhanced with label and better spacing */}
                              {weapon.attributes && (
                                <div className="mb-4">
                                  <div className="text-center mb-3">
                                    <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                                      Attributes
                                    </span>
                                  </div>
                                  <div className="flex justify-center gap-2">
                                    <motion.div 
                                      className="relative glassmorphism px-4 py-3 rounded-lg border border-red-400/30 text-center min-w-[60px]"
                                      whileHover={{ scale: 1.05, borderColor: 'rgba(239, 68, 68, 0.6)' }}
                                      title="Attribute 1"
                                    >
                                      <div className="text-xl font-bold text-red-400">{weapon.attributes.attribute1}</div>
                                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                        <div className="w-2 h-2 bg-red-400 rounded-full opacity-60"></div>
                                      </div>
                                    </motion.div>
                                    <motion.div 
                                      className="relative glassmorphism px-4 py-3 rounded-lg border border-orange-400/30 text-center min-w-[60px]"
                                      whileHover={{ scale: 1.05, borderColor: 'rgba(251, 146, 60, 0.6)' }}
                                      title="Attribute 2"
                                    >
                                      <div className="text-xl font-bold text-orange-400">{weapon.attributes.attribute2}</div>
                                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
                                      </div>
                                    </motion.div>
                                    <motion.div 
                                      className="relative glassmorphism px-4 py-3 rounded-lg border border-yellow-400/30 text-center min-w-[60px]"
                                      whileHover={{ scale: 1.05, borderColor: 'rgba(250, 204, 21, 0.6)' }}
                                      title="Attribute 3"
                                    >
                                      <div className="text-xl font-bold text-yellow-400">{weapon.attributes.attribute3}</div>
                                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
                                      </div>
                                    </motion.div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Bottom Row - Enhanced with better spacing and styling */}
                              <div className="flex justify-between items-center">
                                <motion.span 
                                  className={`text-sm px-3 py-1.5 rounded-full border font-medium ${getTierColor(weapon.tier)}`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {weapon.tier}
                                </motion.span>
                                <div className="text-right">
                                  <span className="text-sm text-gray-400 font-mono">
                                    Token ID #{weapon.tokenId}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Sword size={64} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No weapons detected</p>
                      <p className="text-sm text-gray-500">
                        Your wallet does not contain any Weapon NFTs from the resistance collection
                      </p>
                      {nftHoldings?.weapons?.error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-400 text-sm">Error loading Weapons: {nftHoldings.weapons.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'lands' && (
                <div className="glassmorphism rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">NFT Lands</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400">
                        {nftData.isLoading ? '...' : `${nftData.landsCount} Territories`}
                      </div>
                      {nftData.isReal && !nftData.isLoading && (
                        <motion.button
                          onClick={refreshNFTHoldings}
                          className="text-gray-400 hover:text-nebula-pink transition-colors p-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Refresh Lands"
                        >
                          <RefreshCw size={20} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {nftData.isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-nebula-pink mx-auto mb-4"></div>
                      <p className="text-xl text-gray-400">Loading Lands from blockchain...</p>
                    </div>
                  ) : nftData.lands.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {nftData.lands.map((land) => {
                        // Calculate power based on rarity
                        let landPower = 100; // Default for Common
                        if (land.rarity === 'Rare') landPower = 300;
                        if (land.rarity === 'Legendary') landPower = 700;
                        
                        return (
                          <motion.div
                            key={land.id || land.tokenId}
                            className="bg-space-blue/30 rounded-xl border border-cosmic-purple/30 overflow-hidden"
                            whileHover={{ scale: 1.02, borderColor: 'rgba(255, 182, 30, 0.5)' }}
                          >
                            {/* Land Image - Full Display */}
                            <div className="aspect-[1909/2664] bg-gradient-to-br from-cosmic-purple to-space-blue flex items-center justify-center overflow-hidden">
                              {land.image ? (
                                <img 
                                  src={land.image} 
                                  alt={land.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <MapPin 
                                size={48} 
                                className="text-nebula-pink"
                                style={{ display: land.image ? 'none' : 'block' }}
                              />
                            </div>
                            
                            {/* Land Info Below Image */}
                            <div className="p-4 space-y-4">
                              
                              {/* Power - Top Center with enhanced styling */}
                              <div className="text-center mb-4">
                                <motion.div 
                                  className="inline-flex items-center gap-2 glassmorphism px-6 py-3 rounded-xl border border-energy-green/40"
                                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                                >
                                  <Zap size={20} className="text-energy-green" />
                                  <span className="text-2xl font-bold text-energy-green font-orbitron">
                                    Power {landPower}
                                  </span>
                                </motion.div>
                              </div>
                              
                              {/* Bottom Row - Enhanced with better spacing and styling */}
                              <div className="flex justify-between items-center">
                                <motion.span 
                                  className={`text-sm px-3 py-1.5 rounded-full border font-medium ${getRarityColor(land.rarity)}`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {land.rarity}
                                </motion.span>
                                <div className="text-right">
                                  <span className="text-sm text-gray-400">
                                    Land tickets: {land.balance || 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin size={64} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No territories detected</p>
                      <p className="text-sm text-gray-500">
                        Your wallet does not contain any Land NFTs from the resistance collection
                      </p>
                      {nftHoldings?.lands?.error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-400 text-sm">Error loading Lands: {nftHoldings.lands.error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;