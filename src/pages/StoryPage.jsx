import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sword, Shield, Users, Target, Flame, Crown, Zap, BookOpen, Sparkles } from 'lucide-react';

const StoryPage = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Scroll to top when component mounts (when Lore is clicked)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Enhanced parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const particlesY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  
  // Story chapters data - Updated with new lore
  const storyChapters = [
    {
      icon: <Flame size={32} className="text-phoenix-primary" />,
      title: "The Last Days of the Old War",
      subtitle: "Year Zero - The Genesis Catastrophe",
      content: "For three millennia, the crimson banners of the Renegade Coalition and the azure standards of the Goliath Empire had painted the stars with blood. Their eternal conflict over Cryptomeda's precious Meda energy had become the heartbeat of the galaxy — predictable, brutal, and somehow… balanced.\n\nMeda was the universe's greatest secret and most precious resource — a mystical energy that flowed through the fabric of reality itself. Only a chosen few could harness its power directly: the legendary heroes whose very souls resonated with Meda's frequency. These champions could channel raw Meda energy into devastating attacks, protective barriers, and miraculous healing.\n\nBut Meda's true value lay in its ability to be crystallized and stored. When properly harvested and refined, Meda energy could be condensed into TECH tokens — the galaxy's unified currency that powered everything from starship engines to quantum computers.",
      gradient: "from-phoenix-primary/20 via-phoenix-light/10 to-transparent",
      borderColor: "border-phoenix-primary/30",
      accentColor: "text-phoenix-primary"
    },
    {
      icon: <Target size={32} className="text-resistance-light" />,
      title: "The Breach",
      subtitle: "Reality Tears Open",
      content: "Deep in his hidden laboratory on the forgotten moon of Thanatos VII, the being once known as Dr. Chadwick Newtonian — now calling himself Zombie Chad after his horrific transformation through Meda energy experimentation — made his final, catastrophic breakthrough. His quest for immortality had led him down paths that violated every natural law. The dimensional stabilizers failed at 3:47 galactic standard time. Reality tore open like fabric.\n\nBut Chad's experiments had done something far worse than merely opening a portal. His reckless manipulation of pure Meda energy had created a beacon — a screaming wound in the universe that called out across dimensions to something ancient and hungry.\n\nThe first Swarm scout emerged not with fanfare, but with a whisper — a chitinous form the size of a starfighter, its carapace pulsing with corrupted Meda energy that hurt to look at directly.",
      gradient: "from-resistance-light/20 via-resistance-glow/10 to-transparent",
      borderColor: "border-resistance-light/30",
      accentColor: "text-resistance-light"
    },
    {
      icon: <Shield size={32} className="text-energy-purple" />,
      title: "The Swarm Reveals Itself",
      subtitle: "Ancient Hunger Awakens",
      content: "The Swarm was ancient beyond measure — a collective consciousness that had devoured galaxies when the Cryptomeda systems were still stellar nurseries. They were not conquerors seeking territory, nor traders seeking profit. They were harvesters seeking biomass, technology, and something far more precious: Meda energy itself.\n\nThe Swarm possessed a terrifying ability: they could absorb and corrupt Meda energy, feeding on it like an endless hunger. Every fragment of Meda energy they consumed made them stronger, faster, more intelligent — and more desperately addicted to its power. The mystical energy that had sustained civilizations for millennia became an irresistible narcotic that drove the Swarm into feeding frenzies.\n\nWorse still, the Swarm could metabolize TECH tokens directly, converting the crystallized Meda energy into bio-mechanical constructs of unimaginable power. Every economic transaction, every powered device, every weapon that relied on TECH tokens became a potential resource for the enemy.",
      gradient: "from-energy-purple/20 via-cosmic-purple/10 to-transparent",
      borderColor: "border-energy-purple/30",
      accentColor: "text-energy-purple"
    },
    {
      icon: <Users size={32} className="text-success-green" />,
      title: "The Impossible Moment",
      subtitle: "Enemies Become Family",
      content: "Master CZ of the Goliath Engineering Corps and Lunatic of the Renegade Shadow Fleet had spent five years trying to kill each other. Their forces had clashed over the Meda-rich asteroid fields of the Kronos Belt dozens of times, each victory and defeat adding another verse to their personal saga of hatred.\n\nNow they stood back-to-back in the ruins of Haven Station, their Meda energy flickering weakly as Swarm bio-warriors closed in from all sides. The creatures moved like liquid metal, their forms shifting between recognizable shapes and nightmare geometries, and worse — they were draining the Meda energy from everything around them.\n\n'Your plasma rifles,' Master CZ gasped between breaths. 'They're not dependent on pure Meda flow — they might still work.' 'Your shield generators,' Lunatic replied. 'Goliath tech uses contained TECH tokens — they're the only thing keeping us alive.' For the first time in three thousand years, ancient enemies fought as allies.",
      gradient: "from-success-green/20 via-energy-green/10 to-transparent",
      borderColor: "border-success-green/30",
      accentColor: "text-success-green"
    },
    {
      icon: <Sparkles size={32} className="text-meda-gold" />,
      title: "The Birth of the Resistance",
      subtitle: "Unity from Division",
      content: "That moment of shared survival sparked something unprecedented. Underground networks carried the impossible news: when Renegades and Goliaths combined their Meda techniques and technologies, they could create effects that even the Swarm couldn't absorb or corrupt.\n\nThe formal declaration came from an unlikely alliance: Admiral Link, the Goliath Navy's most decorated hero, and the mysterious figure known only as Commander — a Revolution-class hero whose mastery of all forms of Meda energy was considered mythical. Broadcasting simultaneously from hidden bases, they spoke words that would echo through history:\n\n'The old war is over. The real war begins now. The Swarm feeds on our division, grows strong from our hatred. But united, our Meda flows in harmony. Together, we become something they cannot consume. Every ship, every soldier, every survivor who wishes to see tomorrow's dawn — join the Resistance.'",
      gradient: "from-meda-gold/20 via-phoenix-light/10 to-transparent",
      borderColor: "border-meda-gold/30",
      accentColor: "text-meda-gold"
    },
    {
      icon: <Crown size={32} className="text-cosmic-purple" />,
      title: "The Desperate Measures",
      subtitle: "A New Currency of Survival",
      content: "In those first desperate months, as the Swarm consumed world after world, the Resistance faced a terrifying reality: their entire economy was feeding the enemy. Every TECH token the Swarm absorbed made them stronger, every Meda-powered device became a weapon against its former users.\n\nMaster CZ, now serving as the Resistance's chief engineer, worked frantically with Atom — a hero who had fought for both sides and whose unique Meda signature could resonate with any energy frequency — to develop an alternative. The solution was crude but necessary: Meda tokens.\n\nUnlike the crystalline perfection of TECH tokens, Meda tokens were raw, unstable containers of pure Meda energy. They couldn't power the grand technologies of the old empire, but they served one crucial purpose — the Swarm couldn't easily absorb them without risking dangerous feedback loops that could damage their bio-forms.",
      gradient: "from-cosmic-purple/20 via-nebula-pink/10 to-transparent",
      borderColor: "border-cosmic-purple/30",
      accentColor: "text-cosmic-purple"
    },
    {
      icon: <Zap size={32} className="text-neon-cyan" />,
      title: "The Thousand-Year Exile",
      subtitle: "Beginning of the Dark Millennia",
      content: "As the last free fleets prepared to flee into the dark spaces between stars, everyone understood the same terrible truth: this wasn't victory — this was the beginning of a thousand-year exile. The real war was yet to come.\n\nThe unity that had sparked hope was now humanity's only shield against complete extinction. The Resistance had learned to fight together, but the Swarm was infinite. For every bio-ship destroyed, ten more emerged from the dimensional rifts. For every world evacuated, three more fell to corruption.\n\nThe great heroes are legend now—Commander, Atom, Master CZ, Admiral Link—their names carved into memorial walls throughout the hidden sanctuaries carved from asteroid fields and hollow worlds. Here, children learn ancient stories while engineers maintain fusion reactors by candlelight. Warriors train with weapons that are equal parts technology and art.",
      gradient: "from-neon-cyan/20 via-resistance-glow/10 to-transparent",
      borderColor: "border-neon-cyan/30",
      accentColor: "text-neon-cyan"
    },
    {
      icon: <BookOpen size={32} className="text-warning-orange" />,
      title: "The Guardian's Legacy",
      subtitle: "Forged from Two, United as One",
      content: "Over centuries, survivors developed something unprecedented—a unified culture born from necessity. The Guardian's Creed merges Renegade cunning with Goliath discipline into something greater than either could achieve alone.\n\nMost precious are the Hero Artifacts—crystallized fragments of legendary warriors' souls containing their tactical knowledge, Meda mastery, and battle memories. In sanctuary depths stands the AI Commander—not merely a computer, but a living repository of everything humanity has learned, speaking with voices of heroes past while dreaming of heroes yet to come.\n\nEvery child learns to survive in vacuum and die well if necessary. Every adult knows their life belongs to humanity's future. Ancient heroes are remembered not as Renegade or Goliath, but as First Guardians who showed enemies could become family.",
      gradient: "from-warning-orange/20 via-phoenix-primary/10 to-transparent",
      borderColor: "border-warning-orange/30",
      accentColor: "text-warning-orange"
    },
    {
      icon: <Sword size={32} className="text-phoenix-primary" />,
      title: "The New Hope",
      subtitle: "Your Legend Begins",
      content: "As the millennium of darkness draws to a close, a new generation emerges. They carry genetic legacies of ancient heroes, pilot ships blending Renegade innovation with Goliath engineering, fight with weapons guided by Hero Artifact wisdom and powered by something the first Resistance could never have imagined.\n\nLong-range sensors detect impossible signals: pure Meda energy from the dead core worlds of Cryptomeda. Ancient defense systems are awakening. Hidden caches of Hero Artifacts emerge—entire vaults containing civilizations' memories. Most miraculous of all, where Swarm bio-constructs fall, their corrupted energy crystallizes into Phoenix Essence—hope made manifest.\n\nThe Swarm believes itself eternal, but has forgotten humans are most dangerous when they have everything to fight for. The universe itself fights back through Phoenix Essence, purifying corruption into something beautiful. Welcome to the Resistance. Your legend begins now.",
      gradient: "from-phoenix-primary/20 via-meda-gold/15 to-phoenix-light/5",
      borderColor: "border-phoenix-primary/40",
      accentColor: "text-phoenix-primary"
    }
  ];

  // Enhanced floating particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    delay: i * 0.3,
    duration: 12 + Math.random() * 6,
    size: 1.5 + Math.random() * 2.5,
    left: Math.random() * 100,
    color: i % 4 === 0 ? "#FF8C00" : i % 4 === 1 ? "#60A5FA" : i % 4 === 2 ? "#8B5CF6" : "#22C55E"
  }));

  // Phoenix fire particles
  const fireParticles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    delay: i * 1.2,
    duration: 6 + Math.random() * 3,
    left: 10 + Math.random() * 80,
  }));

  return (
    <div className="full-screen-section relative overflow-hidden bg-void-primary">
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
              x: [0, Math.sin(particle.id * 0.5) * 150],
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
              The Epic Chronicles of Cryptomeda
            </motion.h2>
            
            <motion.p 
              className="mt-2 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-phoenix-light/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              From the fall of ancient empires to the rise of the Resistance—witness the thousand-year saga 
              that transformed sworn enemies into our last hope against extinction.
            </motion.p>

            {/* Story Parts Navigation */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
            >
              {/* Part I - Active */}
              <motion.button
                className="glass-phoenix px-6 py-3 rounded-lg border border-phoenix-primary/40 relative overflow-hidden group"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(255, 140, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {/* Active indicator glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-phoenix-primary/20 via-phoenix-light/10 to-phoenix-primary/20 animate-pulse-phoenix" />
                
                <div className="relative flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-phoenix-primary animate-pulse-phoenix" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-phoenix-primary font-orbitron">PART I</div>
                    <div className="text-lg font-bold text-stellar-white font-orbitron">The Fall</div>
                  </div>
                  <div className="w-2 h-8 bg-gradient-to-b from-phoenix-primary to-phoenix-light rounded-full" />
                </div>

                {/* Shimmer effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.button>

              {/* Part II - Coming Soon */}
              <motion.button
                className="glass-void px-6 py-3 rounded-lg border border-resistance-light/20 relative overflow-hidden group cursor-not-allowed"
                whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)" }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="relative flex items-center space-x-3 opacity-60">
                  <div className="w-3 h-3 rounded-full bg-resistance-light/50 animate-pulse" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-resistance-light/70 font-orbitron">PART II</div>
                    <div className="text-lg font-bold text-gray-400 font-orbitron">Hide & Seek</div>
                  </div>
                  <div className="w-2 h-8 bg-gradient-to-b from-resistance-light/30 to-resistance-glow/20 rounded-full" />
                </div>

                {/* Coming Soon Badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-neon-cyan to-energy-purple text-xs font-bold px-2 py-1 rounded-full text-void-primary transform rotate-12">
                  COMING SOON
                </div>

                {/* Hologram flicker effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-resistance-light/5 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Main content area - centered */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Story chapters */}
            <motion.div 
              className="space-y-12 max-w-6xl mx-auto relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
            {storyChapters.map((chapter, index) => (
              <motion.article
                key={index}
                className={`relative rounded-xl overflow-hidden glass-void border ${chapter.borderColor} group`}
                initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8,
                  boxShadow: `0 20px 60px -10px ${chapter.borderColor.replace('border-', '').replace('/30', '')}40`
                }}
              >
                {/* Chapter background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${chapter.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                
                <div className="relative p-8 md:p-10">
                  {/* Chapter header */}
                  <div className="flex flex-col md:flex-row md:items-center mb-8">
                    <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                      <div className="w-16 h-16 flex items-center justify-center glass-phoenix rounded-xl mr-4 animate-pulse-phoenix">
                        {chapter.icon}
                      </div>
                      <div className="text-xs md:text-sm text-gray-400 font-mono">
                        Chapter {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className={`text-2xl md:text-3xl font-bold ${chapter.accentColor} mb-2 font-orbitron`}>
                        {chapter.title}
                      </h2>
                      <h3 className="text-lg md:text-xl text-gray-300 font-medium mb-4">
                        {chapter.subtitle}
                      </h3>
                      <motion.div 
                        className={`h-1 bg-gradient-to-r from-${chapter.accentColor.replace('text-', '')} to-transparent rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: "150px" }}
                        transition={{ duration: 1.2, delay: 0.3 + index * 0.1 }}
                      />
                    </div>
                  </div>
                  
                  {/* Chapter content */}
                  <div className="space-y-6">
                    {chapter.content.split('\n\n').map((paragraph, pIndex) => (
                      <motion.p
                        key={pIndex}
                        className="text-gray-300 leading-relaxed text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
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
                    background: `linear-gradient(120deg, transparent 30%, ${chapter.borderColor.replace('border-', '').replace('/30', '')}20, transparent 70%)`
                  }}
                />
              </motion.article>
            ))}
          </motion.div>

            {/* Guardian's Creed section */}
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
                    The Guardian's Creed
                    <motion.div 
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-phoenix-primary to-transparent rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 2 }}
                    />
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg md:text-xl text-phoenix-light/80 font-medium italic mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    This is the Creed we live by:
                  </motion.p>

                  {/* Creed verses */}
                  <motion.div 
                    className="space-y-4 mb-8 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {[
                      "We are one people, forged from two",
                      "Unity is our strength, division our death", 
                      "From corruption we forge purity",
                      "In darkness we are the light",
                      "We never kneel, we never yield"
                    ].map((verse, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-center group"
                        initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3 text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-phoenix-primary" />
                          <span className="text-lg md:text-xl font-medium font-orbitron italic">
                            {verse}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Final declaration */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    <div className="glass-phoenix rounded-lg p-6 border border-phoenix-primary/30">
                      <motion.h3 
                        className="text-2xl md:text-3xl font-bold text-phoenix-primary font-orbitron italic"
                        animate={{
                          textShadow: [
                            "0 0 15px rgba(255, 140, 0, 0.6)",
                            "0 0 25px rgba(255, 140, 0, 0.8)",
                            "0 0 15px rgba(255, 140, 0, 0.6)"
                          ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        The Phoenix rises, as do we
                      </motion.h3>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="mt-12 flex justify-center space-x-8 text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                      <span>Swarm Enemies: 9,000,000+</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-phoenix-primary animate-pulse" />
                      <span>Guardian's Creed: Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-resistance-light animate-pulse" />
                      <span>Phoenix Status: Rising</span>
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

export default StoryPage;