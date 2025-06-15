import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Menu, X, ChevronDown, LogOut, User, Settings, Copy, Check } from 'lucide-react';
import { useWeb3Auth } from '../../contexts/Web3AuthContext';
import HologramTransition from '../effects/HologramTransition';

// Updated section navigation items with optimized names
const sectionItems = [
  { id: 'home', name: 'Headquarters', href: '#home' },
  { id: 'ecosystem', name: 'Mission', href: '#ecosystem' },
  { id: 'metrics', name: 'Intel', href: '#metrics' },
  { id: 'join', name: 'Recruit', href: '#join' },
];

// Page navigation items for hamburger menu
const pageItems = [
  { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  { name: 'Meda Shooter', path: '/meda-shooter', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 7L6 14L12 22L18 14L20 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )},
  { name: 'Resistance Hub', path: '/join-resistance', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  )},
  { name: 'Trading Hub', path: '/marketplace', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7L5 2H19L21 7" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 7H21V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V7Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )},
  { name: 'Lore', path: '/story', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15 8H21L16 12L18 20L12 16L6 20L8 12L3 8H9L12 2Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )},
  { name: 'Blog', path: '/blog', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 8H17M7 12H17M7 16H13" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )},
  { name: 'AI Commander', path: '/ai-commander', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1"/>
    </svg>
  )},
];

const TopBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Warp effect state
  const [isWarping, setIsWarping] = useState(false);
  const [warpDirection, setWarpDirection] = useState('forward');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Web3Auth hooks
  const { 
    isConnected, 
    user, 
    walletAddress,
    userProfile, 
    login, 
    logout, 
    isLoading,
    getBalance 
  } = useWeb3Auth();
  
  const [balance, setBalance] = useState("0");

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for section changes from HomePage
  useEffect(() => {
    const handleSectionChange = (event) => {
      const newSection = event.detail.section;
      if (newSection !== activeSection) {
        setActiveSection(newSection);
      }
    };

    window.addEventListener('sectionChange', handleSectionChange);
    return () => window.removeEventListener('sectionChange', handleSectionChange);
  }, [activeSection]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Fetch balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && getBalance) {
        try {
          const bal = await getBalance();
          setBalance(bal);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };
    fetchBalance();
  }, [isConnected, getBalance]);

  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy wallet address to clipboard
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (userProfile?.nickname) return userProfile.nickname;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'Guardian';
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (userProfile?.avatar && userProfile.avatar !== '/atom.png') return userProfile.avatar;
    if (user?.profileImage) return user.profileImage;
    return '/atom.png'; // Default avatar
  };

  // Get user rank with color
  const getUserRank = () => {
    if (userProfile?.rank) {
      return userProfile.rank;
    }
    return 'Explorer';
  };

  // Handle warp navigation - SIMPLIFIED AND MORE RELIABLE
  const handleWarpNavigation = (sectionId) => {
    // Prevent multiple warp transitions
    if (isWarping) return;
    
    console.log('Starting warp navigation to:', sectionId);
    
    // Only work on homepage
    if (location.pathname !== '/') {
      navigate('/');
      // Add a small delay to ensure navigation completes
      setTimeout(() => {
        triggerSectionNavigation(sectionId);
      }, 200);
      return;
    }
    
    triggerSectionNavigation(sectionId);
  };

  const triggerSectionNavigation = (sectionId) => {
    console.log('Triggering section navigation to:', sectionId);
    
    // Determine warp direction
    const currentIndex = sectionItems.findIndex(item => item.id === activeSection);
    const targetIndex = sectionItems.findIndex(item => item.id === sectionId);
    const direction = targetIndex > currentIndex ? 'forward' : 'backward';
    
    // Update active section immediately for visual feedback
    setActiveSection(sectionId);
    
    // Start warp effect
    setWarpDirection(direction);
    setIsWarping(true);
    
    console.log('Dispatching warp navigation event');
    
    // Dispatch warp navigation event to HomePage
    window.dispatchEvent(new CustomEvent('warpNavigation', { 
      detail: { section: sectionId } 
    }));
  };

  // Handle warp completion - SIMPLIFIED
  const handleWarpComplete = () => {
    console.log('Warp transition completed');
    setIsWarping(false);
  };

  return (
    <>
      <motion.header 
        className={`fixed top-0 right-0 left-0 z-50 glass-void ${isMobile ? 'h-16' : 'h-20'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className={`h-full flex items-center justify-between ${isMobile ? 'px-4' : 'px-6 lg:px-10'}`}>
          {/* Left Section - Mobile Menu + Logo */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button 
                className="text-stellar-white hover:text-phoenix-primary mr-3"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isWarping}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
            
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.img 
                src="/logo.png" 
                alt="Swarm Resistance" 
                className={`w-auto ${isMobile ? 'h-10' : 'h-14'}`}
                whileHover={{ 
                  scale: 1.05,
                  filter: "drop-shadow(0 0 12px rgba(255,140,0,0.6))"
                }}
              />
            </Link>
          </div>
          
          {/* Center Section - Navigation (Desktop) */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-10 absolute left-1/2 transform -translate-x-1/2" 
                 style={{ marginLeft: '8rem' }}> {/* Offset for sidebar */}
              {sectionItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleWarpNavigation(item.id)}
                  disabled={isWarping}
                  className={`relative text-lg lg:text-xl font-orbitron font-bold transition-all duration-300 ${
                    activeSection === item.id && location.pathname === '/' 
                      ? 'text-phoenix-primary text-shadow-phoenix' 
                      : 'text-stellar-white hover:text-phoenix-light'
                  } ${isWarping ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={{ 
                    y: isWarping ? 0 : -3,
                    textShadow: isWarping ? undefined : "0 0 12px rgba(255,140,0,0.8)"
                  }}
                >
                  {item.name}
                  
                  {/* Enhanced active indicator line */}
                  {activeSection === item.id && location.pathname === '/' && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-phoenix-primary shadow-phoenix rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Glowing line effect */}
                  {activeSection === item.id && location.pathname === '/' && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, var(--phoenix-primary), transparent)',
                        boxShadow: '0 0 8px rgba(255, 140, 0, 0.8)'
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
                  )}
                  
                  {/* Holographic hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-phoenix-primary/10 rounded-lg -z-10 -mx-2 -my-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ 
                      opacity: isWarping ? 0 : 1,
                      scale: isWarping ? 0.8 : 1,
                      boxShadow: isWarping ? undefined : "0 0 20px rgba(255,140,0,0.3)"
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              ))}
            </nav>
          )}
          
          {/* Right Section - Wallet Connection */}
          <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
            {isConnected ? (
              <div className="relative">
                <motion.button 
                  className="flex items-center space-x-2 group"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isWarping}
                >
                  <motion.div 
                    className="w-8 h-8 rounded-full border-2 border-phoenix-primary overflow-hidden"
                    whileHover={{ 
                      borderColor: "var(--phoenix-glow)",
                      boxShadow: "0 0 15px rgba(255,140,0,0.4)"
                    }}
                  >
                    <img 
                      src={getUserAvatar()} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {!isMobile && (
                    <div className="hidden lg:flex items-center">
                      <span className="text-sm lg:text-lg text-stellar-white font-medium mr-2">
                        {getUserDisplayName()}
                      </span>
                      <motion.div
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} className="text-neutral-light" />
                      </motion.div>
                    </div>
                  )}
                </motion.button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      className="absolute right-0 mt-3 w-72 rounded-lg shadow-lg py-3 z-50 border border-phoenix-primary/20"
                      style={{
                        background: 'rgba(15, 15, 35, 0.98)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                      }}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-phoenix-primary/20">
                        <p className="text-sm text-neutral-light">Guardian Status</p>
                        <p className="text-sm text-stellar-white font-medium truncate">
                          {user?.email || formatAddress(walletAddress)}
                        </p>
                        
                        {/* Rank */}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-neutral-light">Rank:</span>
                          <span className="text-sm font-orbitron font-bold text-phoenix-primary">
                            {getUserRank()}
                          </span>
                        </div>
                        
                        {/* Balance */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs text-neutral-light">Balance:</span>
                          <div className="flex items-center gap-1">
                            <Wallet size={12} className="text-resistance-light" />
                            <span className="text-xs text-stellar-white">
                              {parseFloat(balance).toFixed(4)} MATIC
                            </span>
                          </div>
                        </div>
                        
                        {/* Wallet Address */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs text-neutral-light">Address:</span>
                          <motion.button
                            onClick={copyAddress}
                            className="text-xs text-stellar-white hover:text-phoenix-primary transition-colors flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {formatAddress(walletAddress)}
                            {copied ? (
                              <Check size={10} className="text-success-green" />
                            ) : (
                              <Copy size={10} />
                            )}
                          </motion.button>
                        </div>
                        
                        {/* Meda Gas */}
                        {userProfile && (
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-neutral-light">Meda Gas:</span>
                            <span className="text-xs text-phoenix-primary font-bold">
                              {userProfile.medaGas?.toLocaleString() || 0}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Menu Items */}
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm lg:text-lg hover:bg-phoenix-primary/10 hover:text-phoenix-primary transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-2 px-4 py-2 text-sm lg:text-lg hover:bg-resistance-primary/10 hover:text-resistance-light transition-all"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <motion.button 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm lg:text-lg hover:bg-red-500/10 hover:text-red-400 transition-all"
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <LogOut size={16} />
                        Disconnect
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button 
                onClick={login}
                disabled={isLoading || isWarping}
                className={`hidden sm:flex items-center space-x-2 relative font-orbitron font-bold rounded-lg overflow-hidden ${
                  isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-lg'
                }`}
                style={{
                  background: 'linear-gradient(45deg, rgba(15, 35, 15, 0.95), rgba(34, 197, 94, 0.9))',
                  border: '2px solid rgba(34, 197, 94, 0.9)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.6), inset 0 0 15px rgba(34, 197, 94, 0.1)',
                  opacity: (isLoading || isWarping) ? 0.5 : 1
                }}
                whileHover={{ 
                  scale: (isLoading || isWarping) ? 1 : 1.05,
                  boxShadow: (isLoading || isWarping) ? undefined : "0 0 30px rgba(34, 197, 94, 0.8), inset 0 0 20px rgba(34, 197, 94, 0.15)"
                }}
                whileTap={{ scale: (isLoading || isWarping) ? 1 : 0.95 }}
              >
                {/* Green shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent rounded-lg"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <Wallet size={16} className="relative z-10" />
                
                <span 
                  className="font-bold relative z-10"
                  style={{
                    textShadow: '0 0 10px rgba(74, 222, 128, 0.8)'
                  }}
                >
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </span>
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Mobile Hamburger Menu */}
        <AnimatePresence>
          {mobileMenuOpen && isMobile && (
            <motion.div
              className="absolute top-16 left-0 right-0 border-b border-phoenix-primary/30 overflow-hidden"
              style={{
                background: 'rgba(15, 15, 35, 0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Navigation on Mobile */}
              {location.pathname === '/' && (
                <div className="border-b border-phoenix-primary/20 pb-3">
                  <div className="px-4 py-2">
                    <p className="text-xs font-orbitron font-bold text-phoenix-primary uppercase tracking-wide mb-2">
                      Sections
                    </p>
                  </div>
                  {sectionItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        handleWarpNavigation(item.id);
                        setMobileMenuOpen(false);
                      }}
                      disabled={isWarping}
                      className={`block w-full text-left px-6 py-3 text-lg font-orbitron font-bold transition-all ${
                        activeSection === item.id
                          ? 'text-phoenix-primary bg-phoenix-primary/10 border-l-4 border-phoenix-primary' 
                          : 'text-stellar-white hover:text-phoenix-light hover:bg-phoenix-primary/5'
                      } ${isWarping ? 'opacity-50 cursor-not-allowed' : ''}`}
                      whileHover={{ x: isWarping ? 0 : 6 }}
                      whileTap={{ scale: isWarping ? 1 : 0.98 }}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </div>
              )}
              
              {/* Page Navigation */}
              <div className="py-3">
                <div className="px-4 py-2">
                  <p className="text-xs font-orbitron font-bold text-resistance-light uppercase tracking-wide mb-2">
                    Navigate
                  </p>
                </div>
                {pageItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-6 py-3 text-lg font-medium transition-all ${
                      location.pathname === item.path
                        ? 'text-resistance-light bg-resistance-primary/10 border-l-4 border-resistance-light'
                        : 'text-stellar-white hover:text-resistance-light hover:bg-resistance-primary/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Wallet Section */}
              <div className="border-t border-phoenix-primary/20 px-4 py-4">
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-phoenix-primary overflow-hidden">
                          <img 
                            src={getUserAvatar()} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stellar-white">{getUserDisplayName()}</p>
                          <p className="text-xs text-neutral-light">{formatAddress(walletAddress)}</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-sm text-red-400 hover:text-red-300 px-2 py-1"
                        whileTap={{ scale: 0.95 }}
                        disabled={isWarping}
                      >
                        Disconnect
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => {
                      login();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isLoading || isWarping}
                    className="w-full flex items-center justify-center gap-3 py-3 btn-phoenix-primary disabled:opacity-50 text-sm"
                    whileTap={{ scale: (isLoading || isWarping) ? 1 : 0.95 }}
                  >
                    <Wallet size={16} />
                    <span className="font-semibold">
                      {isLoading ? 'Connecting...' : 'Connect Wallet'}
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255, 140, 0, 0.5), transparent)'
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.header>
      
      {/* Hologram Transition Effect */}
      <HologramTransition
        isActive={isWarping}
        direction={warpDirection}
        onComplete={handleWarpComplete}
      />
    </>
  );
};

export default TopBar;