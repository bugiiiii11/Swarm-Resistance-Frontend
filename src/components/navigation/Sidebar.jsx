import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// Optimized Fire Particle Component - Reduced complexity
const FireParticle = ({ delay, startX, size = 1 }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        bottom: '-10px',
        width: `${3 * size}px`,
        height: `${6 * size}px`,
      }}
      initial={{ opacity: 0, y: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 1, 0.8, 0],
        y: [0, -window.innerHeight * 0.35],
        scale: [0.8, size, size * 1.1, 0],
        x: [0, Math.random() * 15 - 7],
      }}
      transition={{
        duration: 3.5,
        delay: delay,
        repeat: Infinity,
        ease: "easeOut"
      }}
    >
      {/* Simplified fire particle */}
      <div
        className="w-full h-full rounded-full"
        style={{
          background: 'linear-gradient(to top, #FF8C00, #FFB84D)',
          filter: 'blur(0.5px)',
          boxShadow: '0 0 6px rgba(255, 140, 0, 0.8)'
        }}
      />
    </motion.div>
  );
};

FireParticle.propTypes = {
  delay: PropTypes.number.isRequired,
  startX: PropTypes.number.isRequired,
  size: PropTypes.number
};

// Optimized Fire Effect - Reduced particles from 20 to 8
const FireEffect = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 8; i++) { // Reduced from 20 to 8
        newParticles.push({
          id: i,
          delay: Math.random() * 4,
          startX: 10 + Math.random() * 80,
          size: 0.7 + Math.random() * 0.6,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    const interval = setInterval(generateParticles, 6000); // Reduced frequency
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <FireParticle
          key={particle.id}
          delay={particle.delay}
          startX={particle.startX}
          size={particle.size}
        />
      ))}
      
      {/* Reduced energy streams from 4 to 2 */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute opacity-30"
          style={{
            left: `${25 + i * 30}%`,
            bottom: '0px',
            width: '2px',
            height: '40px',
            background: 'linear-gradient(to top, transparent, var(--phoenix-primary), transparent)',
            filter: 'blur(1px)'
          }}
          animate={{
            y: [0, -window.innerHeight * 0.3],
            opacity: [0, 0.5, 0.3, 0],
            scaleY: [1, 1.1, 0.8, 0]
          }}
          transition={{
            duration: 4,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Reduced embers from 8 to 4 */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`ember-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${15 + Math.random() * 70}%`,
            bottom: '0px',
            background: '#FFAA1A',
            boxShadow: '0 0 4px rgba(255, 170, 26, 0.8)'
          }}
          animate={{
            y: [0, -window.innerHeight * 0.35],
            opacity: [0, 1, 0.6, 0],
            scale: [0.5, 1, 0.5],
            x: [0, Math.random() * 30 - 15]
          }}
          transition={{
            duration: 5,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Futuristic gaming icons - All pages with classic design
const FuturisticIcons = {
  Profile: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 6.5L20 7L16 11L17 17L12 14.5L7 17L8 11L4 7L9.5 6.5L12 2Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  ResistanceHub: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M8 10L12 6L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 14L12 18L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  MedaShooter: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 7L6 14L12 22L18 14L20 7L12 2Z" 
            stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 2V8M8 7L12 11M16 7L12 11" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  Lore: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 8H21L16 12L18 20L12 16L6 20L8 12L3 8H9L12 2Z" 
            stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  Blog: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 8H17M7 12H17M7 16H13" stroke="currentColor" strokeWidth="2"/>
      <circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  AICommander: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1"/>
      <path d="M12 4V8M12 16V20M4 12H8M16 12H20" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <circle cx="12" cy="8" r="1" fill="currentColor" opacity="0.7"/>
      <circle cx="16" cy="12" r="1" fill="currentColor" opacity="0.7"/>
      <circle cx="12" cy="16" r="1" fill="currentColor" opacity="0.7"/>
      <circle cx="8" cy="12" r="1" fill="currentColor" opacity="0.7"/>
    </svg>
  ),
  TradingHub: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7L5 2H19L21 7" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 7H21V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V7Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="15" cy="13" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 11L15 11" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  )
};

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items - All pages with classic design
  const navItems = [
    { 
      icon: <FuturisticIcons.Profile />, 
      text: 'Profile', 
      path: '/profile'
    },
    { 
      icon: <FuturisticIcons.ResistanceHub />, 
      text: 'Resistance Hub', 
      path: '/join-resistance'
    },
    { 
      icon: <FuturisticIcons.MedaShooter />, 
      text: 'Meda Shooter', 
      path: '/meda-shooter'
    },
    { 
      icon: <FuturisticIcons.TradingHub />, 
      text: 'Trading Hub', 
      path: '/marketplace'
    },
    { 
      icon: <FuturisticIcons.Lore />, 
      text: 'Lore', 
      path: '/story'
    },
    { 
      icon: <FuturisticIcons.Blog />, 
      text: 'Blog', 
      path: '/blog'
    },
    { 
      icon: <FuturisticIcons.AICommander />, 
      text: 'AI Commander', 
      path: '/ai-commander'
    }
  ];

  // Social icons with enhanced Phoenix styling and updated links
  const socialIcons = [
    { 
      icon: (
        <svg width="28" height="28" viewBox="0 0 240 240" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="b" x1="0.6667" y1="0.1667" x2="0.4167" y2="0.75">
              <stop stopColor="#37aee2"/>
              <stop offset="1" stopColor="#1e96c8"/>
            </linearGradient>
            <linearGradient id="w" x1="0.6597" y1="0.4369" x2="0.8512" y2="0.8024">
              <stop stopColor="#eff7fc"/>
              <stop offset="1" stopColor="#fff"/>
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="120" fill="url(#b)"/>
          <path d="m98 175c-3.888 0-3.227-1.468-4.568-5.17L82 132.207 170 80" fill="#c8daea"/>
          <path d="m98 175c3 0 4.325-1.372 6-3l16-15.558-19.958-12.035" fill="#a9c9dd"/>
          <path d="m100.04 144.41 48.36 35.729c5.519 3.045 9.501 1.468 10.876-5.123l19.685-92.763c2.015-8.08-3.08-11.746-8.36-9.349l-115.59 44.571c-7.89 3.165-7.843 7.567-1.438 9.528l29.663 9.259 68.673-43.325c3.242-1.966 6.218-.91 3.776 1.258" fill="url(#w)"/>
        </svg>
      ), 
      link: 'https://t.me/Cryptomeda_Tech', 
      label: 'Telegram',
      color: 'hover:text-[#37aee2]'
    },
    { 
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.736-8.84L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      link: 'https://x.com/cryptomedatech', 
      label: 'X (Twitter)',
      color: 'hover:text-phoenix-primary'
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <motion.aside 
      className="fixed hidden md:flex md:flex-col w-64 h-full z-40"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.1) 0%, rgba(26, 26, 46, 0.15) 50%, rgba(15, 15, 35, 0.1) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(255, 140, 0, 0.1)',
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Optimized Fire Effect Background */}
      <FireEffect />
      
      {/* Empty header space - logo moved to topbar */}
      <motion.div 
        className="flex justify-center items-center h-16 border-b relative z-10"
        style={{
          borderColor: 'rgba(255, 140, 0, 0.2)'
        }}
      >
        {/* Empty space where logo was - now moved to topbar */}
      </motion.div>
      
      {/* Navigation Links with enhanced futuristic icons */}
      <nav className="mt-6 px-3 flex-grow relative z-10">
        {navItems.map((item, index) => (
          <motion.div
            key={index} 
            className={`relative overflow-hidden group cursor-pointer rounded-lg mb-2 transition-all duration-300 ${
              location.pathname === item.path 
                ? 'text-phoenix-primary' 
                : 'text-stellar-white'
            }`}
            style={{
              backgroundColor: location.pathname === item.path 
                ? 'rgba(255, 140, 0, 0.15)' 
                : 'transparent',
              borderLeft: location.pathname === item.path 
                ? '3px solid #FF8C00' 
                : '3px solid transparent'
            }}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => handleNavClick(item.path)}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 15px rgba(255,140,0,0.2)"
            }}
          >
            {/* Enhanced holographic background effect */}
            {hoveredItem === index && (
              <motion.div 
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(90deg, rgba(255, 140, 0, 0.1) 0%, rgba(255, 140, 0, 0.2) 50%, rgba(255, 140, 0, 0.1) 100%)',
                }}
                layoutId="hoverBackground"
                initial={{ opacity: 0, x: -100 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            <motion.div 
              className="relative flex items-center p-4"
              whileHover={{ x: 6 }}
              transition={{ duration: 0.2 }}
            >
              {/* Enhanced futuristic icon with animations */}
              <motion.div
                className="relative"
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -5, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  rotate: { duration: 0.8, ease: "easeInOut" }
                }}
              >
                {item.icon}
                
                {/* Energy particle orbit around icon */}
                {hoveredItem === index && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#FF8C00',
                      boxShadow: '0 0 6px rgba(255, 140, 0, 0.8)'
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    transformTemplate={({ rotate }) => 
                      `translate(-50%, -50%) rotate(${rotate}) translateX(20px) rotate(${-rotate})`
                    }
                  />
                )}
              </motion.div>
              
              <span className={`ml-4 text-lg font-orbitron font-medium transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'text-phoenix-primary' 
                  : 'group-hover:text-phoenix-light text-stellar-white'
              }`}
              style={{
                textShadow: location.pathname === item.path 
                  ? '0 0 8px rgba(255, 140, 0, 0.6)' 
                  : 'none'
              }}
              >
                {item.text}
              </span>
              
              {/* Active indicator */}
              {location.pathname === item.path && (
                <motion.div
                  className="absolute right-3 w-2 h-2 rounded-full"
                  style={{
                    background: '#FF8C00',
                    boxShadow: '0 0 8px rgba(255, 140, 0, 0.8)'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        ))}
      </nav>
      
      {/* Enhanced Social Media Section */}
      <div className="border-t pt-6 mt-auto mb-8 px-4 relative z-10"
        style={{
          borderColor: 'rgba(255, 140, 0, 0.2)'
        }}
      >
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm font-orbitron text-stellar-white uppercase tracking-wide font-medium">
            Join the Resistance
          </p>
        </motion.div>
        
        <div className="flex justify-center space-x-6">
          {socialIcons.map((item, index) => (
            <motion.a 
              key={index} 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-stellar-white ${item.color} transition-all duration-300 p-3 rounded-lg relative bg-phoenix-primary/5`}
              title={item.label}
              whileHover={{ 
                scale: 1.3, 
                rotate: [0, -10, 10, -10, 0],
                boxShadow: "0 0 15px rgba(255,140,0,0.4)"
              }}
              transition={{ 
                duration: 0.5,
                rotate: { duration: 0.8, ease: "easeInOut" }
              }}
            >
              {item.icon}
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg -z-10 bg-phoenix-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          ))}
        </div>
        
        {/* Enhanced Resistance motto */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p 
            className="text-lg font-orbitron italic font-bold tracking-wide text-phoenix-primary"
            style={{
              textShadow: '0 0 12px rgba(255, 140, 0, 0.8)'
            }}
          >
            United We Rise
          </p>
        </motion.div>
      </div>
      
      {/* Ambient energy border effect */}
      <motion.div
        className="absolute top-0 right-0 w-0.5 h-full"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255, 140, 0, 0.5), transparent)'
        }}
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Corner accent lights */}
      <motion.div
        className="absolute top-4 right-4 w-2 h-2 rounded-full"
        style={{
          background: '#FF8C00',
          boxShadow: '0 0 8px rgba(255, 140, 0, 0.8)'
        }}
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full"
        style={{
          background: '#60A5FA',
          boxShadow: '0 0 6px rgba(96, 165, 250, 0.8)'
        }}
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 2.5,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.aside>
  );
};

export default Sidebar;