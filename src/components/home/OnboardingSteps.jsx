import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OnboardingSteps = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Mobile detection and viewport height tracking
  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportHeight(window.innerHeight);
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Calculate responsive heights based on viewport
  const getResponsiveHeights = () => {
    const topBarHeight = isMobile ? 64 : 80;
    const availableHeight = viewportHeight - topBarHeight;
    
    return {
      sectionHeight: viewportHeight,
      contentHeight: availableHeight,
      headerHeight: Math.min(140, availableHeight * 0.18), // Reduced to match CommunityMetrics
      journeyHeight: Math.min(240, availableHeight * 0.38), // Reduced for mobile to save space
      featuresHeight: Math.min(180, availableHeight * 0.28), // Increased for mobile visibility
      copyrightHeight: 80 // Increased for proper spacing from bottom
    };
  };

  const heights = getResponsiveHeights();

  return (
    <div 
      className="w-full relative overflow-hidden"
      style={{ height: `${heights.sectionHeight}px` }}
    >
      {/* Full-screen background image */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/resistance2.png')",
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Subtle gradient overlay for atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-void-primary/60 via-transparent to-void-primary/30" />
      </div>

      {/* Animated particles for atmosphere - Reduced on mobile */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {[...Array(isMobile ? 6 : 15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              backgroundColor: i % 3 === 0 ? '#FF8C00' : i % 3 === 1 ? '#DC2626' : '#FFFFFF',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              y: [0, isMobile ? -25 : -50, 0]
            }}
            transition={{
              duration: isMobile ? 6 : 4 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* RESPONSIVE Section content */}
      <div className="relative z-10 w-full h-full">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="w-full h-full flex flex-col pt-16 pb-6 px-4">
            {/* Mobile Header - Match CommunityMetrics compact style */}
            <motion.div 
              className="text-center"
              style={{ height: `${heights.headerHeight}px` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl font-orbitron font-bold text-center mb-3 text-phoenix-primary relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Unite Against Extinction
              </motion.h2>
              
              <motion.p 
                className="mt-2 text-sm sm:text-base max-w-xs mx-auto leading-relaxed text-phoenix-light/80 px-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                The Swarm threatens humanity's existence. Join the elite resistance forces and fight for survival.
              </motion.p>
            </motion.div>

            {/* Mobile Resistance Journey - Closer to subtitle with consistent spacing */}
            <motion.div 
              className="flex flex-col justify-start px-4 space-y-3 pt-2"
              style={{ height: `${heights.journeyHeight}px` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.5 }}
            >
              {[
                {
                  step: "[1] CONNECT WALLET",
                  description: "Join the resistance with your Web3 identity",
                  image: "/portal-city.png",
                  color: "#3B82F6"
                },
                {
                  step: "[2] JOIN THE FIGHT", 
                  description: "Deploy NFTs, play games, complete missions",
                  image: "/telegram-city.png",
                  color: "#FF8C00"
                },
                {
                  step: "[3] EARN REWARDS",
                  description: "Accumulate Phoenix Essence for token airdrops", 
                  image: "/polygon-planet.png",
                  color: "#22C55E"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 glass-void rounded-lg p-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0"
                    style={{
                      border: `2px solid ${item.color}80`,
                      boxShadow: `0 0 10px ${item.color}40`
                    }}
                  >
                    <img 
                      src={item.image}
                      alt={item.step}
                      className="w-full h-full object-contain object-bottom"
                      style={{ filter: `drop-shadow(0 0 6px ${item.color}40)` }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-orbitron font-bold text-stellar-white mb-1">
                      {item.step}
                    </h4>
                    <p className="text-neutral-light text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Feature Cards - All 3 now visible */}
            <motion.div 
              className="space-y-4 px-4"
              style={{ height: `${heights.featuresHeight}px` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Daily Rewards",
                  description: "Earn Phoenix Essence daily",
                  color: "#FF8C00",
                  icon: "🏆"
                },
                {
                  title: "NFT Utility", 
                  description: "Deploy NFTs in combat",
                  color: "#3B82F6",
                  icon: "⚔️"
                },
                {
                  title: "Token Airdrop",
                  description: "Future token rewards", 
                  color: "#22C55E",
                  icon: "🚀"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-3 rounded-lg backdrop-blur-md"
                  style={{
                    background: 'rgba(15, 15, 35, 0.7)',
                    border: `1px solid ${feature.color}60`,
                    boxShadow: `0 0 10px ${feature.color}30`
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    x: 4,
                    boxShadow: `0 0 15px ${feature.color}50`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-orbitron font-bold"
                          style={{ color: feature.color }}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-xs">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Copyright - Moved up from bottom */}
            <motion.div 
              className="text-center flex items-start justify-center pt-4"
              style={{ height: `${heights.copyrightHeight}px` }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <p className="text-phoenix-primary/60 text-xs font-orbitron">
                ©2025 Swarm Resistance, All Rights Reserved
              </p>
            </motion.div>
          </div>
        ) : (
          /* Desktop Layout - Redesigned */
          <div className="pt-6 md:pl-64 h-full">
            <div 
              className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col"
              style={{ height: `${heights.contentHeight}px` }}
            >
              
              {/* Header section - Match CommunityMetrics compact style */}
              <motion.div 
                className="text-center"
                style={{ height: `${heights.headerHeight}px` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-center mb-3 text-phoenix-primary relative inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Unite Against Extinction
                </motion.h2>
                
                <motion.p 
                  className="mt-2 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-phoenix-light/80"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  The Swarm threatens humanity's existence. Join the elite resistance forces, deploy cutting-edge technology, and fight for the survival of our species. Your courage will determine our future.
                </motion.p>
              </motion.div>

              {/* Resistance Journey Section - Removed container, direct elements */}
              <motion.div 
                className="flex-1 flex flex-col justify-center px-8 space-y-6"
                style={{ height: `${heights.journeyHeight}px` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.5 }}
              >
                {[
                  {
                    step: "[1] CONNECT WALLET",
                    description: "Join the resistance with your Web3 identity and secure communication channels",
                    image: "/portal-city.png",
                    color: "#3B82F6"
                  },
                  {
                    step: "[2] JOIN THE FIGHT", 
                    description: "Deploy your NFT arsenal, engage in tactical missions, and earn combat rewards",
                    image: "/telegram-city.png",
                    color: "#FF8C00"
                  },
                  {
                    step: "[3] EARN REWARDS",
                    description: "Accumulate Phoenix Essence and qualify for exclusive token airdrops", 
                    image: "/polygon-planet.png",
                    color: "#22C55E"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-6 glass-void rounded-xl p-4 max-w-2xl mx-auto"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{
                      x: 4,
                      boxShadow: `0 0 20px ${item.color}40`
                    }}
                  >
                    <div 
                      className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0"
                      style={{
                        border: `2px solid ${item.color}80`,
                        boxShadow: `0 0 15px ${item.color}40`
                      }}
                    >
                      <img 
                        src={item.image}
                        alt={item.step}
                        className="w-full h-full object-contain object-bottom"
                        style={{ filter: `drop-shadow(0 0 8px ${item.color}40)` }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-orbitron font-bold text-stellar-white mb-2">
                        {item.step}
                      </h4>
                      <p className="text-neutral-light text-sm md:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Feature Cards - Closer to copyright with consistent spacing */}
              <motion.div 
                className="w-full mb-3"
                style={{ height: `${heights.featuresHeight}px` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto px-8">
                  {/* Daily Rewards */}
                  <motion.div
                    className="text-center p-4 rounded-lg backdrop-blur-md"
                    style={{
                      background: 'rgba(15, 15, 35, 0.7)',
                      border: '2px solid rgba(255, 140, 0, 0.4)',
                      boxShadow: '0 0 15px rgba(255, 140, 0, 0.3)'
                    }}
                    whileHover={{
                      y: -6,
                      boxShadow: '0 0 25px rgba(255, 140, 0, 0.5)'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-orbitron font-bold text-phoenix-primary mb-2">
                      Daily Rewards
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Earn Phoenix Essence daily through missions and activities
                    </p>
                  </motion.div>

                  {/* NFT Utility */}
                  <motion.div
                    className="text-center p-4 rounded-lg backdrop-blur-md"
                    style={{
                      background: 'rgba(15, 15, 35, 0.7)',
                      border: '2px solid rgba(59, 130, 246, 0.4)',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                    }}
                    whileHover={{
                      y: -6,
                      boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-orbitron font-bold text-resistance-light mb-2">
                      NFT Utility
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Deploy your Hero and Weapon NFTs in strategic combat
                    </p>
                  </motion.div>

                  {/* Token Airdrop */}
                  <motion.div
                    className="text-center p-4 rounded-lg backdrop-blur-md"
                    style={{
                      background: 'rgba(15, 15, 35, 0.7)',
                      border: '2px solid rgba(34, 197, 94, 0.4)',
                      boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
                    }}
                    whileHover={{
                      y: -6,
                      boxShadow: '0 0 25px rgba(34, 197, 94, 0.5)'
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-orbitron font-bold text-energy-green mb-2">
                      Token Airdrop
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Prepare for future token airdrops through Guardian ranks
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Copyright notice - Moved up from bottom */}
              <motion.div 
                className="text-center flex items-start justify-center pt-4"
                style={{ height: `${heights.copyrightHeight}px` }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                viewport={{ once: true }}
              >
                <p className="text-phoenix-primary/60 text-sm font-orbitron">
                  ©2025 Swarm Resistance, All Rights Reserved
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSteps;