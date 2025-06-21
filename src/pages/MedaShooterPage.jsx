import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useTransform as useMotionTransform, animate } from 'framer-motion';
import { Zap, Target, Crosshair, Award, Trophy, Star, X, Play } from 'lucide-react';
// Note: You'll need to install react-unity-webgl: npm install react-unity-webgl
import Unity, { UnityContext } from 'react-unity-webgl';
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { medaShooterService } from '../services/medaShooterService';

const MedaShooterPage = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Web3Auth context - using your new frontend's context
  const { walletAddress, login, isConnected, isLoading: web3Loading } = useWeb3Auth();
  
  // Game modal state
  const [showGameModal, setShowGameModal] = useState(false);
  const [gameError, setGameError] = useState(null);
  
  // Unity WebGL state
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [unityLoadingProgress, setUnityLoadingProgress] = useState(0);
  const [walletAddressSent, setWalletAddressSent] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerScore, setPlayerScore] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Unity configuration - paths relative to your new frontend's public folder
  const unityContext = useMemo(() => new UnityContext({
    loaderUrl: "/unity-builds/medashooter/Build/medashooter.loader.js",
    dataUrl: "/unity-builds/medashooter/Build/medashooter.data.gz", 
    frameworkUrl: "/unity-builds/medashooter/Build/medashooter.framework.js.gz",
    codeUrl: "/unity-builds/medashooter/Build/medashooter.wasm.gz",
    companyName: "Cryptomeda",
    productName: "Meda Shooter",
    productVersion: "1.0",
  }), []);

  // State for animated counter
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useMotionTransform(count, (latest) => Math.round(latest));

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load leaderboard on component mount and when wallet connects
  useEffect(() => {
    loadLeaderboard();
  }, [walletAddress]);

  // Unity event listeners
  useEffect(() => {
    const handleProgress = (progress) => {
      setUnityLoadingProgress(Math.round(progress * 100));
    };

    const handleLoaded = () => {
      setUnityLoaded(true);
      console.log("🎮 Unity WebGL loaded successfully");
    };

    const handleReadyForWallet = () => {
      console.log("🎮 Unity ready to receive wallet address");
      setUnityLoaded(true);
      // Send wallet address when Unity is ready
      if (walletAddress && !walletAddressSent) {
        console.log("📧 Sending wallet address to Unity:", walletAddress);
        unityContext.send('JavascriptHook', 'SetWalletAddress', walletAddress);
        setWalletAddressSent(true);
      }
    };

    const handleGameOver = async (scoreData) => {
      console.log("🎮 Game Over received from Unity", scoreData);
      setGameStarted(false);
      
      // Refresh leaderboard after game over
      await loadLeaderboard();
      
      // Optional: Show score notification
      if (playerScore && scoreData && scoreData.score > playerScore.score) {
        console.log("🎉 New personal best!");
      }
    };

    // Add event listeners
    unityContext.on('progress', handleProgress);
    unityContext.on('loaded', handleLoaded);
    unityContext.on('ReadyToWalletAddress', handleReadyForWallet);
    unityContext.on('GameOver', handleGameOver);

    return () => {
      unityContext.removeAllEventListeners();
    };
  }, [unityContext, walletAddress, walletAddressSent, playerScore]);

  // Send wallet address when Unity is ready (inspired by old game-wrapper.tsx logic)
  useEffect(() => {
    if (unityLoaded && walletAddress && !walletAddressSent) {
      console.log("📧 Sending wallet address to Unity:", walletAddress);
      unityContext.send('JavascriptHook', 'SetWalletAddress', walletAddress);
      setWalletAddressSent(true);
    }
  }, [unityLoaded, walletAddress, walletAddressSent, unityContext]);

  // Animate counter when component loads
  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        const controls = animate(count, 87, {
          duration: 2,
          ease: "easeOut",
          delay: 2
        });
        setHasAnimated(true);
        return controls.stop;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [count, hasAnimated]);

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const leaderboardData = await medaShooterService.getLeaderboard(10, walletAddress);
      
      setLeaderboard(leaderboardData.scoreboard || []);
      setPlayerScore(leaderboardData.user_score || null);
      
    } catch (error) {
      console.error('❌ Failed to load leaderboard:', error);
      // Keep existing data on error
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // Handle Deploy button click
  const handleDeployClick = async () => {
    if (!isConnected) {
      try {
        await login();
      } catch (error) {
        console.error('❌ Failed to connect wallet:', error);
        setGameError('Failed to connect wallet. Please try again.');
        return;
      }
    }

    // Validate player before opening game
    try {
      setGameError(null);
      const validation = await medaShooterService.validatePlayer(walletAddress);
      
      if (validation.valid) {
        setShowGameModal(true);
        setGameStarted(true);
      }
    } catch (error) {
      console.error('❌ Player validation failed:', error);
      setGameError(error.message || 'Unable to start game. Please try again.');
    }
  };

  // Close game modal
  const closeGameModal = () => {
    setShowGameModal(false);
    setGameStarted(false);
    setUnityLoaded(false);
    setWalletAddressSent(false);
    setUnityLoadingProgress(0);
    
    // Reset Unity context
    try {
      unityContext.removeAllEventListeners();
    } catch (error) {
      console.error('Error cleaning up Unity:', error);
    }
  };
  
  // Enhanced parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const particlesY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Enhanced floating particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: i * 0.2,
    duration: 8 + Math.random() * 4,
    size: 2 + Math.random() * 3,
    left: Math.random() * 100,
    color: i % 4 === 0 ? "#FF8C00" : i % 4 === 1 ? "#60A5FA" : i % 4 === 2 ? "#8B5CF6" : "#22C55E"
  }));

  // Phoenix fire particles
  const fireParticles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    delay: i * 0.8,
    duration: 5 + Math.random() * 3,
    left: 10 + Math.random() * 80,
  }));

  // Shooter/gaming related icons
  const shooterIcons = [
    { icon: Target, color: "#FF8C00", delay: 0 },
    { icon: Crosshair, color: "#60A5FA", delay: 0.5 },
    { icon: Zap, color: "#22C55E", delay: 1 },
    { icon: Award, color: "#8B5CF6", delay: 1.5 },
    { icon: Trophy, color: "#FB923C", delay: 2 },
    { icon: Star, color: "#FFB84D", delay: 2.5 }
  ];

  return (
    <div className="full-screen-section relative overflow-hidden bg-void-primary" ref={sectionRef}>
      {/* Enhanced background layers */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: backgroundY }}
      >
        {/* Starfield background */}
        <motion.div 
          className="absolute inset-0 w-full h-full opacity-40"
          style={{ 
            backgroundImage: `radial-gradient(2px 2px at 20px 30px, #FF8C00, transparent),
                             radial-gradient(2px 2px at 40px 70px, #60A5FA, transparent),
                             radial-gradient(1px 1px at 90px 40px, #8B5CF6, transparent),
                             radial-gradient(1px 1px at 130px 80px, #22C55E, transparent),
                             radial-gradient(2px 2px at 160px 30px, #FF8C00, transparent)`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 100px',
            y: starsY
          }}
        />
        
        {/* Nebula overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/30 via-transparent to-void-primary/60" />
        <div className="absolute inset-0 bg-gradient-conic from-phoenix-primary/10 via-resistance-primary/10 to-energy-purple/10 opacity-30" />
      </motion.div>

      {/* Enhanced floating particles */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: particlesY }}
      >
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
              x: [0, Math.sin(particle.id * 0.5) * 100],
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
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen w-full pt-16 md:pl-64">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
          
          {/* Title and subtitle section */}
          <motion.div 
            className="text-center mb-6 pt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-3 text-phoenix-primary relative inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Meda Shooter
            </motion.h2>
            
            <motion.p 
              className="mt-2 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-phoenix-light/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Meda Shooter is an ancient training program to test shooting skills and reflexes where the hero fights endless amounts of Swarm enemies. Deploy hero artifacts and legendary weapons to increase your edge in the game.
            </motion.p>
            
            {/* Action Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              {gameError && (
                <motion.div 
                  className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {gameError}
                </motion.div>
              )}
              
              <motion.button
                className={`px-8 py-4 text-xl font-orbitron font-bold rounded-lg transition-all duration-300 ${
                  !isConnected || web3Loading 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'btn-phoenix-primary hover:shadow-lg'
                }`}
                whileHover={isConnected && !web3Loading ? { 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(255, 140, 0, 0.6)"
                } : {}}
                whileTap={isConnected && !web3Loading ? { scale: 0.95 } : {}}
                onClick={handleDeployClick}
                disabled={web3Loading}
              >
                <div className="flex items-center space-x-2">
                  <Play size={24} />
                  <span>
                    {web3Loading ? 'CONNECTING...' : 
                     !isConnected ? 'CONNECT WALLET TO DEPLOY' : 
                     'DEPLOY'}
                  </span>
                </div>
              </motion.button>
              
              {!isConnected && (
                <p className="mt-2 text-sm text-gray-400">
                  Connect your wallet to access your NFTs and play the game
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* Central construction animation */}
          <motion.div
            className="relative mb-16 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* Central hub - Target as main icon */}
            <div className="relative w-32 h-32 glass-phoenix rounded-full flex items-center justify-center animate-pulse-phoenix">
              <motion.div
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target size={48} className="text-phoenix-primary" />
              </motion.div>
            </div>

            {/* Orbiting shooter icons */}
            {shooterIcons.map((item, index) => {
              const Icon = item.icon;
              const angle = (index * 360) / shooterIcons.length;
              
              return (
                <motion.div
                  key={index}
                  className="absolute w-12 h-12 glass-resistance rounded-lg flex items-center justify-center"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-24px',
                    marginTop: '-24px',
                  }}
                  animate={{
                    rotate: [angle, angle + 360],
                    x: [0, Math.cos((angle * Math.PI) / 180) * 80],
                    y: [0, Math.sin((angle * Math.PI) / 180) * 80],
                  }}
                  transition={{
                    duration: 6,
                    delay: item.delay,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Icon size={24} style={{ color: item.color }} />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Progress indicators */}
          <motion.div 
            className="space-y-8 mb-16 w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {/* Main progress bar */}
            <div className="glass-void rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-orbitron font-bold text-phoenix-primary">
                  Game Development Status
                </h3>
                <span className="text-phoenix-light font-mono">
                  <motion.span>{rounded}</motion.span>%
                </span>
              </div>
              <div className="w-full bg-void-secondary rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-phoenix-primary to-phoenix-light"
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ duration: 2, delay: 2 }}
                />
              </div>
            </div>

            {/* Feature status */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Game Integration", status: "Complete", color: "text-success-green" },
                { name: "NFT Integration", status: "Complete", color: "text-success-green" },
                { name: "In-Game Boosts", status: "Testing", color: "text-phoenix-primary" },
                { name: "Meda Gas Utility", status: "Development", color: "text-warning-orange" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="glass-void rounded-lg p-4"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 2.5 + index * 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{feature.name}</span>
                    <span className={`${feature.color} font-semibold text-sm`}>
                      {feature.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard - Updated with live data */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
          >
            <div className="glass-phoenix rounded-2xl p-8 md:p-12 relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-phoenix-primary/10 via-resistance-light/5 to-energy-purple/10" />
              
              <div className="relative">
                <motion.h3 
                  className="text-2xl md:text-3xl font-bold text-stellar-white mb-4 font-orbitron"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(255, 140, 0, 0.7)",
                      "0 0 40px rgba(255, 140, 0, 0.9)",
                      "0 0 20px rgba(255, 140, 0, 0.7)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Leaderboard
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.2 }}
                >
                  Players will be able to collect up to 10,000 Meda Gas daily. Currently in the testing phase, 
                  the Meda Gas rewards will be available soon.
                </motion.p>

                {/* Player's Personal Score */}
                {playerScore && (
                  <motion.div 
                    className="mb-6 p-4 glass-void rounded-lg border border-phoenix-primary/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.5 }}
                  >
                    <h4 className="text-phoenix-primary font-orbitron font-bold mb-2">Your Best Score</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Rank #{playerScore.rank}</span>
                      <span className="text-2xl font-bold text-success-green font-mono">
                        {playerScore.score.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                )}
                
                                  {/* Leaderboard Table */}
                <div className="glass-void rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 p-4 border-b border-phoenix-primary/20 bg-phoenix-primary/10">
                    <div className="text-left font-orbitron font-bold text-phoenix-primary">Rank</div>
                    <div className="text-left font-orbitron font-bold text-phoenix-primary">Player</div>
                    <div className="text-right font-orbitron font-bold text-phoenix-primary">Score</div>
                  </div>
                  
                  {loadingLeaderboard ? (
                    <div className="p-8 text-center">
                      <div className="animate-pulse text-phoenix-primary">Loading leaderboard...</div>
                    </div>
                  ) : leaderboard.length > 0 ? (
                    leaderboard.map((player, index) => (
                      <motion.div
                        key={index}
                        className={`grid grid-cols-3 gap-4 p-4 border-b border-gray-700/30 hover:bg-phoenix-primary/5 transition-colors ${
                          walletAddress && player.address.toLowerCase() === walletAddress.toLowerCase() 
                            ? 'bg-phoenix-primary/10 border-phoenix-primary/30' 
                            : ''
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 3.5 + index * 0.1 }}
                      >
                        <div className="text-left">
                          <span className={`font-mono font-bold ${
                            player.rank <= 3 ? 'text-phoenix-primary' : 'text-gray-300'
                          }`}>
                            #{player.rank}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-gray-300 font-mono text-sm">
                            {player.address.slice(0, 6)}...{player.address.slice(-4)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-success-green font-mono font-bold">
                            {player.score.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    // Fallback to placeholder data when no real scores
                    [
                      { rank: 1, score: "10,000" },
                      { rank: 2, score: "9,000" },
                      { rank: 3, score: "8,000" },
                      { rank: 4, score: "7,000" },
                      { rank: 5, score: "6,000" },
                      { rank: 6, score: "5,000" },
                      { rank: 7, score: "4,000" },
                      { rank: 8, score: "3,000" },
                      { rank: 9, score: "2,000" },
                      { rank: 10, score: "1,000" }
                    ].map((player, index) => (
                      <motion.div
                        key={index}
                        className="grid grid-cols-3 gap-4 p-4 border-b border-gray-700/30 hover:bg-phoenix-primary/5 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 3.5 + index * 0.1 }}
                      >
                        <div className="text-left">
                          <span className={`font-mono font-bold ${
                            player.rank <= 3 ? 'text-phoenix-primary' : 'text-gray-300'
                          }`}>
                            #{player.rank}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-gray-500 font-medium italic">Coming Soon</span>
                        </div>
                        <div className="text-right">
                          <span className="text-success-green font-mono font-bold">{player.score}</span>
                        </div>
                      </motion.div>
                    ))
                </div>

                <motion.div 
                  className="flex justify-center space-x-6 text-sm text-gray-400 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.5 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-phoenix-primary animate-pulse" />
                    <span>Live Scores</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-resistance-light animate-pulse" />
                    <span>Real-time Updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                    <span>Blockchain Verified</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Bottom space */}
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-phoenix-primary/60 text-sm font-orbitron">
              Unite Against Extinction
            </p>
          </div>
        </div>
      </div>

      {/* Game Modal Overlay */}
      {showGameModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full h-full max-w-7xl max-h-[90vh] bg-void-primary rounded-lg overflow-hidden"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-void-secondary/90 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-orbitron font-bold text-phoenix-primary">
                  Meda Shooter
                </h3>
                {walletAddress && (
                  <span className="text-sm text-gray-400 font-mono">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                )}
              </div>
              
              <button
                onClick={closeGameModal}
                className="p-2 hover:bg-phoenix-primary/20 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400 hover:text-phoenix-primary" />
              </button>
            </div>

            {/* Game Loading State */}
            {!unityLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-void-primary">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <Target size={64} className="text-phoenix-primary mx-auto" />
                  </motion.div>
                  <div className="text-phoenix-light text-xl font-orbitron mb-4">
                    Loading Meda Shooter...
                  </div>
                  <div className="w-64 bg-void-secondary rounded-full h-2 mx-auto">
                    <div 
                      className="h-full bg-gradient-to-r from-phoenix-primary to-phoenix-light rounded-full transition-all duration-300"
                      style={{ width: `${unityLoadingProgress}%` }}
                    />
                  </div>
                  <div className="text-phoenix-light text-sm mt-2 font-mono">
                    {unityLoadingProgress}%
                  </div>
                </div>
              </div>
            )}

            {/* Unity Game Container */}
            <div className="w-full h-full pt-16">
              <Unity
                unityContext={unityContext}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                  display: unityLoaded ? "block" : "none"
                }}
              />
            </div>

            {/* Game Status Footer */}
            {unityLoaded && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-void-secondary/90 backdrop-blur-sm">
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                      <span>Game Loaded</span>
                    </div>
                    {walletAddressSent && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-phoenix-primary animate-pulse" />
                        <span>NFTs Connected</span>
                      </div>
                    )}
                  </div>
                  <div className="text-phoenix-primary font-orbitron">
                    Press ESC or click X to exit
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MedaShooterPage;
                  
                