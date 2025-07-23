import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Import Web3Auth Provider
import { Web3AuthProvider } from './contexts/Web3AuthProvider';

// Import Components
import Sidebar from './components/navigation/Sidebar';
import TopBar from './components/navigation/TopBar';
import OptimizedGpuBackground from './components/effects/OptimizedGpuBackground';
import NeuralNetworkSync from './components/effects/NeuralNetworkSync';

// Import Live Pages
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import StoryPage from './pages/StoryPage';
import MedaShooterPage from './pages/MedaShooterPage';
import SettingsPage from './pages/SettingsPage';
import MobileRestrictedPage from './pages/MobileRestrictedPage';
import GuardianManualPage from './pages/GuardianManualPage';

// Import Coming Soon Pages
import BlogPage from './pages/BlogPage';
import AICommanderPage from './pages/AICommanderPage';
import JoinResistanceComingSoonPage from './pages/JoinResistanceComingSoonPage';
import MarketplacePage from './pages/MarketplacePage';

// Import ChatbotPage if you want to keep it accessible
// import ChatbotPage from './pages/ChatbotPage';

// Mobile detection function
const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile user agents
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
  const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
  
  // Check for screen size (tablets and small screens)
  const isSmallScreen = window.innerWidth <= 1024 || window.innerHeight <= 768;
  
  // Check for touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return isMobileUserAgent || (isSmallScreen && isTouchDevice);
};

// Main App Wrapper
function App() {
  return (
    <Web3AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </Web3AuthProvider>
  );
}

// Content component with access to location
function AppContent() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  // Check if device is mobile on mount and resize
  useEffect(() => {
    const checkDevice = () => {
      const mobile = isMobileDevice();
      setIsMobile(mobile);
      setIsChecking(false); // Mark compatibility check as done
    };

    // Initial check
    checkDevice();

    // Ensure minimum loading duration (2.8s to match our animation)
    const minLoadingTimer = setTimeout(() => {
      setIsLoadingComplete(true);
    }, 2800);

    // Listen for resize events (orientation changes, etc.)
    const handleResize = () => {
      if (!isChecking) { // Only update if not in loading state
        const mobile = isMobileDevice();
        setIsMobile(mobile);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(minLoadingTimer);
    };
  }, [isChecking]);

  useEffect(() => {
    // Detect if device might have performance issues
    const isLowPerfDevice = window.navigator.hardwareConcurrency < 4 || 
                            /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isLowPerfDevice) {
      document.documentElement.style.setProperty('--animation-speed', '0.7'); // 70% speed
      document.documentElement.style.setProperty('--animation-complexity', 'reduced');
    } else {
      document.documentElement.style.setProperty('--animation-speed', '1');
      document.documentElement.style.setProperty('--animation-complexity', 'full');
    }
  }, []);

  // Show loading while checking device type OR during minimum loading duration
  if (isChecking || !isLoadingComplete) {
    return (
      <div className="min-h-screen bg-void-primary relative">
        <OptimizedGpuBackground />
        <NeuralNetworkSync 
          isActive={true} 
          onComplete={() => {}} // No action needed, will auto-complete when isChecking becomes false
          direction="forward"
        />
      </div>
    );
  }

  // Show mobile restriction page for mobile devices
  if (isMobile) {
    return (
      <div className="app relative min-h-screen">
        <OptimizedGpuBackground />
        <MobileRestrictedPage />
      </div>
    );
  }

  // Check if current route should have full-screen layout (no margins/padding)
  const isFullScreenRoute = [
    '/', 
    '/meda-shooter',
    '/story',
    '/blog',
    '/whitepaper'
  ].includes(location.pathname);

  // Desktop experience for non-mobile devices
  return (
    <div className="app relative min-h-screen">
      <OptimizedGpuBackground />
      
      {/* Desktop Sidebar - always expanded */}
      <Sidebar />
      
      {/* Top Navigation Bar */}
      <TopBar />
      
      {/* Main Content - conditional margins based on route */}
      <main className={`transition-all duration-400 ${
        isFullScreenRoute
          ? '' 
          : 'md:ml-64 pt-16 pb-20 px-4 sm:px-6 md:px-8'
      }`}>
        <Routes>
          {/* Live Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/meda-shooter" element={<MedaShooterPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/whitepaper" element={<GuardianManualPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Coming Soon Pages - Now Active */}
          <Route path="/join-resistance" element={<JoinResistanceComingSoonPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/ai-commander" element={<AICommanderPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          
          {/* Hidden/Future routes - uncomment when ready to release
          <Route path="/chatbot" element={<ChatbotPage />} />
          */}
        </Routes>
      </main>
    </div>
  );
}

export default App;