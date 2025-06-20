import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useWeb3Auth } from '../../contexts/Web3AuthContext';

// Mobile-optimized Background with Swarm Invasion
const SwarmInvasionBackground = ({ isMobile }) => {
  const [stars, setStars] = useState([]);
  const [debris, setDebris] = useState([]);
  
  useEffect(() => {
    // Generate fewer background elements on mobile for performance
    const generateStars = () => {
      const starCount = isMobile ? 50 : 150;
      const newStars = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (isMobile ? 2 : 3) + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleDelay: Math.random() * 4
        });
      }
      setStars(newStars);
    };

    // Generate fewer debris particles on mobile
    const generateDebris = () => {
      const debrisCount = isMobile ? 8 : 25;
      const newDebris = [];
      for (let i = 0; i < debrisCount; i++) {
        newDebris.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (isMobile ? 8 : 12) + 4,
          rotation: Math.random() * 360,
          speed: Math.random() * (isMobile ? 25 : 40) + 20,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
      setDebris(newDebris);
    };

    generateStars();
    generateDebris();
  }, [isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced background stars - Reduced count on mobile */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.2, star.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: isMobile ? 4 : 3 + Math.random() * 2,
            delay: star.twinkleDelay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating debris with mobile optimization */}
      {debris.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute bg-neutral-medium/40 rounded-sm"
          style={{
            width: `${piece.size}px`,
            height: `${piece.size * 0.6}px`,
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            opacity: piece.opacity
          }}
          animate={{
            x: [0, Math.random() * (isMobile ? 30 : 60) - (isMobile ? 15 : 30)],
            y: [0, Math.random() * (isMobile ? 20 : 40) - (isMobile ? 10 : 20)],
            rotate: [piece.rotation, piece.rotation + (isMobile ? 360 : 720)]
          }}
          transition={{
            duration: piece.speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Mobile-optimized Swarm ships - Fewer on mobile */}
      {[...Array(isMobile ? 4 : 8)].map((_, i) => (
        <motion.div
          key={`swarm-${i}`}
          className="absolute"
          initial={{
            left: '-8%',
            top: `${10 + i * (isMobile ? 15 : 10)}%`,
          }}
          animate={{
            left: ['108%'],
            top: [`${10 + i * (isMobile ? 15 : 10)}%`, `${15 + i * (isMobile ? 12 : 8)}%`, `${10 + i * (isMobile ? 15 : 10)}%`]
          }}
          transition={{
            duration: (isMobile ? 12 : 15) + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="relative">
            <motion.div
              className={`${isMobile ? 'w-8 h-4' : 'w-12 h-6'} bg-gradient-to-r from-red-900 to-red-600 relative`}
              style={{
                clipPath: 'polygon(0% 50%, 30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%)'
              }}
              animate={{
                scale: [1, 1.15, 1],
                filter: ['hue-rotate(0deg)', 'hue-rotate(20deg)', 'hue-rotate(0deg)']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-red-400/60 rounded-full blur-sm" />
              
              {/* Mobile-optimized wing appendages */}
              <div className={`absolute -left-1 top-0 ${isMobile ? 'w-2 h-1' : 'w-3 h-2'} bg-red-700/70 rounded-full transform -rotate-15`} />
              <div className={`absolute -left-1 bottom-0 ${isMobile ? 'w-2 h-1' : 'w-3 h-2'} bg-red-700/70 rounded-full transform rotate-15`} />
              <div className={`absolute -right-1 top-0 ${isMobile ? 'w-2 h-1' : 'w-3 h-2'} bg-red-700/70 rounded-full transform rotate-15`} />
              <div className={`absolute -right-1 bottom-0 ${isMobile ? 'w-2 h-1' : 'w-3 h-2'} bg-red-700/70 rounded-full transform -rotate-15`} />
            </motion.div>
            
            {/* Responsive trail */}
            <div className={`absolute top-1/2 right-full -translate-y-1/2 ${isMobile ? 'w-12 h-0.5' : 'w-20 h-1'} bg-gradient-to-l from-red-400/90 via-red-500/60 to-transparent`} />
          </div>
        </motion.div>
      ))}

      {/* Mobile-optimized weapon fire */}
      {[...Array(isMobile ? 3 : 6)].map((_, i) => (
        <motion.div
          key={`laser-${i}`}
          className="absolute"
          initial={{
            left: `${15 + i * 15}%`,
            top: `${25 + i * 8}%`,
            opacity: 0
          }}
          animate={{
            left: [`${15 + i * 15}%`, `${70 + i * 10}%`],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 1.2,
            delay: 2.5 + i * 0.7,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeOut"
          }}
        >
          <div className={`${isMobile ? 'w-16 h-0.5' : 'w-24 h-1'} bg-gradient-to-r from-phoenix-primary via-red-500 to-transparent rounded-full`}>
            <div className="w-full h-full bg-gradient-to-r from-yellow-200 via-orange-300 to-transparent blur-sm" />
          </div>
        </motion.div>
      ))}

      {/* Mobile-optimized explosion effects */}
      {[...Array(isMobile ? 2 : 4)].map((_, i) => (
        <motion.div
          key={`explosion-${i}`}
          className="absolute"
          style={{
            left: `${25 + i * 20}%`,
            top: `${20 + i * 15}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, isMobile ? 1.5 : 2, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: 4 + i * 2.5,
            repeat: Infinity,
            repeatDelay: 10,
            ease: "easeOut"
          }}
        >
          <div className={`${isMobile ? 'w-10 h-10' : 'w-16 h-16'} rounded-full bg-gradient-radial from-yellow-300 via-phoenix-primary to-red-700`}>
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-white via-yellow-200 to-transparent blur-sm" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// PropTypes validation for SwarmInvasionBackground
SwarmInvasionBackground.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useWeb3Auth();
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleConnectWallet = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleJoinResistance = () => {
    navigate('/join-resistance');
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Mobile-optimized Swarm Invasion Background */}
      <SwarmInvasionBackground isMobile={isMobile} />
      
      {/* Enhanced gradient layers - Optimized for mobile */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-void-primary via-void-secondary to-resistance-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-phoenix-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void-primary/80 via-transparent to-void-primary/80" />
      </div>
      
      {/* Mobile-optimized corruption spread animation */}
      <motion.div 
        className={`absolute w-full h-full ${isMobile ? 'opacity-20' : 'opacity-30'}`}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: isMobile ? 80 : 60,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            radial-gradient(ellipse at center, rgba(255, 140, 0, 0.2) 0%, transparent 70%), 
            radial-gradient(ellipse at bottom right, rgba(220, 38, 38, 0.15) 0%, transparent 60%)
          `,
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* Mobile-optimized emergency beacon signals */}
      {!isMobile && (
        <motion.div 
          className="absolute w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`beacon-${i}`}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${15 + i * 17}%`,
                top: `${20 + i * 12}%`,
                backgroundColor: '#FF8C00',
                boxShadow: '0 0 15px #FF8C00'
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.8, 1],
                boxShadow: [
                  '0 0 15px rgba(255, 140, 0, 0.5)',
                  '0 0 30px rgba(255, 140, 0, 0.8)',
                  '0 0 15px rgba(255, 140, 0, 0.5)'
                ]
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}
      
      {/* RESPONSIVE Main Content */}
      <div className="relative z-10 min-h-screen w-full">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="w-full h-full flex flex-col pt-24 pb-24 px-4">
            {/* Mobile Header */}
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl font-orbitron font-black text-stellar-white mb-8"
                style={{
                  textShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 140, 0, 0.6)',
                  letterSpacing: '0.03em'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                animate={{
                  textShadow: [
                    '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 140, 0, 0.6)',
                    '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 140, 0, 0.8)',
                    '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 140, 0, 0.6)'
                  ]
                }}
              >
                JOIN THE RESISTANCE
              </motion.h1>
              
              {/* Mobile subtitle */}
              <motion.p 
                className="text-sm sm:text-base text-phoenix-light/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                The time of hiding is over—the Guardians rise to fulfill an ancient prophecy. Armed with crystallized memories of fallen heroes and weapons forged from Phoenix Essence, you will command territories across the galaxy in our greatest war. Stand with the resistance.
              </motion.p>
            </motion.div>

            {/* Mobile Action Buttons - Vertical Stack */}
            <div className="space-y-4">
              {/* Mobile CONNECT & BEGIN Button */}
              <motion.button 
                className="w-full relative text-lg font-orbitron font-bold rounded-lg overflow-hidden py-4 px-6"
                style={{
                  background: 'linear-gradient(45deg, rgba(15, 35, 15, 0.95), rgba(34, 197, 94, 0.9))',
                  border: '2px solid rgba(34, 197, 94, 0.9)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.6), inset 0 0 15px rgba(34, 197, 94, 0.1)',
                  opacity: isLoading ? 0.5 : 1,
                  minHeight: '56px'
                }}
                onClick={handleConnectWallet}
                disabled={isLoading}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: isLoading ? 0.5 : 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: isLoading ? 1 : 1.02,
                  boxShadow: isLoading ? undefined : "0 0 25px rgba(34, 197, 94, 0.8), inset 0 0 20px rgba(34, 197, 94, 0.15)"
                }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {/* Mobile shimmer effect */}
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
                
                <span 
                  className="relative z-10"
                  style={{
                    textShadow: '0 0 8px rgba(74, 222, 128, 0.8)'
                  }}
                >
                  {isLoading ? 'INITIALIZING...' : 'CONNECT WALLET & BEGIN'}
                </span>
              </motion.button>
              
              {/* Mobile JOIN THE RESISTANCE Button */}
              <motion.button 
                className="w-full relative text-lg font-orbitron font-bold rounded-lg overflow-hidden py-4 px-6"
                style={{
                  background: 'rgba(30, 58, 138, 0.9)',
                  border: '2px solid rgba(59, 130, 246, 0.8)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(59, 130, 246, 0.1)',
                  minHeight: '56px'
                }}
                onClick={handleJoinResistance}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.8), inset 0 0 25px rgba(59, 130, 246, 0.15)",
                  borderColor: "rgba(96, 165, 250, 1)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Mobile shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <span 
                  className="relative z-10"
                  style={{
                    textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  PLAY MEDASHOOTER
                </span>
              </motion.button>
            </div>

            {/* Mobile character/atmosphere elements */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {/* Simplified mobile atmospheric elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`mobile-atmosphere-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-phoenix-primary/60"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                    boxShadow: '0 0 8px rgba(255, 140, 0, 0.6)'
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.3, 1],
                    y: [0, -15, 0]
                  }}
                  transition={{
                    duration: 3 + i,
                    delay: i * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Desktop Layout - Enhanced Original 
          <div className="pt-20 md:pl-64 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
              
              {/* Desktop Main Guardian Image - Enhanced positioning */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 2, 
                  delay: 1.2
                }}
                className="absolute z-0"
                style={{
                  left: '16rem',
                  right: '0',
                  bottom: '100px',
                  top: '120px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}
              >
                <motion.img
                  src="/main.png"
                  alt="Guardian Squad"
                  className="object-contain object-bottom"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(255, 140, 0, 0.6))',
                    maxWidth: 'calc(100vw - 16rem)',
                    maxHeight: 'calc(100vh - 220px)',
                    width: 'auto',
                    height: 'auto'
                  }}
                  initial={{ 
                    opacity: 0,
                    scale: 0.8,
                    filter: 'blur(10px) brightness(0) contrast(2)',
                  }}
                  animate={{ 
                    opacity: [0, 0.3, 0.7, 1],
                    scale: [0.8, 1.02, 0.98, 1],
                    filter: [
                      'blur(10px) brightness(0) contrast(2)',
                      'blur(8px) brightness(0.3) contrast(1.8)',
                      'blur(4px) brightness(0.7) contrast(1.4)',
                      'blur(2px) brightness(0.9) contrast(1.2)',
                      'blur(0px) brightness(1) contrast(1)'
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    delay: 1.2,
                    ease: "easeOut",
                    opacity: { 
                      duration: 2.5,
                      times: [0, 0.3, 0.7, 1]
                    },
                    scale: {
                      duration: 2.5,
                      times: [0, 0.6, 0.9, 1],
                      ease: "easeOut"
                    },
                    filter: {
                      duration: 2.5,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      ease: "easeOut"
                    }
                  }}
                />
                
                {/* Enhanced holographic effects */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    delay: 1.4,
                    ease: "easeInOut"
                  }}
                >
                  {/* Vertical scan lines */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`scan-${i}`}
                      className="absolute w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                      style={{
                        left: `${12.5 + i * 12.5}%`,
                        opacity: 0.6
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: [0, 1, 0] }}
                      transition={{
                        duration: 1.5,
                        delay: 1.6 + i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  
                  {/* Horizontal scan effect */}
                  <motion.div
                    className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    initial={{ top: '100%' }}
                    animate={{ top: ['100%', '0%', '100%'] }}
                    transition={{
                      duration: 1.8,
                      delay: 1.9,
                      ease: "linear"
                    }}
                    style={{ opacity: 0.8 }}
                  />
                </motion.div>
                
                {/* Energy materialization particles */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2.5,
                    delay: 1.2,
                    ease: "easeInOut"
                  }}
                >
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        boxShadow: '0 0 6px #00FFFF'
                      }}
                      initial={{ 
                        scale: 0,
                        opacity: 0
                      }}
                      animate={{ 
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        x: [0, Math.random() * 40 - 20],
                        y: [0, Math.random() * 40 - 20]
                      }}
                      transition={{
                        duration: 2,
                        delay: 1.4 + i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Desktop Animated Smoke PNG - Optimized positioning */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 2, 
                  delay: 1.2
                }}
              >
                <div className="relative w-full h-[500px] overflow-hidden">
                  <motion.img 
                    src="/smoke.png" 
                    alt="Battle Smoke" 
                    className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom"
                    style={{
                      maxWidth: '100%',
                      height: '500px',
                      filter: 'drop-shadow(0 0 20px rgba(255, 140, 0, 0.3))'
                    }}
                    initial={{ 
                      opacity: 0,
                      scale: 0.9,
                      filter: 'blur(8px) brightness(0.3) contrast(1.5)',
                    }}
                    animate={{ 
                      opacity: [0, 0.4, 0.8, 1],
                      scale: [0.9, 1.02, 0.99, 1],
                      filter: [
                        'blur(8px) brightness(0.3) contrast(1.5)',
                        'blur(6px) brightness(0.5) contrast(1.3)',
                        'blur(3px) brightness(0.8) contrast(1.1)',
                        'blur(0px) brightness(1) contrast(1)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      delay: 1.2,
                      ease: "easeOut",
                      opacity: { 
                        duration: 2,
                        times: [0, 0.3, 0.7, 1]
                      },
                      scale: {
                        duration: 2,
                        times: [0, 0.6, 0.9, 1],
                        ease: "easeOut"
                      },
                      filter: {
                        duration: 2,
                        times: [0, 0.3, 0.7, 1],
                        ease: "easeOut"
                      }
                    }}
                  />
                  
                  {/* Smoke materialization particles */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      delay: 1.2,
                      ease: "easeInOut"
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`smoke-particle-${i}`}
                        className="absolute w-2 h-2 bg-orange-400/60 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          bottom: `${Math.random() * 30}%`,
                          boxShadow: '0 0 8px rgba(255, 140, 0, 0.6)'
                        }}
                        initial={{ 
                          scale: 0,
                          opacity: 0
                        }}
                        animate={{ 
                          scale: [0, 1.2, 0],
                          opacity: [0, 0.8, 0],
                          y: [0, -40 - Math.random() * 20]
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 1.4 + i * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Desktop Bottom Section - Title and Buttons */}
              <div className="absolute bottom-0 left-0 right-0 z-20" style={{ paddingLeft: '16rem' }}>
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                  
                  {/* Desktop Big Title "GUARDIANS RISE" */}
                  <motion.div
                    className="text-center mb-12"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.h1 
                      className="text-5xl md:text-6xl lg:text-7xl font-orbitron font-black text-stellar-white mb-4 whitespace-nowrap"
                      style={{
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 140, 0, 0.6)',
                        letterSpacing: '0.05em'
                      }}
                      animate={{
                        textShadow: [
                          '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 140, 0, 0.6)',
                          '0 0 25px rgba(255, 255, 255, 1), 0 0 50px rgba(255, 140, 0, 0.8)',
                          '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 140, 0, 0.6)'
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      JOIN THE RESISTANCE
                    </motion.h1>
                  </motion.div>
                  
                  {/* Desktop Action Buttons */}
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-8 justify-center items-center"
                  >
                    {/* Desktop CONNECT & BEGIN Button */}
                    <motion.button 
                      className="relative text-2xl font-orbitron font-bold rounded-lg overflow-hidden"
                      style={{
                        padding: '2rem 4rem',
                        minWidth: '300px',
                        background: 'linear-gradient(45deg, rgba(15, 35, 15, 0.95), rgba(34, 197, 94, 0.9))',
                        border: '2px solid rgba(34, 197, 94, 0.9)',
                        color: '#FFFFFF',
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.6), inset 0 0 15px rgba(34, 197, 94, 0.1)',
                        opacity: isLoading ? 0.5 : 1
                      }}
                      onClick={handleConnectWallet}
                      disabled={isLoading}
                      whileHover={{ 
                        scale: isLoading ? 1 : 1.05,
                        boxShadow: isLoading ? undefined : "0 0 30px rgba(34, 197, 94, 0.8), inset 0 0 20px rgba(34, 197, 94, 0.15)"
                      }}
                      whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    >
                      {/* Desktop shimmer effect */}
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
                      
                      <span 
                        className="relative z-10"
                        style={{
                          textShadow: '0 0 10px rgba(74, 222, 128, 0.8)'
                        }}
                      >
                        {isLoading ? 'INITIALIZING...' : 'CONNECT WALLET & BEGIN'}
                      </span>
                      
                      {/* Desktop corner indicators */}
                      <motion.div
                        className="absolute top-2 left-2 w-2 h-2 rounded-full bg-green-400"
                        animate={{
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)'
                        }}
                      />
                      
                      <motion.div
                        className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-green-400"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          delay: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          boxShadow: '0 0 6px rgba(74, 222, 128, 0.8)'
                        }}
                      />
                    </motion.button>
                    
                    {/* Desktop JOIN THE RESISTANCE Button */}
                    <motion.button 
                      className="relative text-2xl font-orbitron font-bold rounded-lg overflow-hidden"
                      style={{
                        padding: '2rem 4rem',
                        minWidth: '300px',
                        background: 'rgba(30, 58, 138, 0.9)',
                        border: '2px solid rgba(59, 130, 246, 0.8)',
                        color: '#FFFFFF',
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(59, 130, 246, 0.1)'
                      }}
                      onClick={handleJoinResistance}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 30px rgba(59, 130, 246, 0.15)",
                        borderColor: "rgba(96, 165, 250, 1)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Desktop shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          clipPath: 'inset(0)'
                        }}
                      />
                      
                      <span 
                        className="relative z-10"
                        style={{
                          textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        PLAY MEDASHOOTER
                      </span>
                      
                      {/* Desktop corner indicators */}
                      <motion.div
                        className="absolute top-2 left-2 w-2 h-2 rounded-full bg-resistance-glow"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          boxShadow: '0 0 8px rgba(96, 165, 250, 0.8)'
                        }}
                      />
                      
                      <motion.div
                        className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-resistance-glow"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          delay: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          boxShadow: '0 0 8px rgba(96, 165, 250, 0.8)'
                        }}
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop-only emergency alert streaks */}
      {!isMobile && [...Array(4)].map((_, i) => (
        <motion.div
          key={`alert-${i}`}
          className="absolute w-2 h-2 bg-phoenix-primary rounded-full"
          initial={{ 
            top: `${Math.random() * 60}%`,
            left: '-8%',
            opacity: 0
          }}
          animate={{
            left: ['115%'],
            top: [`${Math.random() * 60}%`, `${Math.random() * 40 + 60}%`],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 2.5 + 4,
            repeat: Infinity,
            repeatDelay: 8,
            ease: "easeIn"
          }}
        >
          <div className="absolute inset-0 w-32 h-1 bg-gradient-to-r from-transparent to-phoenix-primary/90 transform -translate-y-1/2 origin-right -rotate-45" />
        </motion.div>
      ))}
      
      {/* Responsive transition to next section */}
      <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'h-32' : 'h-80'} pointer-events-none z-20`}>
        {/* Mobile transition elements */}
        {isMobile ? (
          <div className="absolute inset-0">
            {/* Simple mobile transition particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`mobile-transition-${i}`}
                className="absolute w-1 h-8 rounded-full"
                style={{
                  left: `${40 + i * 10}%`,
                  top: '20%',
                  background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? 'rgba(255, 140, 0, 0.4)' : 'rgba(59, 130, 246, 0.4)'})`,
                  filter: 'blur(1px)'
                }}
                animate={{
                  y: ['0px', '60px'],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.8,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Mobile atmospheric glow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 140, 0, 0.08) 0%, transparent 70%)',
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        ) : (
          /* Desktop transition elements */
          <div className="absolute inset-0" style={{ left: '16rem' }}>
            {/* Desktop energy particle streams */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`flow-particle-${i}`}
                className="absolute w-1 h-16 rounded-full"
                style={{
                  left: `${30 + i * 6}%`,
                  top: '60%',
                  background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? 'rgba(255, 140, 0, 0.3)' : 'rgba(59, 130, 246, 0.3)'})`,
                  filter: 'blur(2px)'
                }}
                animate={{
                  y: ['0px', '120px'],
                  opacity: [0, 0.6, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Desktop sidebar interaction particles */}
            <div className="absolute left-0 top-0 w-64 h-full">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`sidebar-particle-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-phoenix-primary/40"
                  style={{
                    left: `${60 + i * 20}%`,
                    top: `${30 + i * 20}%`
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 3 + i,
                    delay: i * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Desktop atmospheric glow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-20"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 140, 0, 0.1) 0%, transparent 70%)',
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        )}
        
        {/* Final blend overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void-primary/30" />
      </div>
    </div>
  );
};

export default HeroSection;