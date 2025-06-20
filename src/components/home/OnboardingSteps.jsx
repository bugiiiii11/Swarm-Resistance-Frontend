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
      headerHeight: Math.min(140, availableHeight * 0.18), // Back to original
      journeyHeight: Math.min(240, availableHeight * 0.38), // Back to original  
      featuresHeight: Math.min(180, availableHeight * 0.28), // Back to original
      copyrightHeight: 80 // Back to original
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
          <div className="w-full h-full flex flex-col pt-24 pb-24 px-4">
            {/* Mobile Header - Back to original */}
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl font-orbitron font-bold text-phoenix-primary mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Unite Against Extinction
              </motion.h2>
              
              <motion.p 
                className="text-sm sm:text-base text-phoenix-light/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                We need you to reclaim what the Swarm has stolen. Connect your Web3 identity, deploy your NFT arsenal, and earn Meda Gas through victory. The resistance grows stronger with each Guardian who answers the call.
              </motion.p>
            </motion.div>

            {/* Mobile Feature Cards - Positioned lower */}
            <div className="space-y-4 mb-6 mt-auto pt-16"> {/* Added pt-16 to push cards down more */}
              {[
                {
                  title: "Digital Arsenal",
                  description: "Deploy legendary Hero Artifacts containing crystallized memories of ancient Cryptomeda heroes. Arm them with weapons to liberate territories from Swarm invasions.",
                  color: "#FF8C00",
                  icon: "🏆"
                },
                {
                  title: "Token Airdrop Program", 
                  description: "Earn Meda Gas through testing missions and challenges. All tokens will transform into Phoenix Essence at launch, rewarding early Guardians who build the resistance.",
                  color: "#3B82F6",
                  icon: "⚔️"
                },
                {
                  title: "Phoenix Essence Economy",
                  description: "Earn Phoenix Essence from the ashes of defeated enemies. Every victory against the Swarm releases purified energy that powers the resistance and rewards your courage.",
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
            </div>

            {/* Mobile Copyright - Above nav menu
            <motion.div 
              className="text-center mb-10" // Added mb-10 to clear nav menu
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <p className="text-phoenix-primary/60 text-xs font-orbitron">
                ©2025 Swarm Resistance, All Rights Reserved
              </p>
            </motion.div>
            */}
          </div>
        ) : (
          /* Desktop Layout - Back to original structure with small adjustments */
          <div className="pt-6 md:pl-64 h-full">
            <div 
              className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col"
              style={{ height: `${heights.contentHeight}px` }}
            >
              
              {/* Header section - Back to original match CommunityMetrics compact style */}
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
                  className="mt-2 text-lg md:text-xl max-w-6xl mx-auto leading-relaxed text-phoenix-light/80"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  We need you to reclaim what the Swarm has stolen. Connect your Web3 identity, deploy your NFT arsenal, and earn Meda Gas through victory. The resistance grows stronger with each Guardian who answers the call.
                </motion.p>
              </motion.div>

              {/* Spacer to push cards to bottom */}
              <div className="flex-1"></div>

              {/* Feature Cards - At bottom above copyright */}
              <motion.div 
                className="w-full mb-1" // Added more margin above copyright
                style={{ height: `${heights.featuresHeight}px` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto px-8">
                  {/* Digital Arsenal */}
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
                      Digital Arsenal
                    </h3>
                    <p className="text-gray-300 text-sm">
                       Deploy legendary Hero Artifacts containing crystallized memories of ancient Cryptomeda heroes. Arm them with weapons to liberate territories from Swarm invasions.

                    </p>
                  </motion.div>

                  {/* Token Airdrop */}
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
                      Token Airdrop Program
                    </h3>
                    <p className="text-gray-300 text-sm">
                       Earn Meda Gas through testing missions and challenges. All tokens will transform into Phoenix Essence at launch, rewarding early Guardians who build the resistance.
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
                      Phoenix Essence Economy
                    </h3>
                    <p className="text-gray-300 text-sm">
                       Earn Phoenix Essence from the ashes of defeated enemies. Every victory against the Swarm releases purified energy that powers the resistance and rewards your courage.
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Copyright notice - At bottom with more space above */}
              <motion.div 
                className="text-center pb-6"
                style={{ height: `${heights.copyrightHeight}px` }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                viewport={{ once: true }}
              >
                <p className="text-phoenix-primary/60 text-sm font-orbitron">
                   
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