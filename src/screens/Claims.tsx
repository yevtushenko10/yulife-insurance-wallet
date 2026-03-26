import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { POLICIES } from '../constants';
import { Policy } from '../types';
import { ChevronRight, Upload, CheckCircle2, AlertCircle, ArrowLeft, Loader2, FileText, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ClaimsProps {
  onBack: () => void;
}

export function Claims({ onBack }: ClaimsProps) {
  const [step, setStep] = useState(1);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split('T')[0];
  const minDate = '1900-01-01';

  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ date?: string; description?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleNext = () => setStep(prev => prev + 1);
  const handleStepBack = () => setStep(prev => prev - 1);

  const handleDetailsNext = () => {
    const newErrors: { date?: string; description?: string } = {};
    if (!incidentDate) newErrors.date = 'Please select a date';
    if (!description.trim()) newErrors.description = 'Please describe the incident';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    handleNext();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY);
      formData.append('botcheck', '');
      formData.append('subject', `New Claim — ${selectedPolicy?.title}`);
      formData.append('from_name', 'YuLife Insurance Wallet');
      formData.append('Policy', selectedPolicy?.title ?? '');
      formData.append('Date of Incident', incidentDate);
      formData.append('Description', description);
      if (uploadedFile) formData.append('Attached File', uploadedFile.name);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        handleNext();
      } else {
        setSubmitError('Submission failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-yu-lime flex flex-col overflow-hidden px-6">
      <header className="pt-8 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Make a Claim</h1>
          <p className="text-gray-500 font-bold">We're here to help you. 💙</p>
        </div>
        <button onClick={onBack} className="bg-white/50 p-3 rounded-2xl backdrop-blur-md border border-white/20">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      <div className="relative">
        <div className="flex justify-between items-center mb-4 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300",
                step >= s ? "bg-yu-pink text-white shadow-lg shadow-yu-pink/20" : "bg-white text-gray-400 border border-gray-100"
              )}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                step >= s ? "text-yu-pink" : "text-gray-400"
              )}>
                {s === 1 ? 'Policy' : s === 2 ? 'Details' : s === 3 ? 'Upload' : 'Done'}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-8 right-8 h-1 bg-white rounded-full -z-10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              className="h-full bg-yu-pink"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-2"
            >
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Which policy?</h2>
              <div className="grid gap-2">
                {POLICIES.map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => {
                      setSelectedPolicy(policy);
                      handleNext();
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-[32px] bg-white shadow-sm border border-gray-100 text-left hover:border-yu-pink/20 transition-all",
                      selectedPolicy?.id === policy.id && "border-yu-pink bg-yu-pink/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg", policy.color)}>
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight">{policy.title}</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-70">{policy.coverage}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tell us more</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                    Date of Incident <span className="text-yu-pink">❄</span>
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    min={minDate}
                    max={today}
                    onChange={(e) => {
                      setIncidentDate(e.target.value);
                      setErrors(prev => ({ ...prev, date: undefined }));
                    }}
                    className={cn(
                      "w-full p-5 rounded-3xl bg-white border focus:outline-none focus:ring-4 focus:ring-yu-pink/10 font-bold",
                      errors.date ? "border-red-400 ring-2 ring-red-200" : "border-gray-100"
                    )}
                  />
                  {errors.date && <p className="text-xs text-red-500 font-bold ml-4">{errors.date}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                    Description <span className="text-yu-pink">❄</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    placeholder="Briefly describe the issue..."
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors(prev => ({ ...prev, description: undefined }));
                    }}
                    className={cn(
                      "w-full p-5 rounded-3xl bg-white border focus:outline-none focus:ring-4 focus:ring-yu-pink/10 font-bold",
                      errors.description ? "border-red-400 ring-2 ring-red-200" : "border-gray-100"
                    )}
                  />
                  {errors.description && <p className="text-xs text-red-500 font-bold ml-4">{errors.description}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleStepBack} className="flex-1 yu-button-primary py-5">Back</button>
                <button onClick={handleDetailsNext} className="flex-1 yu-button-primary py-5">Next</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Evidence</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-full border-4 border-dashed rounded-[40px] p-12 flex flex-col items-center gap-4 transition-all",
                  uploadedFile ? "border-teal-400 bg-teal-50" : "border-white bg-white/50 active:bg-white/80"
                )}
              >
                {uploadedFile ? (
                  <>
                    <div className="bg-teal-500 p-5 rounded-3xl shadow-xl shadow-teal-200">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center w-full">
                      <p className="font-black text-gray-900 text-lg uppercase tracking-tight truncate px-4">{uploadedFile.name}</p>
                      <p className="text-xs text-teal-500 font-bold uppercase tracking-widest mt-1">
                        {(uploadedFile.size / 1024).toFixed(0)} KB · Tap to change
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-yu-pink p-5 rounded-3xl shadow-xl shadow-yu-pink/20">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-gray-900 text-lg uppercase tracking-tight">Tap to upload</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">PDF, JPG or PNG</p>
                    </div>
                  </>
                )}
              </button>
              {uploadedFile && (
                <button
                  type="button"
                  onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mx-auto"
                >
                  <X className="w-3 h-3" /> Remove file
                </button>
              )}
              {submitError && (
                <p className="text-xs text-red-500 font-bold text-center">{submitError}</p>
              )}
              <div className="flex gap-4">
                <button onClick={handleStepBack} className="flex-1 yu-button-primary py-5">Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 yu-button-primary py-5 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-12 space-y-8"
            >
              <div className="w-28 h-28 bg-teal-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-teal-200">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Claim Sent!</h2>
                <p className="text-gray-500 font-bold mt-2 px-8">We've received your claim and our team will review it shortly. You're covered! 💙</p>
              </div>
              <button
                onClick={onBack}
                className="bg-white text-yu-pink px-10 py-5 rounded-3xl font-black uppercase tracking-widest border border-gray-100 shadow-xl"
              >
                Back to Wallet
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
