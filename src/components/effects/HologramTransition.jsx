import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const HologramTransition = ({ isActive = false, onComplete = () => {}, direction = 'forward' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      
      // Simple timer to complete the transition
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 1200); // Reduced from 1500ms to 1200ms for faster completion

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive && !isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.2,
            // Delay the parent exit until all children are done
            exit: { duration: 0.1, delay: 1.0 }
          }}
        >
          {/* Background overlay with staggered fade-out */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              // Delay the exit to fade out last
              exit: { duration: 0.4, delay: 0.6 }
            }}
          />

          {/* Central hologram effect - fades out first */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative w-32 h-32"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 1, 0.8],
                rotate: [0, direction === 'forward' ? 180 : -180]
              }}
              exit={{ 
                scale: 0, 
                opacity: 0,
                transition: { duration: 0.3, delay: 0 }
              }}
              transition={{ 
                duration: 1,
                ease: "easeInOut"
              }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-cyan-400"
                style={{
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)'
                }}
                animate={{
                  rotate: [0, direction === 'forward' ? 360 : -360]
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.3, delay: 0 }
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity
                }}
              />

              {/* Inner core */}
              <motion.div
                className="absolute top-4 left-4 right-4 bottom-4 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 240, 255, 0.8) 0%, rgba(255, 140, 0, 0.6) 50%, rgba(0, 240, 255, 0.4) 100%)',
                  boxShadow: '0 0 30px rgba(0, 240, 255, 0.8)'
                }}
                animate={{
                  scale: [0.8, 1.1, 0.9],
                  opacity: [0.6, 1, 0.7]
                }}
                exit={{
                  opacity: 0,
                  scale: 1.5,
                  transition: { duration: 0.3, delay: 0.1 }
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Data streams */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`stream-${i}`}
                  className="absolute w-0.5 h-8"
                  style={{
                    top: '50%',
                    left: '50%',
                    background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.9), transparent)',
                    transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-2rem)`,
                    boxShadow: '0 0 6px rgba(0, 240, 255, 0.6)'
                  }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scaleY: [0.8, 1.4, 0.8]
                  }}
                  exit={{
                    opacity: 0,
                    scaleY: 0,
                    transition: { duration: 0.2, delay: i * 0.05 }
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Channel indicator - fades out with hologram */}
          <motion.div
            className="absolute top-8 right-8 font-mono text-2xl font-bold text-cyan-400"
            style={{
              textShadow: '0 0 10px rgba(0, 240, 255, 0.8)'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: -20,
              transition: { duration: 0.3, delay: 0.1 }
            }}
            transition={{ duration: 0.4 }}
          >
            {direction === 'forward' ? '>>>' : '<<<'}
          </motion.div>

          {/* Scan lines - fade out second */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`scan-${i}`}
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  top: `${16.66 * i}%`,
                  boxShadow: '0 0 6px rgba(0, 240, 255, 0.4)'
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: [0, 1, 0.8],
                  opacity: [0, 0.8, 0.5]
                }}
                exit={{ 
                  scaleX: 0, 
                  opacity: 0,
                  transition: { duration: 0.3, delay: 0.2 + (i * 0.02) }
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Corner brackets - fade out third */}
          {[
            { position: 'top-4 left-4', rotation: 0 },
            { position: 'top-4 right-4', rotation: 90 },
            { position: 'bottom-4 right-4', rotation: 180 },
            { position: 'bottom-4 left-4', rotation: 270 }
          ].map((corner, i) => (
            <motion.div
              key={`corner-${i}`}
              className={`absolute ${corner.position} w-6 h-6 border-t-2 border-l-2 border-cyan-400`}
              style={{
                transform: `rotate(${corner.rotation}deg)`,
                boxShadow: '0 0 8px rgba(0, 240, 255, 0.6)'
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ 
                opacity: 0, 
                scale: 0,
                transition: { duration: 0.25, delay: 0.4 + (i * 0.03) }
              }}
              transition={{
                duration: 0.4,
                delay: i * 0.05
              }}
            />
          ))}

        </motion.div>
      )}
    </AnimatePresence>
  );
};

HologramTransition.propTypes = {
  isActive: PropTypes.bool,
  onComplete: PropTypes.func,
  direction: PropTypes.oneOf(['forward', 'backward'])
};

export default HologramTransition;