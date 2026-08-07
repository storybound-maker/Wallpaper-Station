import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Upload, ShieldCheck, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const { setUser, addToast } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [purpose, setPurpose] = useState<'download' | 'upload' | null>(null);
  const [authMode, setAuthMode] = useState<'google' | 'personal'>('personal');

  // Form State for Personal ID
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSelectPurpose = (selected: 'download' | 'upload') => {
    setPurpose(selected);
    setStep(2);
  };

  const handleGoogleSignIn = () => {
    setUser((prev) => ({
      ...prev,
      id: 'usr-google-' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isLoggedIn: true,
      isAdmin: purpose === 'upload',
    }));
    addToast('Signed in successfully with Google!', 'success');
    handleResetAndClose();
  };

  const handlePersonalIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    setUser((prev) => ({
      ...prev,
      id: 'usr-' + Date.now(),
      name: username.trim(),
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      isLoggedIn: true,
      isAdmin: purpose === 'upload',
    }));

    addToast(`Welcome to Wallpaper Station, ${username}!`, 'success');
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setStep(1);
    setPurpose(null);
    setUsername('');
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-[#060A13]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 z-10 text-slate-100 bg-[#0B1220]/95"
        >
          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20 mb-1">
                  <span>STEP 1 OF 2</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">Join Wallpaper Station</h2>
                <p className="text-sm text-slate-400">
                  What will you do on Wallpaper Station?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Option 1: Download */}
                <button
                  onClick={() => handleSelectPurpose('download')}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/60 text-left transition-all duration-300 group flex flex-col justify-between h-44 shadow-lg hover:shadow-sky-500/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                      Option 1: Download
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Discover, save & download 4K & 8K Ultra-HD wallpapers.
                    </p>
                  </div>
                </button>

                {/* Option 2: Upload */}
                <button
                  onClick={() => handleSelectPurpose('upload')}
                  className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/60 text-left transition-all duration-300 group flex flex-col justify-between h-44 shadow-lg hover:shadow-indigo-500/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      Option 2: Upload
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Publish your custom artwork & wallpapers from device storage.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-sky-400 hover:underline mb-1 inline-block font-semibold"
                >
                  ← Back to question
                </button>
                <h2 className="text-2xl font-extrabold text-white">Create Account or Sign In</h2>
                <p className="text-sm text-slate-400">
                  Joining as a <span className="text-sky-400 font-bold uppercase">{purpose}er</span>
                </p>
              </div>

              {/* Auth Method Switcher */}
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setAuthMode('personal')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authMode === 'personal'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Personal ID
                </button>
                <button
                  onClick={() => setAuthMode('google')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authMode === 'google'
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign in with Google
                </button>
              </div>

              {authMode === 'google' ? (
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center mx-auto shadow-md">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-slate-300">
                    Use your Google account for quick, one-click sign in.
                  </p>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePersonalIdSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Username / Handle
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CyberArtisan"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Complete Account Creation</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
