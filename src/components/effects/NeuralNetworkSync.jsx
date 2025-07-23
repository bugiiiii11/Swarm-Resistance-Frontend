import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const NeuralNetworkSync = ({ isActive = false, onComplete = () => {}, direction = 'forward' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('INITIALIZING...');

  // Generate neural network nodes
  const generateNodes = () => {
    const nodes = [];
    const centerX = 50;
    const centerY = 50;
    
    // Center core node
    nodes.push({ id: 'core', x: centerX, y: centerY, type: 'core' });
    
    // Ring 1 - Inner nodes
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * (Math.PI / 180);
      const radius = 15;
      nodes.push({
        id: `ring1-${i}`,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        type: 'primary',
        delay: i * 0.1
      });
    }
    
    // Ring 2 - Outer nodes
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180);
      const radius = 30;
      nodes.push({
        id: `ring2-${i}`,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        type: 'secondary',
        delay: 0.6 + (i * 0.05)
      });
    }
    
    return nodes;
  };

  // Generate connections between nodes
  const generateConnections = (nodes) => {
    const connections = [];
    const core = nodes.find(n => n.type === 'core');
    const ring1Nodes = nodes.filter(n => n.type === 'primary');
    const ring2Nodes = nodes.filter(n => n.type === 'secondary');
    
    // Core to Ring 1 connections
    ring1Nodes.forEach((node, i) => {
      connections.push({
        id: `core-${node.id}`,
        from: core,
        to: node,
        delay: i * 0.1 + 0.3
      });
    });
    
    // Ring 1 to Ring 2 connections (selective)
    ring1Nodes.forEach((ring1Node, i) => {
      const connectedRing2 = ring2Nodes.filter((_, idx) => 
        idx === i * 2 || idx === i * 2 + 1
      );
      connectedRing2.forEach((ring2Node, j) => {
        connections.push({
          id: `${ring1Node.id}-${ring2Node.id}`,
          from: ring1Node,
          to: ring2Node,
          delay: 0.9 + (i * 0.1) + (j * 0.05)
        });
      });
    });
    
    return connections;
  };

  const nodes = generateNodes();
  const connections = generateConnections(nodes);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setIsExiting(false);
      setCurrentStatus('INITIALIZING...');
      
      // Status progression
      const statusTimer1 = setTimeout(() => setCurrentStatus('SYNCING WITH AI COMMANDER...'), 400);
      const statusTimer2 = setTimeout(() => setCurrentStatus('NEURAL PATHWAYS ESTABLISHED'), 1000);
      const statusTimer3 = setTimeout(() => setCurrentStatus('SYNC COMPLETE'), 1400);
      
      // Start exit animation right after "SYNC COMPLETE"
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 1800);
      
      // Complete transition - allow time for exit animations to finish
      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        onComplete();
      }, 2800); // Reduced from 3200ms

      return () => {
        clearTimeout(statusTimer1);
        clearTimeout(statusTimer2);
        clearTimeout(statusTimer3);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isActive, onComplete]);

  if (!isActive && !isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ 
            duration: isExiting ? 0.8 : 0.3,
            ease: "easeOut"
          }}
        >
          {/* Dark background overlay with extended fade-out */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ 
              duration: isExiting ? 1.0 : 0.4,
              ease: "easeOut"
            }}
          />

          {/* Neural Network Container with staggered fade-out */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isExiting ? 0 : 1,
              scale: isExiting ? 0.9 : 1
            }}
            transition={{ 
              duration: isExiting ? 0.6 : 0.3,
              ease: "easeOut"
            }}
          >
            <div className="relative w-96 h-96">
              
              {/* Background Grid */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Neural Network Connections */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {connections.map((connection) => (
                  <motion.line
                    key={connection.id}
                    x1={connection.from.x}
                    y1={connection.from.y}
                    x2={connection.to.x}
                    y2={connection.to.y}
                    stroke="url(#connectionGradient)"
                    strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: 1, 
                      opacity: [0, 1, 0.6],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: connection.delay,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                {/* SVG Gradients */}
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0, 240, 255, 0.8)" />
                    <stop offset="50%" stopColor="rgba(255, 140, 0, 0.9)" />
                    <stop offset="100%" stopColor="rgba(0, 240, 255, 0.8)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Neural Network Nodes */}
              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: node.delay || 0,
                    ease: "easeOut"
                  }}
                >
                  {node.type === 'core' ? (
                    // Central AI Core
                    <motion.div
                      className="relative w-6 h-6 rounded-full border-2 border-phoenix-primary"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 140, 0, 0.9) 0%, rgba(255, 140, 0, 0.3) 70%, transparent 100%)',
                        boxShadow: '0 0 20px rgba(255, 140, 0, 0.8)'
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          '0 0 20px rgba(255, 140, 0, 0.8)',
                          '0 0 30px rgba(255, 140, 0, 1)',
                          '0 0 20px rgba(255, 140, 0, 0.8)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Core inner pulse */}
                      <motion.div
                        className="absolute inset-1 rounded-full bg-phoenix-primary"
                        animate={{
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  ) : (
                    // Regular nodes
                    <motion.div
                      className={`w-3 h-3 rounded-full border ${
                        node.type === 'primary' 
                          ? 'border-cyan-400 bg-cyan-400/30' 
                          : 'border-cyan-300 bg-cyan-300/20'
                      }`}
                      style={{
                        boxShadow: node.type === 'primary' 
                          ? '0 0 8px rgba(0, 240, 255, 0.6)'
                          : '0 0 4px rgba(0, 240, 255, 0.4)'
                      }}
                      animate={{
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                      }}
                    />
                  )}
                </motion.div>
              ))}

              {/* Data Packets flowing through connections */}
              {connections.slice(0, 6).map((connection, i) => (
                <motion.div
                  key={`packet-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-phoenix-primary"
                  style={{
                    left: `${connection.from.x}%`,
                    top: `${connection.from.y}%`,
                    boxShadow: '0 0 4px rgba(255, 140, 0, 0.8)'
                  }}
                  animate={{
                    x: [(connection.to.x - connection.from.x) * 3.84, 0], // Convert % to px approximation
                    y: [(connection.to.y - connection.from.y) * 3.84, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    delay: connection.delay + 0.5,
                    ease: "easeInOut",
                    repeat: 2,
                    repeatDelay: 0.5
                  }}
                />
              ))}

            </div>
          </motion.div>

          {/* Status Display with fade-out */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isExiting ? 0 : 1, 
              y: isExiting ? -20 : 0
            }}
            transition={{ 
              duration: isExiting ? 0.5 : 0.4,
              ease: "easeOut"
            }}
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-sm rounded-lg border border-cyan-400/30">
              {/* Spinning loading indicator */}
              <motion.div
                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Status text */}
              <motion.span
                className="font-mono text-cyan-400 text-sm font-medium"
                style={{
                  textShadow: '0 0 8px rgba(0, 240, 255, 0.6)'
                }}
              >
                {currentStatus}
              </motion.span>
            </div>
          </motion.div>

          {/* Direction indicator with fade-out */}
          <motion.div
            className="absolute top-8 right-8 font-mono text-xl font-bold text-cyan-400"
            style={{
              textShadow: '0 0 10px rgba(0, 240, 255, 0.8)'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isExiting ? 0 : 1, 
              x: isExiting ? -20 : 0
            }}
            transition={{ 
              duration: isExiting ? 0.4 : 0.4,
              ease: "easeOut"
            }}
          >
            {direction === 'forward' ? 'SYNC ►' : '◄ SYNC'}
          </motion.div>

          {/* Corner UI Elements with staggered fade-out */}
          {[
            { position: 'top-4 left-4', content: 'AI.CMD' },
            { position: 'top-4 left-20', content: 'NEURAL.NET' },
            { position: 'bottom-4 left-4', content: 'RESISTANCE.DB' },
            { position: 'bottom-4 right-4', content: 'SECURE.LINK' }
          ].map((corner, i) => (
            <motion.div
              key={`corner-${i}`}
              className={`absolute ${corner.position} font-mono text-xs text-cyan-400/60`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isExiting ? 0 : [0, 1, 0.6][Math.min(2, Math.floor((Date.now() % 3000) / 1000))]
              }}
              transition={{
                duration: isExiting ? 0.3 : 0.6,
                delay: isExiting ? i * 0.05 : i * 0.1 + 0.2,
                ease: "easeOut"
              }}
            >
              {corner.content}
            </motion.div>
          ))}

        </motion.div>
      )}
    </AnimatePresence>
  );
};

NeuralNetworkSync.propTypes = {
  isActive: PropTypes.bool,
  onComplete: PropTypes.func,
  direction: PropTypes.oneOf(['forward', 'backward'])
};

export default NeuralNetworkSync;