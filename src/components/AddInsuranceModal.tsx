import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, FileText, Loader2, Sparkles, Car, Home, Plane, PawPrint, Shield, HeartPulse, Smile, Briefcase } from 'lucide-react';
import { Policy } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const CUSTOM_COLORS = [
  'from-red-500 to-rose-600',
  'from-amber-400 to-yellow-500',
  'from-emerald-500 to-green-600',
  'from-sky-500 to-cyan-600',
  'from-violet-500 to-purple-600',
  'from-pink-500 to-fuchsia-600',
];

let colorIndex = 0;

const INSURANCE_TYPES = [
  { id: 'Car',      label: 'Car',      icon: Car,        iconName: 'Car',        color: 'from-slate-500 to-slate-700' },
  { id: 'Home',     label: 'Home',     icon: Home,       iconName: 'Home',       color: 'from-emerald-500 to-green-700' },
  { id: 'Travel',   label: 'Travel',   icon: Plane,      iconName: 'Plane',      color: 'from-sky-500 to-blue-700' },
  { id: 'Pet',      label: 'Pet',      icon: PawPrint,   iconName: 'PawPrint',   color: 'from-amber-400 to-orange-500' },
  { id: 'Health',   label: 'Health',   icon: HeartPulse, iconName: 'HeartPulse', color: 'from-red-500 to-rose-600' },
  { id: 'Dental',   label: 'Dental',   icon: Smile,      iconName: 'Smile',      color: 'from-violet-500 to-purple-700' },
  { id: 'Business', label: 'Business', icon: Briefcase,  iconName: 'Briefcase',  color: 'from-indigo-500 to-blue-700' },
  { id: 'Other',    label: 'Other',    icon: Shield,     iconName: 'Shield',     color: 'from-pink-500 to-fuchsia-600' },
];

async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  return text;
}

interface AddInsuranceModalProps {
  onClose: () => void;
  onAdd: (policy: Policy) => void;
}

export function AddInsuranceModal({ onClose, onAdd }: AddInsuranceModalProps) {
  const [provider, setProvider] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [selectedType, setSelectedType] = useState(INSURANCE_TYPES[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const handleAdd = async () => {
    if (!uploadedFile || !insuranceName.trim()) return;

    try {
      setStatus('extracting');
      const pdfText = await extractPdfText(uploadedFile);

      setStatus('analyzing');
      let data: any = {};
      try {
        const res = await fetch('/.netlify/functions/analyze-policy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfText, policyName: insuranceName.trim() }),
        });
        if (res.ok) data = await res.json();
      } catch {
        // fallback: create card without AI summary
      }

      const pdfUrl = URL.createObjectURL(uploadedFile);

      const name = insuranceName.trim() || `${selectedType.label} Insurance`;
      const newPolicy: Policy = {
        id: `custom-${Date.now()}`,
        title: name,
        type: selectedType.id,
        status: 'Active',
        coverage: data.summary || `${name} policy`,
        benefits: data.benefits || ['See your uploaded policy document'],
        exclusions: data.exclusions || [],
        color: selectedType.color,
        icon: selectedType.iconName,
        pointsReward: 0,
        pdfUrl,
        provider: provider.trim() || undefined,
      };

      setStatus('done');
      onAdd(newPolicy);
      onClose();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg('Failed to analyze. Please try again.');
    }
  };

  const isLoading = status === 'extracting' || status === 'analyzing';
  const canSubmit = !!uploadedFile && !!provider.trim() && !isLoading;

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
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 text-sm font-bold transition-all ${
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

        {/* Provider / Company name */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Insurance Company *</p>
          <input
            type="text"
            value={provider}
            onChange={e => setProvider(e.target.value)}
            placeholder="e.g. Aviva, AXA, Allianz"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-yu-pink"
          />
        </div>

        {/* Policy name */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Policy Name (optional)</p>
          <input
            type="text"
            value={insuranceName}
            onChange={e => setInsuranceName(e.target.value)}
            placeholder={`${selectedType.label} Insurance`}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-yu-pink"
          />
        </div>

        {/* PDF Upload */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Upload Policy PDF *</p>
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center gap-2 transition-all ${
              uploadedFile ? 'border-yu-pink bg-yu-pink/5' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {uploadedFile ? (
              <>
                <FileText className="w-8 h-8 text-yu-pink" />
                <span className="text-sm font-bold text-yu-pink truncate max-w-full px-4">{uploadedFile.name}</span>
                <span className="text-xs text-gray-400">Tap to change</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-bold text-gray-400">Tap to upload PDF</span>
              </>
            )}
          </button>
        </div>

        {/* AI note */}
        {uploadedFile && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Sparkles className="w-4 h-4 text-yu-pink" />
            AI will analyze your policy and generate a summary
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <p className="text-red-500 text-sm font-medium">{errorMsg}</p>
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 ${
            canSubmit ? 'bg-yu-pink shadow-lg shadow-yu-pink/30' : 'bg-gray-200 text-gray-400'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {status === 'extracting' ? 'Reading PDF...' : 'AI Analyzing...'}
            </>
          ) : (
            'Add to Wallet'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
