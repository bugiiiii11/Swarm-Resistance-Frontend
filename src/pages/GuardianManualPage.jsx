import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, Target, TrendingUp } from 'lucide-react';

const GuardianManualPage = () => {
  const sectionRef = useRef(null);
  const [activeSection, setActiveSection] = useState('vision');
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Enhanced parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const particlesY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  
  // Section definitions
  const sections = {
    vision: {
      id: 'vision',
      title: 'The Resistance Awakens',
      subtitle: 'Vision & Mission',
      icon: <Flame size={32} className="text-phoenix-primary" />,
      gradient: "from-phoenix-primary/20 via-phoenix-light/10 to-transparent",
      borderColor: "border-phoenix-primary/40",
      accentColor: "text-phoenix-primary",
      chapters: [
        {
          title: "Forge Your Legend",
          content: "The ancient prophecy spoke of a time when scattered survivors would unite not just to fight, but to forge something entirely new from the ashes of the old galaxy. That time is now. Swarm Resistance is an unprecedented experiment in community co-creation, where the most engaged Guardians help shape the very future they'll inhabit."
        },
        {
          title: "A New Kind of Resistance",
          content: "For too long, the gaming industry has operated under the old empire model: developers decree from their towers while players consume what they're given. But the Resistance operates differently. Here, your voice carries weight. Your ideas become reality. Your skills determine your rewards. This is what true ownership looks like when combined with epic storytelling and meaningful gameplay.\n\nSwarm Resistance represents the convergence of three revolutionary forces: the rich, thousand-year saga of the Cryptomeda universe, the emerging potential of Web3 technology, and the untapped creative power of passionate gaming communities. We're cultivating a living, breathing universe that evolves through the collective imagination and dedication of its Guardians."
        },
        {
          title: "The Co-Creation Experiment",
          content: "The most radical aspect of our approach is simple: we believe the best games are built alongside their communities, not in isolation from them. Every feature we develop, every story chapter we release, every system we implement is shaped by the feedback, creativity, and passion of active community members.\n\nThis represents active collaboration at its finest. When community members discover bugs and provide detailed console logs, they're rewarded with Meda Gas. When someone proposes a brilliant gameplay mechanic that we implement, they receive recognition and tokens. When an artist creates fan content that captures the spirit of the Resistance, we celebrate and compensate their contribution. When players dominate the leaderboards through skill and strategy, they earn both respect and rewards.\n\nThe founders retain final decision-making authority during this crucial building phase, but we actively seek, consider, and reward community input. Regular Telegram polls guide certain development choices, while our most engaged community members often provide the spark for our most innovative features."
        },
        {
          title: "Where Story Meets Innovation",
          content: "Consider the upcoming AI Commander feature—a sophisticated chatbot that will serve as your personal strategic assistant, guide, and lore repository. Rather than simply announcing this as a technical upgrade, we're weaving it into the very fabric of our narrative. In the Swarm Resistance universe, the AI Commander represents the holographic manifestation of the legendary hero Commander, awakened from the depths of Hero Artifact archives to serve as the ultimate tactical weapon against the Swarm.\n\nThis exemplifies our core philosophy: every new feature enriches the story, and every story development opens new gameplay possibilities. As we explore what happened during the thousand dark years of Swarm dominion, each revelation becomes a foundation for new missions, mechanics, and community experiences."
        },
        {
          title: "The Living Universe",
          content: "The Cryptomeda universe has been waiting a millennium for new heroes to write the next chapter. Through Swarm Resistance, that dormant universe awakens. Ancient defense systems come online. Long-lost Hero Artifacts resurface. Forgotten technologies merge with cutting-edge innovations.\n\nOur ancient Cryptomeda community may seem quiet now, but within these ranks hide the architects of the galaxy's return. Every Guardian who joins today becomes part of the foundational legend—the first wave of heroes who stood up when the galaxy's fate hung in the balance."
        },
        {
          title: "Your Resistance Begins",
          content: "This is your invitation to be part of something unprecedented. Whether you're drawn by the epic sci-fi narrative, excited by the Web3 innovation, or energized by the prospect of helping build the future of gaming, the Resistance has a place for you.\n\nYour skills on the battlefield matter. Your ideas for improving the experience matter. Your feedback on new features matters. Your art, your stories, your strategic insights—all of it contributes to the growing legend of the Resistance.\n\nThe Swarm believes the galaxy's inhabitants are finished, scattered and broken beyond repair. They're about to discover that our greatest strength was never our technology or our individual power—it was what we could accomplish when we decided to build something together.\n\nThe ancient heroes fought to give us this chance. The founders have laid the foundation. The technology stands ready.\n\nNow it's your turn. Be part of the Resistance from day one. Help us prove that when communities unite around a shared vision, they can create something far greater than any empire that came before.\n\nThe phoenix is stirring. Will you help it rise?"
        }
      ]
    },
    gaming: {
      id: 'gaming',
      title: 'Arsenal of Victory',
      subtitle: 'Gaming & Rewards',
      icon: <Target size={32} className="text-resistance-light" />,
      gradient: "from-resistance-light/20 via-resistance-glow/10 to-transparent",
      borderColor: "border-resistance-light/40",
      accentColor: "text-resistance-light",
      chapters: [
        {
          title: "Transformation of the Resistance",
          content: "The greatest transformation in galactic history began when Master CZ and Lunatic stood back-to-back against impossible odds, discovering that former enemies could forge something the Swarm couldn't consume. That same spirit of unity now drives every battle we plan, every territory we'll reclaim, and every new Guardian we welcome into our ranks."
        },
        {
          title: "The Power of United Forces",
          content: "For three millennia, Renegade cunning and Goliath discipline clashed across the stars. When the Swarm invasion began, legendary heroes Admiral Link and Commander broadcast the words that still guide us: \"Together, we become something they cannot consume.\" This discovery forms the foundation of everything we're building—a gaming ecosystem where individual excellence strengthens our collective resistance. The Resistance will offer multiple ways for Guardians to earn recognition and rewards through their unique talents."
        },
        {
          title: "Combat Excellence",
          content: "Meda Shooter will serve as our primary training ground, where your Hero Artifacts and Weapons come alive with purpose. Each legendary champion's crystallized essence will guide your aim while ancient weaponry adapts to your fighting style. Daily leaderboards will track the most skilled defenders, with Meda Gas flowing to those who demonstrate true combat mastery.\n\nPlanned tournaments will pit our finest warriors against champions from allied communities, creating moments of glory that echo through our halls. Victory will require understanding your Hero Artifacts' unique abilities, mastering weapon synergies, and developing the tactical awareness that separates legends from survivors."
        },
        {
          title: "Strategic Dominion",
          content: "Swarm Dominion will allow strategists to claim territories across the galaxy using Land Tickets. Each territory becomes a foundation for resource generation, where your NFT deployments determine daily Meda Gas production. The galaxy will operate under dynamic Swarm Threat Levels—periods of peace allowing maximum generation, while invasions demand active defense and community cooperation.\n\nFuture expansions will include defensive buildings, alliance coordination, and advanced territorial development. Your strategic vision will shape both individual success and collective security."
        },
        {
          title: "Community Power",
          content: "The most vital force multiplier comes through expanding our ranks. When you bring new Guardians to the Resistance, you fulfill the ancient call for reinforcements that echoes through our Chronicles. Each successful referral creates lasting bonds—as your referred Guardians achieve milestones, you continue earning Meda Gas from their accomplishments.\n\nRecruitment campaigns will activate during heightened Swarm activity, echoing the desperate broadcasts for aid that marked the early Resistance. Your network becomes our lifeline, with special bonuses recognizing those who bring three or more heroes to our cause."
        },
        {
          title: "Multiple Ways to Victory",
          content: "Every Guardian will find their calling among the many paths we're developing. Combat specialists will dominate leaderboards while earning daily rewards. Strategic minds will optimize territory production and coordinate community defenses. Network builders will expand our ranks through referrals and community growth. Creative visionaries will contribute ideas, art, and stories that shape our evolving universe.\n\nYour Hero Artifacts and Weapons provide the foundation, but your choices determine your legend. Whether you become known for lightning reflexes, strategic brilliance, community leadership, or innovative thinking, your story becomes part of the greater epic we're writing together.\n\nYour arsenal awaits. Your legend begins now."
        }
      ]
    },
    economics: {
      id: 'economics',
      title: 'The Economics of Liberation',
      subtitle: 'Development Roadmap',
      icon: <TrendingUp size={32} className="text-energy-purple" />,
      gradient: "from-energy-purple/20 via-cosmic-purple/10 to-transparent",
      borderColor: "border-energy-purple/40",
      accentColor: "text-energy-purple",
      chapters: [
        {
          title: "The Path Forward",
          content: "The ancient heroes understood that victory required more than courage—it demanded sustainable resources, strategic timing, and the wisdom to build strength before facing the ultimate test. Our economic foundation follows this same principle, progressing through two distinct phases that transform testing participants into the true owners of a thriving ecosystem."
        },
        {
          title: "Phase One: Forging the Foundation with Meda Gas",
          content: "The first phase represents our collective preparation for the real war ahead. During this crucial period, we build, test, and refine every system that will support our eventual victory. Meda Gas serves as our testing currency—a token with no monetary value but immense strategic importance as we prove our concepts and strengthen our community."
        },
        {
          title: "Building the Arsenal Together",
          content: "This phase focuses on creating the tools and systems that will define our resistance. Meda Shooter will serve as our combat training ground, while web3 integration ensures seamless access for Guardians across all backgrounds. Our website evolves into a true command center, housing expanded Chronicles and the AI Commander—a sophisticated chatbot embodying the wisdom of legendary heroes.\n\nSwarm Dominion enters its initial phase, allowing Guardians to assign NFTs for Meda Gas generation while testing the economic balance that will support millions of future participants. Challenges, missions, and mini-games provide diverse ways to earn rewards, while raffles add excitement and community building opportunities.\n\nEvery feature development responds to community feedback and voting. Guardians help prioritize which tools get built first, ensuring our limited development resources create maximum value for active participants. This collaborative approach ensures that when we launch officially, every system has been battle-tested by those who will depend on it most."
        },
        {
          title: "The Community-Powered Economy",
          content: "Traditional projects rely on venture capital and speculative trading. We're pioneering a different path—community-funded development where engaged users directly support the project while earning tokens that will gain value upon official launch. Through NFT purchases, premium accounts, tournament entries, and other platform activities paid in MATIC or USDT, our most dedicated Guardians become the primary funders of our shared vision.\n\nThis approach creates perfect alignment: those who contribute most to our development receive the largest token allocations, while proving the genuine demand that attracts additional strategic investment. Up to 20% of tokens remain available for venture capital, launchpads, or internal public sale, but the community maintains majority ownership from day one.\n\nStrong Meda Gas metrics and active community participation demonstrate our value to potential partners and investors. Every Guardian who joins, every feature request submitted, and every Meda Gas earned strengthens our position for the larger funding needed to complete our transformation."
        },
        {
          title: "Economic Testing and Refinement",
          content: "Meda Gas operates with identical functionality to our future Phoenix Essence economy, providing crucial testing for all economic mechanisms. NFT utility, reward distribution, marketplace transactions, and community governance all receive thorough validation during this phase. The forging system undergoes extensive testing, including the deflationary mechanisms that will maintain long-term token value through strategic burning during enhancement attempts.\n\nThis testing phase protects both community and project by identifying and resolving potential issues before significant value enters the system. Every economic decision, from reward rates to burning mechanisms, gets refined based on actual user behavior rather than theoretical projections."
        },
        {
          title: "Phase Two: Phoenix Essence Ascendant",
          content: "The second phase begins when our product reaches maturity, our community demonstrates sustained engagement, and we secure the funding necessary for legal compliance, operational scaling, and liquidity creation. This transition marks the true beginning of our economic ecosystem, where Meda Gas transforms into Phoenix Essence at a 1:1 ratio, instantly rewarding every Guardian who contributed to our foundation."
        },
        {
          title: "The Great Transformation",
          content: "Phase One participants receive the ultimate validation for their early support—their accumulated Meda Gas becomes valuable Phoenix Essence backed by genuine liquidity and utility. This transformation represents more than economic activation; it acknowledges that those who helped build our resistance deserve to benefit most from its success.\n\nPhoenix Essence serves multiple critical functions within our mature ecosystem. The forging system allows NFT enhancement and evolution, creating continuous utility and deflationary pressure through strategic token burning. Governance mechanisms enable community decision-making about future development priorities. Marketplace fees create sustainable revenue while maintaining the circular economy that benefits all participants."
        },
        {
          title: "Sustainable Growth Foundation",
          content: "The economic model established during testing scales naturally to support millions of Guardians. Multiple revenue streams—from premium features to marketplace commissions—create sustainability independent of token price speculation. The community treasury, funded through platform activities, ensures long-term development and adaptation capabilities.\n\nGovernance transitions to a fully decentralized model where Phoenix Essence holders guide major decisions about platform evolution, partnership selection, and resource allocation. This democratic approach ensures that growth benefits everyone while maintaining the unity principles that made our resistance possible."
        },
        {
          title: "Timeline and Milestones",
          content: "Our progression depends primarily on development speed, community growth, and fundraising success. With an outstanding product and engaged community, we create strong foundations for sustainable success. Community assistance accelerates development, while active participation demonstrates the demand that attracts strategic funding.\n\nThe transition timeline responds to achievement rather than arbitrary dates. When our systems prove robust, our community shows sustained engagement, and our funding enables proper launch support, we activate Phase Two with confidence that every participant will benefit from our collective preparation.\n\nCommunity voting continues to guide development priorities throughout both phases, ensuring that limited resources create maximum value for active Guardians. This collaborative approach means that every feature serves genuine user needs rather than theoretical requirements."
        }
      ]
    }
  };

  // Enhanced floating particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    delay: i * 0.2,
    duration: 8 + Math.random() * 4,
    size: 2 + Math.random() * 3,
    left: Math.random() * 100,
    color: i % 4 === 0 ? "#FF8C00" : i % 4 === 1 ? "#60A5FA" : i % 4 === 2 ? "#8B5CF6" : "#22C55E"
  }));

  // Phoenix fire particles
  const fireParticles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    delay: i * 0.8,
    duration: 5 + Math.random() * 3,
    left: 10 + Math.random() * 80,
  }));

  const currentSection = sections[activeSection];

  return (
    <div className="full-screen-section relative overflow-hidden bg-void-primary" ref={sectionRef}>
      {/* Background layers */}
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
        
        {/* Nebula overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-void-primary via-void-secondary to-void-primary" />
        <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/20 via-transparent to-void-primary/40" />
        <div className="absolute inset-0 bg-gradient-conic from-phoenix-primary/5 via-resistance-primary/5 to-energy-purple/5 opacity-30" />
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
            className="absolute fire-particle"
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
      <div className="relative z-10 min-h-screen w-full pt-16 md:pl-64">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
          
          {/* Title and subtitle section */}
          <motion.div 
            className="text-center mb-6 pt-8"
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
              Guardian Manual
            </motion.h2>
            
            <motion.p 
              className="mt-2 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-phoenix-light/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              The definitive guide to joining the Resistance—from vision and mission to economic 
              foundations and the path to victory against the Swarm.
            </motion.p>

            {/* Chapter Navigation */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
            >
              {/* Vision & Mission Button */}
              <motion.button
                className={`glass-phoenix px-6 py-3 rounded-lg border relative overflow-hidden group ${
                  activeSection === 'vision' 
                    ? 'border-phoenix-primary/40 bg-phoenix-primary/15' 
                    : 'border-phoenix-primary/20 hover:border-phoenix-primary/40'
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(255, 140, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection('vision')}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {activeSection === 'vision' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-phoenix-primary/20 via-phoenix-light/10 to-phoenix-primary/20 animate-pulse-phoenix" />
                )}
                
                <div className="relative flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activeSection === 'vision' ? 'bg-phoenix-primary animate-pulse-phoenix' : 'bg-phoenix-primary/50'
                  }`} />
                  <div className="text-left">
                    <div className="text-sm font-medium text-phoenix-primary font-orbitron">CHAPTER I</div>
                    <div className="text-lg font-bold text-stellar-white font-orbitron">Vision & Mission</div>
                  </div>
                  <div className="w-2 h-8 bg-gradient-to-b from-phoenix-primary to-phoenix-light rounded-full" />
                </div>

                {activeSection === 'vision' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.button>

              {/* Gaming & Rewards Button */}
              <motion.button
                className={`glass-resistance px-6 py-3 rounded-lg border relative overflow-hidden group ${
                  activeSection === 'gaming' 
                    ? 'border-resistance-light/40 bg-resistance-light/15' 
                    : 'border-resistance-light/20 hover:border-resistance-light/40'
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection('gaming')}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                {activeSection === 'gaming' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-resistance-light/20 via-resistance-glow/10 to-resistance-light/20 animate-pulse-resistance" />
                )}
                
                <div className="relative flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activeSection === 'gaming' ? 'bg-resistance-light animate-pulse-resistance' : 'bg-resistance-light/50'
                  }`} />
                  <div className="text-left">
                    <div className="text-sm font-medium text-resistance-light font-orbitron">CHAPTER II</div>
                    <div className="text-lg font-bold text-stellar-white font-orbitron">Gaming & Rewards</div>
                  </div>
                  <div className="w-2 h-8 bg-gradient-to-b from-resistance-light to-resistance-glow rounded-full" />
                </div>
              </motion.button>

              {/* Economics Button */}
              <motion.button
                className={`glass-void px-6 py-3 rounded-lg border relative overflow-hidden group ${
                  activeSection === 'economics' 
                    ? 'border-energy-purple/40 bg-energy-purple/15' 
                    : 'border-energy-purple/20 hover:border-energy-purple/40'
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection('economics')}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                {activeSection === 'economics' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-energy-purple/20 via-cosmic-purple/10 to-energy-purple/20 animate-pulse" />
                )}
                
                <div className="relative flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activeSection === 'economics' ? 'bg-energy-purple animate-pulse' : 'bg-energy-purple/50'
                  }`} />
                  <div className="text-left">
                    <div className="text-sm font-medium text-energy-purple font-orbitron">CHAPTER III</div>
                    <div className="text-lg font-bold text-stellar-white font-orbitron">Economics</div>
                  </div>
                  <div className="w-2 h-8 bg-gradient-to-b from-energy-purple to-cosmic-purple rounded-full" />
                </div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Main content area - Dynamic section content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div 
              className="space-y-12 max-w-6xl mx-auto relative z-10"
              key={activeSection}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Section Header */}
              <motion.div
                className={`relative rounded-xl overflow-hidden glass-void border ${currentSection.borderColor} mb-8`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${currentSection.gradient} opacity-50`} />
                
                <div className="relative p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                      <div className="w-16 h-16 flex items-center justify-center glass-phoenix rounded-xl mr-4 animate-pulse-phoenix">
                        {currentSection.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className={`text-3xl md:text-4xl font-bold ${currentSection.accentColor} mb-2 font-orbitron`}>
                        {currentSection.title}
                      </h2>
                      <h3 className="text-xl md:text-2xl text-gray-300 font-medium">
                        {currentSection.subtitle}
                      </h3>
                      <motion.div 
                        className={`h-1 bg-gradient-to-r from-${currentSection.accentColor.replace('text-', '')} to-transparent rounded-full mt-4`}
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Chapter Content */}
              {currentSection.chapters.map((chapter, index) => (
                <motion.article
                  key={index}
                  className={`relative rounded-xl overflow-hidden glass-void border ${currentSection.borderColor} group`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: `0 20px 60px -10px ${currentSection.borderColor.replace('border-', '').replace('/40', '')}40`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentSection.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                  
                  <div className="relative p-8 md:p-10">
                    <h3 className={`text-2xl md:text-3xl font-bold ${currentSection.accentColor} mb-6 font-orbitron`}>
                      {chapter.title}
                    </h3>
                    
                    <div className="space-y-6">
                      {chapter.content.split('\n\n').map((paragraph, pIndex) => (
                        <motion.p
                          key={pIndex}
                          className="text-gray-300 leading-relaxed text-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 + pIndex * 0.1 }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(120deg, transparent 30%, ${currentSection.borderColor.replace('border-', '').replace('/40', '')}20, transparent 70%)`
                    }}
                  />
                </motion.article>
              ))}
            </motion.div>

            {/* Call to Action section */}
            <motion.div
              className="mt-20 text-center relative z-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="glass-phoenix rounded-2xl p-12 md:p-16 relative overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-phoenix-primary/10 via-resistance-light/5 to-energy-purple/10" />
                
                <div className="relative">
                  <motion.h2 
                    className="text-4xl md:text-6xl font-bold text-stellar-white mb-6 font-orbitron"
                    animate={{ 
                      textShadow: [
                        "0 0 30px rgba(255, 140, 0, 0.7)",
                        "0 0 60px rgba(255, 140, 0, 0.9)",
                        "0 0 30px rgba(255, 140, 0, 0.7)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Join the Resistance
                    <motion.div 
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-phoenix-primary to-transparent rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 2 }}
                    />
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg md:text-xl text-phoenix-light/80 font-medium mb-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Your skills on the battlefield matter. Your ideas for improving the experience matter. 
                    Your feedback on new features matters. Join us in building the future of gaming.
                  </motion.p>

                  {/* CTA Buttons 
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <motion.button
                      className="btn-phoenix-primary text-lg px-8 py-4 font-orbitron"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 12px 30px rgba(255, 140, 0, 0.5)" 
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Playing Now
                    </motion.button>
                    
                    <motion.button
                      className="btn-resistance-secondary text-lg px-8 py-4 font-orbitron"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 12px 30px rgba(59, 130, 246, 0.3)" 
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Read Full Documentation
                    </motion.button>
                  </motion.div>
*/}
                  <motion.div 
                    className="mt-12 flex justify-center space-x-8 text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                      <span>Hero Artifacts: 4,023 </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-phoenix-primary animate-pulse" />
                      <span>Status: Phase One Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-resistance-light animate-pulse" />
                      <span>Meda Gas Rewards: Coming Soon</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Footer section */}
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-phoenix-primary/60 text-sm font-orbitron">
                ©2025 Swarm Resistance, All Rights Reserved
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianManualPage;