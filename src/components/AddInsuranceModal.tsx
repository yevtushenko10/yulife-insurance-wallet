import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileText, Car, Home, Plane, PawPrint, Shield } from 'lucide-react';
import { Policy } from '../types';

interface AddInsuranceModalProps {
  onClose: () => void;
  onAdd: (policy: Policy) => void;
}

const INSURANCE_TYPES = [
  { id: 'car',    label: 'Car',    icon: Car,       color: 'from-slate-500 to-slate-700',   bg: 'bg-slate-500' },
  { id: 'home',   label: 'Home',   icon: Home,      color: 'from-green-500 to-emerald-700', bg: 'bg-green-500' },
  { id: 'travel', label: 'Travel', icon: Plane,     color: 'from-sky-500 to-blue-700',      bg: 'bg-sky-500'   },
  { id: 'pet',    label: 'Pet',    icon: PawPrint,  color: 'from-amber-400 to-orange-500',  bg: 'bg-amber-400' },
  { id: 'other',  label: 'Other',  icon: Shield,    color: 'from-purple-500 to-violet-700', bg: 'bg-purple-500'},
];

export function AddInsuranceModal({ onClose, onAdd }: AddInsuranceModalProps) {
  const [selectedType, setSelectedType] = useState(INSURANCE_TYPES[0]);
  const [policyName, setPolicyName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') setUploadedFile(file);
  };

  const handleAdd = () => {
    if (!uploadedFile) return;
    const name = policyName.trim() || `${selectedType.label} Insurance`;
    const newPolicy: Policy = {
      id: `custom-${Date.now()}`,
      title: name,
      type: 'Life',
      status: 'Active',
      coverage: uploadedFile.name,
      benefits: ['Coverage details in your uploaded document'],
      exclusions: [],
      color: selectedType.color,
      icon: selectedType.id,
      pointsReward: 0,
    };
    onAdd(newPolicy);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-[32px] w-full max-w-md p-6 pb-10 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Add Insurance</h2>
          <button onClick={onClose} className="bg-gray-100 p-2 rounded-full">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Type selector */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Type</p>
          <div className="flex gap-2 flex-wrap">
            {INSURANCE_TYPES.map(type => {
              const Icon = type.icon;
              const active = selectedType.id === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 text-sm font-bold transition-all ${
                    active ? 'border-yu-pink bg-yu-pink/5 text-yu-pink' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Name input */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Policy Name (optional)</p>
          <input
            type="text"
            value={policyName}
            onChange={e => setPolicyName(e.target.value)}
            placeholder={`${selectedType.label} Insurance`}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-yu-pink"
          />
        </div>

        {/* PDF Upload */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Upload Policy PDF</p>
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 transition-all ${
              uploadedFile ? 'border-yu-pink bg-yu-pink/5' : 'border-gray-200'
            }`}
          >
            {uploadedFile ? (
              <>
                <FileText className="w-8 h-8 text-yu-pink" />
                <span className="text-sm font-bold text-yu-pink truncate max-w-full px-4">{uploadedFile.name}</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-bold text-gray-400">Tap to upload PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!uploadedFile}
          className={`w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white transition-all ${
            uploadedFile ? 'bg-yu-pink shadow-lg shadow-yu-pink/30' : 'bg-gray-200 text-gray-400'
          }`}
        >
          Add to Wallet
        </button>
      </motion.div>
    </motion.div>
  );
}
