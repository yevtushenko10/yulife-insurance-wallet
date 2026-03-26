import { motion } from 'motion/react';
import { USER_MOCK } from '../constants';
import { Award, Zap, TrendingUp, Settings, ChevronRight, LogOut, Heart, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

export function Profile() {
  return (
    <div className="min-h-screen bg-yu-lime pb-32">
      <div className="bg-yu-pink p-8 pt-16 rounded-b-[48px] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-[32px] bg-white/20 backdrop-blur-md p-1 mb-4 border border-white/10 shadow-xl">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${USER_MOCK.name}`}
              alt="Avatar"
              className="w-full h-full rounded-[28px] bg-white"
            />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">{USER_MOCK.name}</h1>
          <p className="text-white/80 font-bold uppercase tracking-widest text-xs mt-1">Level {USER_MOCK.level} Wellbeing Hero</p>

          <div className="mt-8 w-full bg-white/20 backdrop-blur-md rounded-[32px] p-6 border border-white/10">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest">Level Progress</span>
              <span className="text-xs font-black uppercase tracking-widest">{USER_MOCK.points} / 2000 pts</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden p-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(USER_MOCK.points / 2000) * 100}%` }}
                className="h-full bg-white rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>
        <Heart className="absolute -top-12 -left-12 w-48 h-48 text-white/10 -rotate-12" />
        <Shield className="absolute -bottom-12 -right-12 w-48 h-48 text-white/10 rotate-12" />
      </div>

      <div className="px-6 -mt-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="yu-card p-6 flex flex-col items-center text-center gap-2">
            <div className="bg-yu-pink/10 p-3 rounded-2xl">
              <Zap className="w-6 h-6 text-yu-pink" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{USER_MOCK.streak}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Day Streak</p>
          </div>
          <div className="yu-card p-6 flex flex-col items-center text-center gap-2">
            <div className="bg-teal-50 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-teal-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{USER_MOCK.points}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Points</p>
          </div>
        </div>

        <div className="yu-card p-6">
          <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">Your Badges</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {USER_MOCK.badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "flex-shrink-0 w-24 flex flex-col items-center gap-2",
                  !badge.unlocked && "opacity-40 grayscale"
                )}
              >
                <div className="w-20 h-20 rounded-[28px] bg-yu-lime flex items-center justify-center border border-white shadow-sm">
                  <Award className="w-10 h-10 text-yu-pink" />
                </div>
                <span className="text-[10px] font-black text-gray-600 text-center uppercase tracking-widest leading-tight">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="yu-card overflow-hidden">
          <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <Settings className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-black text-gray-700 uppercase tracking-widest text-xs">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
          <div className="h-[1px] bg-gray-50 mx-4" />
          <button className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-2xl">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-black text-gray-700 uppercase tracking-widest text-xs">Log Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
