import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Home } from './screens/Home';
import { PolicyDetail } from './screens/PolicyDetail';
import { Claims } from './screens/Claims';
import { Chat } from './screens/Chat';
import { Profile } from './screens/Profile';
import { Navigation } from './components/Navigation';
import { ChatBot } from './components/ChatBot';
import { Policy } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const handleMakeClaim = () => {
    setSelectedPolicy(null);
    setActiveTab('claims');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home onPolicyClick={setSelectedPolicy} />;
      case 'claims':
        return <Claims onBack={() => setActiveTab('home')} />;
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
