import { motion } from 'motion/react';
import { Policy } from '../types';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
  index: number;
  onClick: () => void;
  isStacked?: boolean;
}

export function PolicyCard({ policy, index, onClick, isStacked = false }: PolicyCardProps) {
  const Icon = (Icons as any)[policy.icon] || Icons.Shield;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: isStacked ? -30 : 0 }}
      whileTap={{ scale: 0.98, y: isStacked ? -40 : 0 }}
      onClick={onClick}
      style={{ zIndex: index }}
      className={cn(
        "relative w-full rounded-[32px] p-6 cursor-pointer shadow-2xl overflow-hidden flex flex-col transition-all duration-300 border border-white/20",
        "bg-gradient-to-br",
        policy.color,
        isStacked ? "h-40" : "h-52"
      )}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/10">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-white text-[10px] font-black uppercase tracking-widest opacity-70 block mb-0.5">
                {policy.type} PASS
              </span>
              <h3 className="text-base font-black text-white leading-tight uppercase tracking-tight whitespace-nowrap">
                {policy.title}
              </h3>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {policy.status}
            </span>
          </div>
        </div>

        {!isStacked && (
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Policy Number</p>
              <p className="text-xs font-black text-white uppercase tracking-widest">
                YU-{policy.id}00-2024
              </p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                View Details
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Background Pattern/Logo */}
      <div className="absolute -bottom-6 -right-6 opacity-10">
        <Icon className="w-40 h-40 text-white" />
      </div>
    </motion.div>
  );
}
