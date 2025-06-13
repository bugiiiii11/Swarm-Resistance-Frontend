import { motion } from 'framer-motion';

const ApocalypticCitySection = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
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

      {/* Animated particles for atmosphere */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
              y: [0, -50, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Section content with proper centering */}
      <div className="relative z-10 min-h-screen w-full pt-16 md:pl-64">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
          
          {/* Title and subtitle section */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-3 text-phoenix-primary relative inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join the Fight
            </motion.h2>
            
            <motion.p 
              className="mt-2 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-phoenix-light/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              The resistance needs you. Step into the post-apocalyptic world and reclaim our future.
            </motion.p>
          </motion.div>

          {/* Main content area - centered */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {/* Featured content section */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                
                {/* Daily Rewards */}
                <motion.div
                  className="text-center p-6 rounded-lg backdrop-blur-md"
                  style={{
                    background: 'rgba(15, 15, 35, 0.6)',
                    border: '2px solid rgba(255, 140, 0, 0.3)',
                    boxShadow: '0 0 20px rgba(255, 140, 0, 0.2)'
                  }}
                  whileHover={{
                    y: -8,
                    boxShadow: '0 0 30px rgba(255, 140, 0, 0.4)'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-orbitron font-bold text-phoenix-primary mb-2">
                    Daily Rewards
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Earn Phoenix Essence daily through missions and activities
                  </p>
                </motion.div>

                {/* NFT Utility */}
                <motion.div
                  className="text-center p-6 rounded-lg backdrop-blur-md"
                  style={{
                    background: 'rgba(15, 15, 35, 0.6)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)'
                  }}
                  whileHover={{
                    y: -8,
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-orbitron font-bold text-resistance-light mb-2">
                    NFT Utility
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Deploy your Hero and Weapon NFTs in strategic combat
                  </p>
                </motion.div>

                {/* Token Airdrop */}
                <motion.div
                  className="text-center p-6 rounded-lg backdrop-blur-md"
                  style={{
                    background: 'rgba(15, 15, 35, 0.6)',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
                  }}
                  whileHover={{
                    y: -8,
                    boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-orbitron font-bold text-energy-green mb-2">
                    Token Airdrop
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Prepare for future token airdrops through Guardian ranks
                  </p>
                </motion.div>
              </div>

              {/* Call to action - Blue JOIN THE RESISTANCE button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                viewport={{ once: true }}
              >
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
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 30px rgba(59, 130, 246, 0.15)",
                    borderColor: "rgba(96, 165, 250, 1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Shimmer effect */}
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
                  
                  {/* Button text */}
                  <span 
                    className="relative z-10"
                    style={{
                      textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    JOIN THE RESISTANCE
                  </span>
                  
                  {/* Blue corner indicators */}
                  <motion.div
                    className="absolute top-2 left-2 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#60A5FA',
                      boxShadow: '0 0 8px rgba(96, 165, 250, 0.8)'
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div
                    className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#60A5FA',
                      boxShadow: '0 0 8px rgba(96, 165, 250, 0.8)'
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Copyright notice positioned 80px from bottom */}
          <motion.div 
            className="absolute bottom-24 left-0 right-0 text-center z-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            viewport={{ once: true }}
          >
            <div className="md:pl-64"> {/* Account for sidebar on desktop */}
              <p className="text-phoenix-primary/60 text-sm font-orbitron">
                ©2025 Swarm Resistance, All Rights Reserved
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ApocalypticCitySection;