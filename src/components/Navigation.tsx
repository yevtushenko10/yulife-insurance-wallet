import { motion } from 'motion/react';
import { Coins, Map as MapIcon, Heart, Trophy, Gift } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { id: 'yucoin', icon: Coins, label: 'YuCoin' },
    { id: 'quests', icon: MapIcon, label: 'Quests' },
    { id: 'home', icon: Heart, label: 'Yu' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'rewards', icon: Gift, label: 'Rewards' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 pb-6 z-40">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => tab.id === 'home' ? setActiveTab(tab.id) : undefined}
              disabled={tab.id !== 'home'}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 min-w-[64px]",
                isActive ? "text-yu-pink" : "text-gray-300",
                tab.id !== 'home' && "cursor-default opacity-50"
              )}
            >
              <div className={cn(
                "p-1 rounded-2xl transition-all duration-300",
                isActive && "bg-yu-pink/5"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "fill-yu-pink/10")} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="w-1 h-1 bg-yu-pink rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
