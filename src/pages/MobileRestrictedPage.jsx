import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useTransform as useMotionTransform, animate } from 'framer-motion';
import { Monitor, Smartphone, Shield, Zap, Cpu, GamepadIcon } from 'lucide-react';

const MobileRestrictedPage = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // State for animated counter
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useMotionTransform(count, (latest) => Math.round(latest));

  // Animate counter when component loads
  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        const controls = animate(count, 75, {
          duration: 2,
          ease: "easeOut",
          delay: 1.5
        });
        setHasAnimated(true);
        return controls.stop;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [count, hasAnimated]);
  
  // Enhanced parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const particlesY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Enhanced floating particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: i * 0.3,
    duration: 6 + Math.random() * 4,
    size: 2 + Math.random() * 3,
    left: Math.random() * 100,
    color: i % 4 === 0 ? "#FF8C00" : i % 4 === 1 ? "#60A5FA" : i % 4 === 2 ? "#8B5CF6" : "#22C55E"
  }));

  // Phoenix fire particles
  const fireParticles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    delay: i * 0.8,
    duration: 5 + Math.random() * 3,
    left: 10 + Math.random() * 80,
  }));

  // Gaming/tech related icons
  const techIcons = [
    { icon: Monitor, color: "#FF8C00", delay: 0 },
    { icon: Cpu, color: "#60A5FA", delay: 0.5 },
    { icon: Shield, color: "#8B5CF6", delay: 1 },
    { icon: Zap, color: "#22C55E", delay: 1.5 },
    { icon: GamepadIcon, color: "#FB923C", delay: 2 },
    { icon: Smartphone, color: "#FFB84D", delay: 2.5, crossed: true }
  ];

  return (
    <div className="full-screen-section relative overflow-hidden bg-void-primary min-h-screen" ref={sectionRef}>
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
            className="absolute w-2 h-4 rounded-full"
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
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-6 py-8">
          
          {/* Logo section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img 
              src="/logo.png" 
              alt="Swarm Resistance" 
              className="h-16 mx-auto mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.div>

          {/* Title and subtitle section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-orbitron font-bold text-phoenix-primary mb-4"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255, 140, 0, 0.7)",
                  "0 0 40px rgba(255, 140, 0, 0.9)",
                  "0 0 20px rgba(255, 140, 0, 0.7)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              DESKTOP PROTOCOL REQUIRED
            </motion.h1>
            
            <motion.p 
              className="text-lg text-phoenix-light/80 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Guardian, the Resistance Command Center is currently optimized for desktop operations. 
              Ancient Cryptomeda veterans must first secure their Hero Artifacts and prepare for the coming war.
            </motion.p>
          </motion.div>

          {/* Central warning animation */}
          <motion.div
            className="relative mb-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* Central hub - Monitor as main icon */}
            <div className="relative w-24 h-24 glass-phoenix rounded-full flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotateY: [0, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Monitor size={36} className="text-phoenix-primary" />
              </motion.div>
            </div>

            {/* Orbiting tech icons */}
            {techIcons.map((item, index) => {
              const Icon = item.icon;
              const angle = (index * 360) / techIcons.length;
              
              return (
                <motion.div
                  key={index}
                  className={`absolute w-10 h-10 ${item.crossed ? 'glass-void border-red-500' : 'glass-resistance'} rounded-lg flex items-center justify-center`}
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-20px',
                    marginTop: '-20px',
                  }}
                  animate={{
                    rotate: [angle, angle + 360],
                    x: [0, Math.cos((angle * Math.PI) / 180) * 60],
                    y: [0, Math.sin((angle * Math.PI) / 180) * 60],
                  }}
                  transition={{
                    duration: 8,
                    delay: item.delay,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Icon 
                    size={20} 
                    style={{ color: item.crossed ? "#EF4444" : item.color }}
                    className={item.crossed ? "opacity-50" : ""}
                  />
                  {item.crossed && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-0.5 bg-red-500 rotate-45" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Progress indicators */}
          <motion.div 
            className="space-y-8 mb-12 w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            {/* Main progress bar */}
            <div className="glass-void rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-orbitron font-bold text-phoenix-primary">
                  Mobile Command Center
                </h3>
                <span className="text-phoenix-light font-mono">
                  <motion.span>{rounded}</motion.span>%
                </span>
              </div>
              <div className="w-full bg-void-secondary rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-phoenix-primary to-phoenix-light"
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 2, delay: 2 }}
                />
              </div>
            </div>

            {/* Feature status */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Mobile Interface", status: "Development", color: "text-phoenix-primary" },
                { name: "Touch Controls", status: "Testing", color: "text-phoenix-primary" },
                { name: "NFT Integration", status: "Complete", color: "text-success-green" },
                { name: "Optimization", status: "In Progress", color: "text-warning-orange" }
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

          {/* Main message */}
          <motion.div
            className="text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3 }}
          >
            <div className="glass-phoenix rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-phoenix-primary/10 via-resistance-light/5 to-energy-purple/10" />
              
              <div className="relative">
                <motion.h2 
                  className="text-xl md:text-2xl font-bold text-stellar-white mb-6 font-orbitron"
                >
                  The Ancient Cryptomeda Veterans Are Gathering
                </motion.h2>
                
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    The Resistance Command Center is currently calibrated for the original Cryptomeda 
                    community - veteran guardians who fought in the first wars and now must secure 
                    their Hero Artifacts, Weapons, and prepare their strategic positions.
                  </p>
                  
                  <p>
                    Ancient warriors need time to check their Meda Gas reserves, deploy their legendary 
                    NFTs, and coordinate land claims before the mobile forces join the battle.
                  </p>
                  
                  <p className="text-phoenix-light font-semibold">
                    Switch to a desktop computer to access the full Resistance arsenal and join the veterans in preparation.
                  </p>
                </div>

                {/* Status indicators */}
                <motion.div 
                  className="flex justify-center space-x-6 text-sm text-gray-400 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                    <span>Desktop Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-phoenix-primary animate-pulse" />
                    <span>Veterans Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-warning-orange animate-pulse" />
                    <span>Mobile Optimizing</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4 }}
          >
            <p className="text-phoenix-primary/60 text-lg font-orbitron italic font-bold">
              "United We Rise - On Desktop We Fight"
            </p>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default MobileRestrictedPage;