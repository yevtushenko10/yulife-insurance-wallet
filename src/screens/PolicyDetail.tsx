import { motion } from 'motion/react';
import { Policy } from '../types';
import { ChevronLeft, Shield, Info, AlertCircle, FileText, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { ChatBot } from '../components/ChatBot';

interface PolicyDetailProps {
  policy: Policy;
  onBack: () => void;
  onClaim: () => void;
}

export function PolicyDetail({ policy, onBack, onClaim }: PolicyDetailProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-yu-lime z-50 overflow-y-auto pb-12"
    >
      <div className={cn("h-72 p-6 flex flex-col justify-between text-white bg-gradient-to-br", policy.color)}>
        <div className="flex justify-between items-center pt-6">
          <button onClick={onBack} className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="bg-white/20 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest">{policy.status}</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
             <Shield className="w-4 h-4 text-white/80" />
             <span className="text-xs font-bold uppercase tracking-widest opacity-80">{policy.type} PASS</span>
          </div>
          <h1 className="text-4xl font-black leading-none">{policy.title}</h1>
          <p className="text-white/70 font-bold text-sm mt-2">YU-{policy.id}00-2024</p>
        </div>
      </div>

      <div className="px-4 -mt-10">
        <div className="yu-card p-6 space-y-8">
          {policy.provider && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl border border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider</p>
                <p className="text-lg font-black text-gray-800">{policy.provider}</p>
              </div>
              <div className="bg-gray-200 w-12 h-12 rounded-2xl flex items-center justify-center">
                <span className="text-gray-600 font-black text-sm">{policy.provider.slice(0,2).toUpperCase()}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-3xl border border-teal-100">
            <div className="bg-teal-500 p-2 rounded-2xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">AI Summary</p>
              <p className="text-sm text-gray-700 font-medium">This policy covers your {policy.type.toLowerCase()} needs with up to {policy.coverage} in benefits. 💙</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-yu-pink/10 p-2 rounded-xl">
                <Shield className="w-5 h-5 text-yu-pink" />
              </div>
              <h3 className="font-black text-gray-800 uppercase tracking-wide">What's Covered</h3>
            </div>
            <div className="grid gap-3">
              {policy.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5" />
                  <span className="text-sm text-gray-600 font-bold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-xl">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-black text-gray-800 uppercase tracking-wide">Exclusions</h3>
            </div>
            <div className="grid gap-3">
              {policy.exclusions.map((exclusion, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <Info className="w-5 h-5 text-orange-500 mt-0.5" />
                  <span className="text-sm text-gray-600 font-bold">{exclusion}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-black text-gray-800 uppercase tracking-wide">Documents</h3>
            </div>
            <div className="flex gap-3">
              <a
                href={policy.pdfUrl || "/yulife-policy-full-terms.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                download={policy.pdfUrl ? `${policy.title}.pdf` : "yulife-policy-full-terms.pdf"}
                className="flex-1 bg-gray-50 p-4 rounded-3xl text-center hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Policy</p>
                <p className="text-sm font-black text-gray-700">Full Terms</p>
              </a>
              <a
                href={policy.pdfUrl || "/yulife-ipid-key-facts.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                download={policy.pdfUrl ? `${policy.title}.pdf` : "yulife-ipid-key-facts.pdf"}
                className="flex-1 bg-gray-50 p-4 rounded-3xl text-center hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">IPID</p>
                <p className="text-sm font-black text-gray-700">Key Facts</p>
              </a>
            </div>
          </div>

          <button 
            onClick={onClaim}
            className="yu-button-primary w-full py-5 text-lg shadow-xl shadow-yu-pink/20"
          >
            Make a Claim
          </button>
        </div>
      </div>

      {/* ChatBot is only available here when a policy is selected */}
      <ChatBot />
    </motion.div>
  );
}
