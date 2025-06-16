import { motion } from 'framer-motion';
import { Wallet, Gamepad2, Trophy, Zap } from 'lucide-react';
import FlyingShip from '../effects/FlyingShip';
import SectionWrapper from '../layout/SectionWrapper';

const OnboardingSteps = () => {
  // Steps data - updated for new users
  const steps = [
    {
      number: "01",
      icon: <Wallet size={24} className="text-neon-cyan" />,
      title: "CONNECT WALLET",
      description: "Link your Web3 wallet or create one instantly to get started",
      color: "from-neon-cyan/20 to-transparent"
    },
    {
      number: "02",
      icon: <Gamepad2 size={24} className="text-meda-gold" />,
      title: "EXPLORE GAMES",
      description: "Jump into our 2D shooter or discover Telegram games in our hub",
      color: "from-meda-gold/20 to-transparent"
    },
    {
      number: "03",
      icon: <Trophy size={24} className="text-nebula-pink" />,
      title: "EARN REWARDS",
      description: "Complete challenges and tournaments to earn Meda Gas and NFTs",
      color: "from-nebula-pink/20 to-transparent"
    },
    {
      number: "04",
      icon: <Zap size={24} className="text-energy-green" />,
      title: "BUILD EMPIRE",
      description: "Collect NFTs, claim lands, and become a multiverse legend",
      color: "from-energy-green/20 to-transparent"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <SectionWrapper
      title="Join the Resistance"
      subtitle="Ready to start your fight to save the universe? Here's how to become part of the fight against the Swarm enemies."
      className="relative overflow-hidden"
    >
      <div className="flex-1 flex flex-col justify-center">
        {/* Flying ships - reduced and positioned higher */}
        <FlyingShip 
          delay={0} 
          speed={10} 
          yPosition="20%" 
          size="80px" 
          direction="ltr"
          color="#FF3E8A"
        />
        
        <FlyingShip 
          delay={3000} 
          speed={12} 
          yPosition="35%" 
          size="60px" 
          direction="rtl"
          color="#FFB61E"
        />
        
        {/* Compact Steps Grid */}
        <motion.div 
          className="max-w-5xl mx-auto mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="glassmorphism rounded-lg p-4 hover:border-neon-cyan/30 transition-all duration-300 group"
                variants={itemVariants}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center">
                  {/* Step number */}
                  <div className="bg-void-black/60 px-3 py-2 rounded-lg border border-cosmic-purple/30 mr-4">
                    <span className="text-lg font-bold font-jetbrains bg-gradient-to-b from-stellar-white to-gray-400 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <motion.div 
                    className="w-10 h-10 mr-3 flex items-center justify-center bg-void-black/50 rounded-lg border border-cosmic-purple/30 group-hover:border-neon-cyan/50 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-1 text-stellar-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-xs">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Progress indicator */}
                <motion.div 
                  className="h-0.5 bg-gradient-to-r from-transparent via-meda-gold to-transparent mt-3"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.1 * index }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA Button */}
        <div className="text-center mb-6">
          <motion.button 
            className="btn-primary-glass text-base px-6 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </div>

                      {/* Bottom section - Key benefits */}
              <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
                <div className="glassmorphism p-4 rounded-lg">
                  <h4 className="text-energy-green font-bold mb-2">Daily Rewards</h4>
                  <p className="text-gray-400 text-sm">Login bonuses, mini-games, and tasks provide consistent Meda Gas earnings</p>
                </div>
                <div className="glassmorphism p-4 rounded-lg">
                  <h4 className="text-meda-gold font-bold mb-2">NFT Utility</h4>
                  <p className="text-gray-400 text-sm">Deploy Heroes and Weapons in Meda Wars for passive Meda Gas generation</p>
                </div>
                <div className="glassmorphism p-4 rounded-lg">
                  <h4 className="text-nebula-pink font-bold mb-2">Token Airdrop</h4>
                  <p className="text-gray-400 text-sm">Meda Gas accumulation directly determines your future token allocation</p>
                </div>
              </div>

        {/* Footer text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">©2025 Swarm Resistance. Built by the players, for the players.</p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default OnboardingSteps;