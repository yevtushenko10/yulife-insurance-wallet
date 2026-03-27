import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import { loadPolicies, savePolicy, deletePolicy } from './lib/firestore';
import { Home } from './screens/Home';
import { PolicyDetail } from './screens/PolicyDetail';
import { Claims } from './screens/Claims';
import { Chat } from './screens/Chat';
import { Profile } from './screens/Profile';
import { Navigation } from './components/Navigation';
import { SplashScreen } from './components/SplashScreen';
import { AuthButton } from './components/AuthButton';
import { Policy } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [customPolicies, setCustomPolicies] = useState<Policy[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Splash timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Auth listener + load policies from Firestore when signed in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const saved = await loadPolicies(u.uid);
        setCustomPolicies(saved);
      } else {
        setCustomPolicies([]);
      }
    });
    return unsub;
  }, []);

  const handleAddPolicy = async (policy: Policy) => {
    setCustomPolicies(prev => [...prev, policy]);
    if (user) await savePolicy(user.uid, policy);
  };

  const handleDeletePolicy = async (policyId: string) => {
    setCustomPolicies(prev => prev.filter(p => p.id !== policyId));
    if (user) await deletePolicy(user.uid, policyId);
  };

  const handleMakeClaim = () => {
    setSelectedPolicy(null);
    setActiveTab('claims');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            onPolicyClick={setSelectedPolicy}
            customPolicies={customPolicies}
            onCustomPoliciesChange={setCustomPolicies}
            onAddPolicy={handleAddPolicy}
            onDeletePolicy={handleDeletePolicy}
            user={user}
          />
        );
      case 'claims':
        return <Claims onBack={() => setActiveTab('home')} customPolicies={customPolicies} />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <Home
            onPolicyClick={setSelectedPolicy}
            customPolicies={customPolicies}
            onCustomPoliciesChange={setCustomPolicies}
            onAddPolicy={handleAddPolicy}
            onDeletePolicy={handleDeletePolicy}
            user={user}
          />
        );
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

      {/* Auth button - top right corner */}
      {!showSplash && (
        <div className="fixed top-4 right-4 z-40 max-w-md" style={{ right: 'max(1rem, calc(50vw - 224px + 1rem))' }}>
          <AuthButton user={user} />
        </div>
      )}

      <Navigation activeTab="home" setActiveTab={setActiveTab} />
    </div>
  );
}
