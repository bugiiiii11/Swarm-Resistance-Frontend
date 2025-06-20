import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gamepad2, Shield } from 'lucide-react';

const EcosystemOverview = () => {
  const sectionRef = useRef(null);
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Reduced parallax effects on mobile
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '15%' : '30%']);
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '-10%' : '-20%']);
  const particlesY = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '8%' : '15%']);

  // Reduced particles on mobile
  const particles = Array.from({ length: isMobile ? 6 : 15 }).map((_, i) => ({
    id: i,
    delay: i * 0.3,
    duration: isMobile ? 16 : 12 + Math.random() * 6,
    size: 1.5 + Math.random() * 2.5,
    left: Math.random() * 100,
    color: i % 4 === 0 ? "#FF8C00" : i % 4 === 1 ? "#60A5FA" : i % 4 === 2 ? "#8B5CF6" : "#22C55E"
  }));
  
  // Updated feature cards with improved UX content
  const missionObjectives = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-phoenix-primary">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "MEDASHOOTER",
      description: "Play an ancient game from Cryptomeda to train your reflexes and shooting skills.",
      action: "Play Now",
      isLive: true,
      link: "/meda-shooter",
      borderColor: "border-phoenix-primary/30",
      shadowColor: "0 0 30px rgba(255, 140, 0, 0.5)",
      underlineColor: "#FF8C00",
      characterImage: "char1.png"
    },
    {
      icon: <Shield size={32} className="text-resistance-light" />,
      title: "RESISTANCE HUB",
      description: "Complete daily missions and tactical challenges and earn rewards Meda Gas for joining the resistance.",
      action: "Coming Soon",
      isLive: false,
      borderColor: "border-resistance-light/30",
      shadowColor: "0 0 30px rgba(59, 130, 246, 0.5)",
      underlineColor: "#3B82F6",
      characterImage: "char2.png"
    },
    {
      icon: <Gamepad2 size={32} className="text-energy-green" />,
      title: "SWARM DOMINION",
      description: "Deploy your hero artifacts and legendary weapons to liberate lands occupied by the Swarm.",
      action: "Coming Soon",
      isLive: false,
      borderColor: "border-energy-green/30",
      shadowColor: "0 0 30px rgba(34, 197, 94, 0.5)",
      underlineColor: "#22C55E",
      characterImage: "char3.png"
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isMobile ? 0.2 : 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // Calculate responsive heights based on viewport
  const getResponsiveHeights = () => {
    const topBarHeight = isMobile ? 64 : 80;
    const availableHeight = viewportHeight - topBarHeight;
    
    return {
      sectionHeight: viewportHeight,
      contentHeight: availableHeight,
      headerHeight: Math.min(200, availableHeight * 0.35), // More space for header to prevent overlap
      objectivesHeight: Math.min(500, availableHeight * 0.65) // Adjust objectives space accordingly
    };
  };

  const heights = getResponsiveHeights();

  return (
    <div 
      ref={sectionRef} 
      className="w-full relative overflow-hidden bg-void-primary"
      style={{ height: `${heights.sectionHeight}px` }}
    >
      {/* Enhanced background layers - Optimized for mobile */}
      {!isMobile && (
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ y: backgroundY }}
        >
          {/* Starfield background - Desktop only */}
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
      )}

      {/* Simplified mobile background */}
      {isMobile && (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-b from-void-primary via-void-secondary to-resistance-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-phoenix-primary/5 via-transparent to-transparent" />
        </div>
      )}

      {/* Enhanced floating particles - Reduced on mobile, NO FIRE PARTICLES */}
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
              boxShadow: `0 0 ${particle.size * (isMobile ? 3 : 6)}px ${particle.color}`,
            }}
            animate={{
              y: ['120vh', '-10vh'],
              x: [0, Math.sin(particle.id * 0.5) * (isMobile ? 75 : 150)],
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
      </motion.div>

      {/* RESPONSIVE Section content */}
      <div className="relative z-10 w-full h-full">
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
              <motion.h2 
                className="text-2xl sm:text-3xl font-orbitron font-bold text-phoenix-primary mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Fight the Swarm. Reclaim the Universe.
              </motion.h2>
              
              <motion.p 
                className="text-sm sm:text-base text-phoenix-light/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Our galaxy bleeds under Swarm occupation, but every Guardian carries the fire of liberation. Through tactical missions and strategic combat, we will purify corrupted worlds and forge Meda Gas from the ashes of our enemies. Each battle brings us closer to freedom.
              </motion.p>
            </motion.div>
            
            {/* Mobile Mission Objectives - Compact layout with top-right buttons */}
            <div className="space-y-4">
              {missionObjectives.map((objective, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 glass-phoenix p-4"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    border: `2px solid rgba(255, 140, 0, 0.3)`,
                  }}
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Header with icon, title, and button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center glass-resistance rounded-lg mr-3">
                        {objective.icon}
                      </div>
                      <h3 className="text-base font-orbitron font-bold text-stellar-white">
                        {objective.title}
                      </h3>
                    </div>
                    
                    {/* Action button - top right */}
                    <motion.button
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 flex-shrink-0 ${
                        objective.isLive
                          ? 'bg-phoenix-primary/20 text-phoenix-primary border border-phoenix-primary/50 hover:bg-phoenix-primary/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-400/50 cursor-not-allowed'
                      }`}
                      whileHover={{ 
                        scale: objective.isLive ? 1.05 : 1,
                        boxShadow: objective.isLive ? `0 0 10px ${objective.underlineColor}40` : undefined
                      }}
                      disabled={!objective.isLive}
                      onClick={() => {
                        if (objective.isLive && objective.link) {
                          window.location.href = objective.link;
                        }
                      }}
                    >
                      {objective.action}
                    </motion.button>
                  </div>
                  
                  {/* Colorful line */}
                  <motion.div 
                    className="h-0.5 w-0 rounded-full mb-3"
                    style={{ 
                      background: `linear-gradient(90deg, ${objective.underlineColor}, ${objective.underlineColor}80)`,
                      boxShadow: `0 0 6px ${objective.underlineColor}40`
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.2 * index }}
                  />
                  
                  {/* Description */}
                  <p className="text-neutral-light text-xs leading-relaxed">
                    {objective.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop Layout - OPTIMIZED FOR VIEWPORT HEIGHT */
          <div className="pt-6 md:pl-64 h-full">
            <div 
              className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col"
              style={{ height: `${heights.contentHeight}px` }}
            >
              
              {/* Section Header - Better spacing consistency */}
              <motion.div 
                className="text-center flex flex-col"
                style={{ height: `${heights.headerHeight}px` }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex-1 flex flex-col justify-center">
                  <motion.h2 
                    className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-center text-phoenix-primary relative inline-block mx-auto"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Fight the Swarm. Reclaim the Universe.
                  </motion.h2>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <motion.p 
                    className="text-lg md:text-xl max-w-6xl mx-auto leading-relaxed text-phoenix-light/80"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    Our galaxy bleeds under Swarm occupation, but every Guardian carries the fire of liberation. Through tactical missions and strategic combat, we will purify corrupted worlds and forge Meda Gas from the ashes of our enemies. Each battle brings us closer to freedom.
                  </motion.p>
                </div>
              </motion.div>
              
              {/* Mission Objectives Grid with Characters - Characters behind everything */}
              <motion.div 
                className="grid md:grid-cols-3 gap-6 flex-1 flex items-end pb-16 relative"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {missionObjectives.map((objective, index) => (
                  <div key={index} className="relative flex flex-col items-center">
                    {/* Character Image positioned behind everything - Lower z-index */}
                    <motion.div
                      className="absolute -top-72 z-0 w-full flex justify-center"
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <img 
                        src={`/${objective.characterImage}`}
                        alt={`${objective.title} character`}
                        className="w-64 h-80 object-contain opacity-90"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.6))'
                        }}
                      />
                    </motion.div>
                    
                    {/* Mission Card - Higher z-index to appear above characters */}
                    <motion.div
                      className="relative rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 glass-phoenix p-6 z-10"
                      variants={itemVariants}
                      style={{
                        border: `2px solid rgba(255, 140, 0, 0.3)`,
                        maxWidth: '400px',
                        margin: '0 auto',
                        height: 'fit-content'
                      }}
                      whileHover={{ 
                        y: -6,
                        scale: 1.02,
                        transition: { duration: 0.3 },
                        boxShadow: objective.shadowColor
                      }}
                    >
                      {/* Header with icon and title */}
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center glass-resistance rounded-lg mr-4">
                          {objective.icon}
                        </div>
                        <h3 className="text-xl md:text-2xl font-orbitron font-bold text-stellar-white flex-1">
                          {objective.title}
                        </h3>
                      </div>
                      
                      {/* Colorful line */}
                      <motion.div 
                        className="h-1 w-0 rounded-full mb-6"
                        style={{ 
                          background: `linear-gradient(90deg, ${objective.underlineColor}, ${objective.underlineColor}80)`,
                          boxShadow: `0 0 8px ${objective.underlineColor}40`
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.2 * index }}
                      />
                      
                      {/* Description */}
                      <p className="text-neutral-light text-base leading-relaxed mb-6">
                        {objective.description}
                      </p>
                      
                      {/* Action button */}
                      <div className="flex justify-center">
                        <motion.button
                          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                            objective.isLive
                              ? 'bg-phoenix-primary/20 text-phoenix-primary border border-phoenix-primary/50 hover:bg-phoenix-primary/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-400/50 cursor-not-allowed'
                          }`}
                          whileHover={{ 
                            scale: objective.isLive ? 1.05 : 1,
                            boxShadow: objective.isLive ? `0 0 15px ${objective.underlineColor}40` : undefined
                          }}
                          disabled={!objective.isLive}
                          onClick={() => {
                            if (objective.isLive && objective.link) {
                              window.location.href = objective.link;
                            }
                          }}
                        >
                          {objective.action}
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcosystemOverview;