import { motion } from 'motion/react';
import { PolicyCard } from '../components/PolicyCard';
import { POLICIES, USER_MOCK } from '../constants';
import { Policy } from '../types';
import { Bell, Menu, Coins, ChevronRight, Sparkles, Heart } from 'lucide-react';

interface HomeProps {
  onPolicyClick: (policy: Policy) => void;
}

export function Home({ onPolicyClick }: HomeProps) {
  return (
    <div className="min-h-screen bg-yu-lime pb-32">
      <header className="p-4 pt-10 flex justify-between items-center bg-yu-lime">
        <div className="flex gap-4">
          <Menu className="w-6 h-6 text-gray-600" />
          <Bell className="w-6 h-6 text-gray-600" />
        </div>
        
        <div className="bg-yu-pink w-8 h-8 rounded-md flex items-center justify-center">
          <span className="text-white font-black text-xs">yu</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-bold text-gray-700">{USER_MOCK.points}</span>
          <div className="bg-yu-yellow p-1 rounded-full shadow-sm">
            <Coins className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>

      <div className="px-6 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 leading-tight">
          {USER_MOCK.name}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          <div className="bg-teal-500/10 p-1 rounded-full">
            <Sparkles className="w-3 h-3 text-teal-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">Forest {USER_MOCK.level}</span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Yumoji Card */}
        <div className="yu-card p-6 relative overflow-hidden">
          <div className="relative z-10 max-w-[60%]">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Earn 100 <Coins className="w-4 h-4 inline text-yu-yellow" /> when you create your Yumoji.
            </h2>
            <button className="yu-button-primary text-sm py-2">
              Create Yumoji
            </button>
          </div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Yumoji" className="w-24 h-24" alt="Yumoji" />
          </div>
        </div>

        {/* Gift Card */}
        <div className="bg-indigo-600 rounded-[32px] p-6 text-white flex justify-between items-center">
          <p className="font-bold text-sm max-w-[60%]">
            Show your friends that you appreciate them with a little YuCoin gift.
          </p>
          <div className="bg-white/20 p-4 rounded-2xl">
            <GiftIcon className="w-8 h-8" />
          </div>
        </div>

        {/* Reflection Card */}
        <div className="yu-card p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-extrabold text-gray-800">Today's reflection</h2>
            <div className="bg-yu-pink p-2 rounded-full">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Keep reflecting to learn more about your health.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">Earn today: 120</span>
            <Coins className="w-4 h-4 text-yu-yellow" />
          </div>
        </div>

        {/* Wallet Section */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-12 px-2">
            <h2 className="text-xl font-extrabold text-gray-800">Your Wallet</h2>
            <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
               <div className="bg-orange-500 w-4 h-4 rounded-sm" />
               <span className="text-xs font-bold">Wallet</span>
            </div>
          </div>
          <div className="flex flex-col -space-y-20 pb-10">
            {POLICIES.map((policy, index) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                index={index}
                onClick={() => onPolicyClick(policy)}
                isStacked={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );
}
