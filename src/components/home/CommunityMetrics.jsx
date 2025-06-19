import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, MapPin, Zap } from 'lucide-react';

// Metrics data
const metricsData = [
  {
    icon: <Users size={24} className="text-neon-cyan" />,
    title: "HERO ARTIFACTS",
    value: 0,
    target: 4023,
    description: "Combat-ready operatives deployed across web and Telegram battlefronts",
    iconBackground: "bg-neon-cyan/20",
    textColor: "text-neon-cyan",
    color: "#00F0FF",
    buildingImage: "/buildings/blue-tower.png",
  },
  {
    icon: <Shield size={24} className="text-meda-gold" />,
    title: "LEGENDARY WEAPONS",
    value: 0,
    target: 10350,
    description: "Legendary warriors with specialized combat abilities and battle histories",
    iconBackground: "bg-meda-gold/20",
    textColor: "text-meda-gold",
    color: "#FFB61E",
    buildingImage: "/buildings/gold-tower.png",
  },
  {
    icon: <MapPin size={24} className="text-nebula-pink" />,
    title: "LIBERATED LANDS",
    value: 0,
    target: 449,
    description: "Strategic zones reclaimed from Swarm control across multiple sectors",
    iconBackground: "bg-nebula-pink/20",
    textColor: "text-nebula-pink",
    color: "#FF3E8A",
    buildingImage: "/buildings/pink-tower.png",
  },
  {
    icon: <Zap size={24} className="text-energy-green" />,
    title: "MEDA GAS RELEASED (Mil)",
    value: 0,
    target: 150,
    description: "Critical energy resources powering the resistance war machine",
    iconBackground: "bg-energy-green/20",
    textColor: "text-energy-green",
    color: "#39FF14",
    buildingImage: "/buildings/green-tower.png",
  }
];

