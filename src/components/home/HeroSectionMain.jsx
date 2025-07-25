import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWeb3Auth } from '../../contexts/Web3AuthContext';

// Enhanced Background with Swarm Invasion
const SwarmInvasionBackground = () => {
  const [stars, setStars] = useState([]);
  const [debris, setDebris] = useState([]);
  
  useEffect(() => {
    // Generate background stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleDelay: Math.random() * 4
        });
      }
      setStars(newStars);
    };

    // Generate debris particles
    const generateDebris = () => {
      const newDebris = [];
      for (let i = 0; i < 25; i++) {
        newDebris.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 4,
          rotation: Math.random() * 360,
          speed: Math.random() * 40 + 20,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
      setDebris(newDebris);
    };

    generateStars();
    generateDebris();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced background stars */}
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
            duration: 3 + Math.random() * 2,
            delay: star.twinkleDelay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating debris with enhanced movement */}
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
            x: [0, Math.random() * 60 - 30],
            y: [0, Math.random() * 40 - 20],
            rotate: [piece.rotation, piece.rotation + 720]
          }}
          transition={{
            duration: piece.speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Enhanced Swarm ships */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`swarm-${i}`}
          className="absolute"
          initial={{
            left: '-8%',
            top: `${10 + i * 10}%`,
          }}
          animate={{
            left: ['108%'],
            top: [`${10 + i * 10}%`, `${15 + i * 8}%`, `${10 + i * 10}%`]
          }}
          transition={{
            duration: 15 + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="relative">
            <motion.div
              className="w-12 h-6 bg-gradient-to-r from-red-900 to-red-600 relative"
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
              
              {/* Enhanced wing appendages */}
              <div className="absolute -left-2 top-0 w-3 h-2 bg-red-700/70 rounded-full transform -rotate-15" />
              <div className="absolute -left-2 bottom-0 w-3 h-2 bg-red-700/70 rounded-full transform rotate-15" />
              <div className="absolute -right-2 top-0 w-3 h-2 bg-red-700/70 rounded-full transform rotate-15" />
              <div className="absolute -right-2 bottom-0 w-3 h-2 bg-red-700/70 rounded-full transform -rotate-15" />
            </motion.div>
            
            {/* Enhanced trail */}
            <div className="absolute top-1/2 right-full -translate-y-1/2 w-20 h-1 bg-gradient-to-l from-red-400/90 via-red-500/60 to-transparent" />
          </div>
        </motion.div>
      ))}

      {/* Enhanced weapon fire */}
      {[...Array(6)].map((_, i) => (
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
          <div className="w-24 h-1 bg-gradient-to-r from-phoenix-primary via-red-500 to-transparent rounded-full">
            <div className="w-full h-full bg-gradient-to-r from-yellow-200 via-orange-300 to-transparent blur-sm" />
          </div>
        </motion.div>
      ))}

      {/* Enhanced explosion effects */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`explosion-${i}`}
          className="absolute"
          style={{
            left: `${25 + i * 20}%`,
            top: `${20 + i * 15}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 0],
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
          <div className="w-16 h-16 rounded-full bg-gradient-radial from-yellow-300 via-phoenix-primary to-red-700">
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-white via-yellow-200 to-transparent blur-sm" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useWeb3Auth();
  
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
      {/* Swarm Invasion Background */}
      <SwarmInvasionBackground />
      
      {/* Enhanced gradient layers matching design manual */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-void-primary via-void-secondary to-resistance-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-phoenix-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-void-primary/80 via-transparent to-void-primary/80" />
      </div>
      
      {/* Corruption spread animation with Phoenix colors */}
      <motion.div 
        className="absolute w-full h-full opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 60,
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
      
      {/* Emergency beacon signals with Phoenix styling */}
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
      
      {/* Main Content - Properly centered with sidebar consideration */}
      <div className="relative z-10 min-h-screen w-full pt-20 md:pl-64 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
          
          {/* Main Guardian Image - Full Size, Bottom Aligned */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              duration: 1.5, 
              delay: 0.8,
              type: "spring",
              stiffness: 80,
              damping: 20
            }}
            className="absolute bottom-0 z-0"
            style={{
              left: '16rem', // Start right after sidebar
              transform: 'translateX(0%)'
            }}
          >
            {/* Enhanced glow effect behind the image - can extend into sidebar */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-phoenix-primary/40 via-phoenix-light/25 to-transparent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: '200%',
                height: '200%',
                left: '-50%',
                top: '-50%'
              }}
            />
            
            {/* Main Guardian image - Full Screen Size */}
            <motion.img
              src="/main.png"
              alt="Guardian Squad"
              className="w-[50rem] h-[50rem] sm:w-[60rem] sm:h-[60rem] md:w-[70rem] md:h-[70rem] lg:w-[80rem] lg:h-[80rem] xl:w-[90rem] xl:h-[90rem] 2xl:w-[100rem] 2xl:h-[100rem] object-contain object-bottom"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(255, 140, 0, 0.8))',
                maxWidth: 'calc(100vw - 16rem)',
                maxHeight: 'calc(100vh - 5rem)'
              }}
            />
          </motion.div>
          
          {/* Action Buttons - Overlaid on top, positioned lower */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute z-20 flex flex-col sm:flex-row gap-6 justify-center bottom-32"
            style={{
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <motion.button 
              className="btn-phoenix-primary text-xl px-10 py-5 font-orbitron font-bold"
              onClick={handleConnectWallet}
              disabled={isLoading}
              whileHover={{ 
                scale: isLoading ? 1 : 1.08,
                boxShadow: isLoading ? undefined : "0 0 40px rgba(255, 140, 0, 0.6)"
              }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? 'Initializing...' : 'BEGIN'}
            </motion.button>
            
            <motion.button 
              className="btn-resistance-secondary text-xl px-10 py-5 font-orbitron font-bold"
              onClick={handleJoinResistance}
              whileHover={{ 
                scale: 1.08,
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              JOIN THE RESISTANCE
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Emergency alert streaks */}
      {[...Array(4)].map((_, i) => (
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
      
      {/* Subtle creative transition to next section - no blue/black elements */}
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-20">
        {/* Subtle energy particle streams flowing to next section - centered */}
        <div className="absolute inset-0" style={{ left: '16rem' }}>
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
        </div>
        
        {/* Sidebar interaction particles */}
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
        
        {/* Subtle atmospheric glow - no harsh lines */}
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
        
        {/* Final gentle blend overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void-primary/30" />
      </div>
    </div>
  );
};

export default HeroSection;