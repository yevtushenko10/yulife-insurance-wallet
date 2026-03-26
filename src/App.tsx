import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Home } from './screens/Home';
import { PolicyDetail } from './screens/PolicyDetail';
import { Claims } from './screens/Claims';
import { Chat } from './screens/Chat';
import { Profile } from './screens/Profile';
import { Navigation } from './components/Navigation';
import { ChatBot } from './components/ChatBot';
import { SplashScreen } from './components/SplashScreen';
import { Policy } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [customPolicies, setCustomPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleMakeClaim = () => {
    setSelectedPolicy(null);
    setActiveTab('claims');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home onPolicyClick={setSelectedPolicy} customPolicies={customPolicies} onCustomPoliciesChange={setCustomPolicies} />;
      case 'claims':
        return <Claims onBack={() => setActiveTab('home')} customPolicies={customPolicies} />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onPolicyClick={setSelectedPolicy} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#F5F5F0] min-h-screen relative overflow-x-hidden font-sans">
      <AnimatePresence>
        {showSplash && (
          <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPolicy && (
          <PolicyDetail
            policy={selectedPolicy}
            onBack={() => setSelectedPolicy(null)}
            onClaim={handleMakeClaim}
          />
        )}
      </AnimatePresence>

      <Navigation activeTab="home" setActiveTab={setActiveTab} />
    </div>
  );
}