const CommunityMetrics = () => {
  // References and state for counter animation
  const [counters, setCounters] = useState(metricsData.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const sectionRef = useRef(null);
  const animationTriggered = useRef(false);

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

  // Counter animation effect
  useEffect(() => {
    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting && !animationTriggered.current) {
          animationTriggered.current = true;
          
          // Start counting animation for each metric
          metricsData.forEach((metric, index) => {
            const duration = isMobile ? 1500 : 2000; // Faster on mobile
            const frameDuration = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameDuration);
            const step = metric.target / totalFrames;
            
            let currentValue = 0;
            let frame = 0;
            
            const intervalId = setInterval(() => {
              frame++;
              currentValue += step;
              
              if (frame === totalFrames) {
                clearInterval(intervalId);
                currentValue = metric.target;
              }
              
              setCounters(prevCounters => {
                const newCounters = [...prevCounters];
                newCounters[index] = Math.floor(currentValue);
                return newCounters;
              });
            }, frameDuration);
          });
        }
      },
      { threshold: 0.3 }
    );
    
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }
    
    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, [isMobile]);

  // Calculate responsive heights based on viewport
  const getResponsiveHeights = () => {
    const topBarHeight = isMobile ? 64 : 80;
    const availableHeight = viewportHeight - topBarHeight;
    
    return {
      sectionHeight: viewportHeight,
      contentHeight: availableHeight,
      headerHeight: Math.min(120, availableHeight * 0.15),
      visualHeight: Math.min(600, availableHeight * 0.65), // Increased for better city layout
      cityHeight: Math.min(400, availableHeight * 0.4), // Dedicated city area height
      buildingHeight: Math.min(320, availableHeight * 0.35), // Buildings height
      metricsHeight: Math.min(180, availableHeight * 0.2) // Reduced to fit better
    };
  };

  const heights = getResponsiveHeights();

  return (
    <div 
      className="w-full relative overflow-hidden"
      style={{ height: `${heights.sectionHeight}px` }}
    >
      {/* Simplified background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-void-primary via-void-secondary to-resistance-primary/30" />
        
        {/* Reduced background stars - Desktop only */}
        {!isMobile && (
          <motion.div className="absolute inset-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                  backgroundColor: i % 3 === 0 ? '#FF8C00' : i % 3 === 1 ? '#3B82F6' : '#FFFFFF',
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* RESPONSIVE Section content */}
      <div className="relative z-10 w-full h-full">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="w-full h-full flex flex-col pt-16 pb-24 px-4">
            {/* Mobile Header */}
            <motion.div 
              className="text-center mb-6"
              style={{ height: `${heights.headerHeight}px` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl font-orbitron font-bold text-phoenix-primary mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Battle Status Report
              </motion.h2>
              
              <motion.p 
                className="text-sm sm:text-base text-phoenix-light/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Real-time intelligence from our resistance operations
              </motion.p>
            </motion.div>

            {/* Mobile Metrics Cards - Vertical Stack */}
            <div ref={sectionRef} className="space-y-4 flex-1">
              {metricsData.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 relative overflow-hidden rounded-lg backdrop-blur-md"
                  style={{
                    background: 'rgba(15, 15, 35, 0.6)',
                    border: `2px solid ${metric.color}60`,
                    boxShadow: `0 0 15px ${metric.color}30`
                  }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: `0 0 25px ${metric.color}50`
                  }}
                >
                  <div className="flex items-center justify-between">
                    {/* Left side - Icon and info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        {metric.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-orbitron font-bold mb-1"
                            style={{ color: metric.color }}>
                          {metric.title}
                        </h3>
                        <p className="text-neutral-light text-xs leading-relaxed">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Right side - Value */}
                    <div className="text-right">
                      <div className="font-jetbrains text-2xl font-bold">
                        <motion.span 
                          className={metric.textColor}
                          style={{
                            textShadow: `0 0 8px ${metric.color}70`
                          }}
                        >
                          {counters[index].toLocaleString()}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)`
                    }}
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  />
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
              
              {/* Simplified transition from previous section - Desktop only */}
              <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-20">      
                <div className="absolute inset-0" style={{ left: '16rem' }}>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`cascade-${i}`}
                      className="absolute w-1 h-12 rounded-full"
                      style={{
                        left: `${40 + i * 15}%`,
                        top: '10px',
                        background: `linear-gradient(to bottom, ${i % 2 === 0 ? 'rgba(255, 140, 0, 0.3)' : 'rgba(59, 130, 246, 0.3)'}, transparent)`,
                        filter: 'blur(1px)'
                      }}
                      animate={{
                        y: ['0px', '120px'],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.8,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Section Header - Responsive height */}
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
                  Battle Status Report
                </motion.h2>
                
                <motion.p 
                  className="mt-2 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-phoenix-light/80"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  Real-time intelligence from our resistance operations
                </motion.p>
              </motion.div>

              {/* Content positioned to fit remaining height */}
              <div 
                className="flex-1 flex flex-col justify-start relative"
                style={{ height: `${heights.visualHeight}px` }}
              >
                
                {/* Traffic animation positioned absolutely */}
                <div className="absolute top-8 left-0 right-0 h-20 pointer-events-none z-10">
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={`gold-line-${i}`}
                      className="absolute"
                      style={{
                        top: `${10 + i * 25}px`,
                        left: '-150px',
                        height: '2px',
                        width: '80px',
                      }}
                      animate={{
                        x: ['0px', 'calc(100vw + 300px)'],
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 1.5,
                      }}
                    >
                      <div 
                        className="w-full h-full bg-gradient-to-r from-transparent via-meda-gold to-transparent"
                        style={{
                          boxShadow: '0 0 8px #FFB61E',
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* City and Buildings Section - Better positioned */}
                <div 
                  className="relative flex-1 flex flex-col justify-end"
                  style={{ 
                    height: `${heights.cityHeight}px`,
                    marginTop: '40px' // Reduced margin to give more space for city
                  }}
                >
                  
                  {/* City horizon background - FIXED: Full 400px height with proper container */}
                  <div className="absolute bottom-0 w-screen left-1/2 transform -translate-x-1/2">
                    <div 
                      className="w-full bg-no-repeat bg-center opacity-40"
                      style={{ 
                        backgroundImage: "url('/buildings/city-horizon.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center center", // Changed to center to show full image
                        height: '500px', // Exact image height
                        minHeight: '400px' // Ensure minimum 400px
                      }}
                    />
                  </div>
                  
                  {/* Buildings positioned to align with city horizon - Better positioning */}
                  <div ref={sectionRef} className="absolute bottom-0 left-0 right-0 z-10">
                    <div className="flex justify-between items-end max-w-6xl mx-auto px-4">
                      {metricsData.map((metric, index) => (
                        <div key={index} className="relative flex flex-col items-center flex-1">
                          <div className="relative">
                            {/* Hover glow effect */}
                            {hoveredIndex === index && (
                              <motion.div
                                className="absolute inset-0 -m-8 rounded-full pointer-events-none"
                                style={{
                                  background: `radial-gradient(circle, ${metric.color}20 0%, transparent 60%)`,
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                            
                            <motion.img 
                              src={metric.buildingImage} 
                              alt={metric.title}
                              className="object-contain transform-gpu cursor-pointer"
                              style={{ 
                                transformOrigin: 'bottom center',
                                height: `${Math.min(heights.buildingHeight, 280)}px`,
                                maxHeight: '280px' // Slightly reduced to fit better with 400px city
                              }}
                              animate={{
                                scale: hoveredIndex === index ? 1.1 : 1,
                                filter: hoveredIndex === index 
                                  ? `drop-shadow(0 0 25px ${metric.color})`
                                  : `drop-shadow(0 0 15px ${metric.color}50)`
                              }}
                              transition={{ duration: 0.2 }}
                              onHoverStart={() => setHoveredIndex(index)}
                              onHoverEnd={() => setHoveredIndex(null)}
                              onError={(e) => {
                                console.error(`Failed to load image: ${metric.buildingImage}`);
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Energy lines positioned BELOW buildings */}
                  <div className="absolute -bottom-4 left-0 right-0 z-10">
                    <div className="max-w-6xl mx-auto px-4">
                      <div className="grid grid-cols-4 gap-4">
                        {metricsData.map((metric, index) => (
                          <motion.div
                            key={index}
                            className="h-[2px] rounded-full"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)`,
                              boxShadow: `0 0 6px ${metric.color}80`
                            }}
                            animate={{
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.3
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Metrics Cards - Positioned with better spacing */}
                <div 
                  className="w-full mt-8"
                  style={{ height: `${heights.metricsHeight}px` }}
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto px-4">
                    {metricsData.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center p-3 relative overflow-hidden group rounded-lg cursor-pointer backdrop-blur-md"
                        style={{
                          background: 'rgba(15, 15, 35, 0.4)',
                          border: `2px solid ${metric.color}`,
                          boxShadow: `0 0 15px ${metric.color}40`
                        }}
                        whileHover={{ 
                          y: -3,
                          boxShadow: `0 0 25px ${metric.color}70`
                        }}
                        onHoverStart={() => setHoveredIndex(index)}
                        onHoverEnd={() => setHoveredIndex(null)}
                      >
                        {/* Enhanced border effect */}
                        <motion.div
                          className="absolute inset-0 rounded-lg pointer-events-none"
                          style={{
                            border: `1px solid ${metric.color}`,
                            opacity: 0.4
                          }}
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.4
                          }}
                        />
                        
                        {/* Corner accent */}
                        <motion.div
                          className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full"
                          style={{
                            background: metric.color,
                            boxShadow: `0 0 4px ${metric.color}`
                          }}
                          animate={{
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2
                          }}
                        />
                        
                        {/* Title - Responsive font size */}
                        <h3 className="text-xs md:text-sm lg:text-base font-bold mb-1 font-orbitron tracking-wide"
                            style={{ color: metric.color }}>
                          {metric.title}
                        </h3>
                        
                        {/* Value - Responsive font size */}
                        <div className="font-jetbrains text-lg md:text-xl lg:text-2xl font-bold">
                          <motion.span 
                            className={metric.textColor}
                            style={{
                              textShadow: `0 0 8px ${metric.color}70`
                            }}
                            animate={{ 
                              textShadow: [
                                `0 0 8px ${metric.color}70`, 
                                `0 0 12px ${metric.color}90`, 
                                `0 0 8px ${metric.color}70`
                              ] 
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {counters[index].toLocaleString()}
                          </motion.span>
                        </div>

                        {/* Bottom accent line */}
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-0.5 rounded-b-lg"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)`
                          }}
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop-only Ground Effect - Positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-5">
              {/* Main grid floor */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-full opacity-50"
                style={{
                  background: `
                    linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px),
                    linear-gradient(0deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '80px 80px',
                  transform: 'perspective(800px) rotateX(75deg)',
                  transformOrigin: 'bottom center'
                }}
                animate={{
                  backgroundPosition: [
                    '0px 0px, 0px 0px',
                    '80px 0px, 0px 80px'
                  ]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Additional ground effects... */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`grid-h-${i}`}
                  className="absolute w-full h-px"
                  style={{
                    bottom: `${40 + i * 30}px`,
                    background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.6), transparent)',
                    transform: 'perspective(800px) rotateX(75deg)',
                    transformOrigin: 'bottom center'
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Transition to next section - Desktop only */}
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-20">
              <div className="absolute inset-0" style={{ left: '16rem' }}>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`descent-stream-${i}`}
                    className="absolute w-1 h-8 rounded-full"
                    style={{
                      left: `${40 + i * 10}%`,
                      bottom: '10px',
                      background: `linear-gradient(to top, ${i % 2 === 0 ? 'rgba(255, 140, 0, 0.2)' : 'rgba(59, 130, 246, 0.2)'}, transparent)`,
                      filter: 'blur(1px)'
                    }}
                    animate={{
                      y: ['0px', '-40px'],
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.6,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityMetrics;