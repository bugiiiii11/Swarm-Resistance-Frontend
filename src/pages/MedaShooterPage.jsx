import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useTransform as useMotionTransform, animate } from 'framer-motion';
import { Zap, Target, Crosshair, Award, Trophy, Star, Play, X } from 'lucide-react';
import { useWeb3Auth } from '../contexts/Web3AuthContext';

const MedaShooterPage = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Web3Auth context
  const { walletAddress, login, isConnected, isLoading: web3Loading } = useWeb3Auth();
  
  // Game state
  const [gameError, setGameError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerScore, setPlayerScore] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  
  // Unity modal state
  const [showGameModal, setShowGameModal] = useState(false);
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [unityProgress, setUnityProgress] = useState(0);

  // Unity component state - loaded dynamically
  const [Unity, setUnity] = useState(null);
  const [unityContext, setUnityContext] = useState(null);
  const [unityError, setUnityError] = useState(null);

  // State for animated counter
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useMotionTransform(count, (latest) => Math.round(latest));

  // Load Unity dynamically to avoid Vite module resolution issues
  useEffect(() => {
    const loadUnityModule = async () => {
      try {
        console.log('Loading Unity module...');
        
        // Dynamic import that works with Vite
        const unityModule = await import('react-unity-webgl');
        
        console.log('Unity module loaded:', unityModule);
        console.log('Available exports:', Object.keys(unityModule));
        
        // Set Unity component
        setUnity(() => unityModule.default);
        
        // Create Unity context
        if (unityModule.UnityContext) {
          console.log('Creating Unity context...');
          
          const context = new unityModule.UnityContext({
            loaderUrl: "/unity-builds/medashooter/Build/medashooter.loader.js",
            dataUrl: "/unity-builds/medashooter/Build/medashooter.data.gz",
            frameworkUrl: "/unity-builds/medashooter/Build/medashooter.framework.js.gz",
            codeUrl: "/unity-builds/medashooter/Build/medashooter.wasm.gz",
            companyName: "Cryptomeda",
            productName: "Meda Shooter",
            productVersion: "1.0",
          });
          
          setUnityContext(context);
          console.log('Unity context created successfully:', context);
        } else {
          throw new Error('UnityContext not found in module');
        }
        
      } catch (error) {
        console.error('Failed to load Unity module:', error);
        setUnityError(error.message);
      }
    };

    loadUnityModule();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load leaderboard on component mount and when wallet connects
  useEffect(() => {
    loadLeaderboard();
  }, [walletAddress]);

  // Unity event listeners - only set up when context is available
  useEffect(() => {
    if (!unityContext) return;

    console.log('Setting up Unity event listeners...');

    // Make dispatchReactUnityEvent available globally for Unity
    window.dispatchReactUnityEvent = (eventName) => {
      console.log('Unity event received:', eventName);
      
      if (eventName === 'ReadyToWalletAddress') {
        if (walletAddress) {
          console.log('Sending wallet address to Unity:', walletAddress);
          unityContext.send('JavascriptHook', 'SetWalletAddress', walletAddress);
        }
      } else if (eventName === 'GameOver') {
        console.log('Game over received from Unity');
        // Refresh leaderboard after game
        loadLeaderboard();
        // Close modal after a short delay
        setTimeout(() => {
          setShowGameModal(false);
        }, 2000);
      }
    };

    // Unity loading progress
    const handleProgress = (progression) => {
      setUnityProgress(Math.round(progression * 100));
    };

    // Unity loaded
    const handleLoaded = () => {
      console.log('Unity game loaded successfully');
      setUnityLoaded(true);
    };

    // Unity error handling
    const handleError = (message) => {
      console.error('Unity error:', message);
      setGameError(`Unity error: ${message}`);
    };

    unityContext.on('progress', handleProgress);
    unityContext.on('loaded', handleLoaded);
    unityContext.on('error', handleError);

    // Cleanup
    return () => {
      unityContext.removeEventListener('progress', handleProgress);
      unityContext.removeEventListener('loaded', handleLoaded);
      unityContext.removeEventListener('error', handleError);
      
      // Clean up global function
      if (window.dispatchReactUnityEvent) {
        delete window.dispatchReactUnityEvent;
      }
    };
  }, [unityContext, walletAddress]);

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
      const baseUrl = 'https://swarm-resistance-backend-production.up.railway.app';
      let url = `${baseUrl}/api/game/medashooter/scoreboard?limit=10`;
      if (walletAddress) {
        url += `&player_address=${walletAddress}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.scoreboard || []);
        setPlayerScore(data.user_score || null);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // Validate player (check blacklist)
  const validatePlayer = async (address) => {
    try {
      const baseUrl = 'https://swarm-resistance-backend-production.up.railway.app';
      const response = await fetch(`${baseUrl}/api/v1/minigames/medashooter/blacklist/?wallet_address=${address}`);
      
      if (response.ok) {
        const data = await response.json();
        return { valid: !data.blacklisted, message: data.message };
      }
      return { valid: true };
    } catch (error) {
      console.error('Failed to validate player:', error);
      return { valid: true }; // Default to allowing play if validation fails
    }
  };

  // Handle Deploy button click
  const handleDeployClick = async () => {
    setGameError(null);
    
    if (!isConnected) {
      try {
        await login();
        return; // Let the wallet connection complete, user will click again
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        setGameError('Failed to connect wallet. Please try again.');
        return;
      }
    }

    if (!Unity || !unityContext) {
      setGameError('Unity is still loading. Please wait a moment and try again.');
      return;
    }

    // Validate player (check blacklist)
    const validation = await validatePlayer(walletAddress);
    if (!validation.valid) {
      setGameError(validation.message || 'Player is not eligible to play.');
      return;
    }

    // Open Unity modal
    setShowGameModal(true);
    setUnityLoaded(false);
    setUnityProgress(0);
  };

  // Close modal handler
  const closeModal = () => {
    setShowGameModal(false);
    setUnityLoaded(false);
    setUnityProgress(0);
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

      {/* Unity Game Modal */}
      {showGameModal && Unity && unityContext && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] bg-void-primary rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header with close button */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-void-primary to-transparent">
              <h3 className="text-xl font-orbitron font-bold text-phoenix-primary">
                Meda Shooter
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg bg-void-secondary/80 hover:bg-void-secondary transition-colors"
              >
                <X size={24} className="text-gray-300" />
              </button>
            </div>

            {/* Unity Game Container */}
            <div className="w-full h-full pt-16">
              {!unityLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-void-primary">
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 border-4 border-phoenix-primary border-t-transparent rounded-full mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-phoenix-primary font-orbitron font-bold text-xl mb-2">
                      Loading Game
                    </p>
                    <div className="w-64 bg-void-secondary rounded-full h-2 mx-auto mb-2">
                      <motion.div
                        className="h-full bg-gradient-to-r from-phoenix-primary to-phoenix-light rounded-full"
                        style={{ width: `${unityProgress}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm">{unityProgress}%</p>
                  </div>
                </div>
              )}
              
              <Unity 
                unityContext={unityContext}
                style={{
                  width: "100%",
                  height: "100%",
                  display: unityLoaded ? "block" : "none"
                }}
              />
            </div>

            {/* Status Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void-primary to-transparent">
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                  <span>Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</span>
                </div>
                {unityLoaded && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-phoenix-primary animate-pulse" />
                    <span>Game Ready</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
              {/* Unity Loading Status */}
              {unityError && (
                <motion.div 
                  className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Unity Error: {unityError}
                </motion.div>
              )}
              
              {!Unity && !unityError && (
                <motion.div 
                  className="mb-4 p-3 bg-phoenix-primary/20 border border-phoenix-primary rounded-lg text-phoenix-primary text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Loading Unity game engine...
                </motion.div>
              )}
              
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
                className="btn-phoenix-primary px-8 py-4 text-xl font-orbitron font-bold"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(255, 140, 0, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeployClick}
                disabled={web3Loading || showGameModal || !Unity || unityError}
              >
                <div className="flex items-center space-x-2">
                  <Play size={24} />
                  <span>
                    {web3Loading ? 'CONNECTING...' : 
                     showGameModal ? 'GAME LOADING...' :
                     !Unity ? 'LOADING UNITY...' :
                     unityError ? 'UNITY ERROR' :
                     !isConnected ? 'CONNECT WALLET TO DEPLOY' : 
                     'DEPLOY'}
                  </span>
                </div>
              </motion.button>
              
              {!isConnected && Unity && (
                <p className="mt-2 text-sm text-gray-400">
                  Connect your wallet to access your NFTs and play the game
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* Rest of your component - central construction animation, progress indicators, leaderboard */}
          {/* ... keeping all the existing visual elements ... */}
          
          {/* Bottom space */}
          <div className="text-center py-8">
            <p className="text-phoenix-primary/60 text-sm font-orbitron">
              Unite Against Extinction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedaShooterPage;