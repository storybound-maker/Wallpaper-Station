import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, CheckCircle2, Tv, Sparkles, Download, ShieldAlert, Award } from 'lucide-react';
import { Wallpaper, ResolutionOption } from '../types';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: Wallpaper | null;
  resolution: ResolutionOption;
  onAdComplete: () => void;
}

const SPONSORS = [
  {
    name: 'NVIDIA GeForce RTX 8K Neural Upscaler',
    tagline: 'Experience AI-Powered Ultra HD Visual Mastery',
    logoBg: 'from-emerald-600 to-teal-800',
    cta: 'Learn More at NVIDIA.com',
  },
  {
    name: 'Samsung Odyssey Neo G9 8K Quantum OLED',
    tagline: 'Unrivaled 240Hz Speed & Pure Pixel Depth',
    logoBg: 'from-blue-600 to-indigo-800',
    cta: 'Explore 8K OLED Display',
  },
  {
    name: 'ROG Swift 8K Workstation Display',
    tagline: 'Built for High-End Digital Creators & Animators',
    logoBg: 'from-purple-600 to-rose-800',
    cta: 'View ROG Workstations',
  },
];

export const AdModal: React.FC<AdModalProps> = ({
  isOpen,
  onClose,
  wallpaper,
  resolution,
  onAdComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      setIsCompleted(false);
      return;
    }

    // Pick random sponsor
    setCurrentSponsorIndex(Math.floor(Math.random() * SPONSORS.length));
    setTimeLeft(5);
    setIsCompleted(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !wallpaper) return null;

  const currentSponsor = SPONSORS[currentSponsorIndex];
  const progressPercent = ((5 - timeLeft) / 5) * 100;

  const handleClaim8KDownload = () => {
    onAdComplete();
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
          onClick={isCompleted ? onClose : undefined}
          className="fixed inset-0 bg-[#060A13]/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl border border-sky-500/40 shadow-2xl p-6 sm:p-8 z-10 text-slate-100 bg-[#0B1220]/95"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Header Badge */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>SPONSORED 8K UNLOCK AD</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Watch Ad for 8K Master File</h2>
              <p className="text-xs text-slate-400">
                Watching a 5-second sponsor clip keeps 8K Ultra HD downloads free for everyone!
              </p>
            </div>

            {/* Simulated Video Ad Player Container */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-6 space-y-4 shadow-inner">
              {/* Wallpaper Thumbnail Preview with Overlay */}
              <div className="relative h-40 rounded-xl overflow-hidden group">
                <img
                  src={wallpaper.url}
                  alt={wallpaper.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Sponsor Banner Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${currentSponsor.logoBg} opacity-80 mix-blend-multiply`} />

                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      SPONSOR AD
                    </span>
                    <span className="text-xs font-mono font-bold bg-sky-500 text-white px-2.5 py-1 rounded-lg shadow-md">
                      {isCompleted ? 'AD FINISHED' : `00:0${timeLeft}`}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black drop-shadow-md">{currentSponsor.name}</h3>
                    <p className="text-xs text-slate-200 opacity-90 drop-shadow-sm">{currentSponsor.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Play className="w-3 h-3 text-sky-400 fill-sky-400 animate-pulse" />
                    {isCompleted ? '100% Played' : `Watching Ad... (${timeLeft}s remaining)`}
                  </span>
                  <span className="text-sky-400 font-bold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400"
                    style={{ width: `${progressPercent}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              </div>
            </div>

            {/* Target Item Specs */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div>
                <p className="text-slate-400">Target Resolution</p>
                <p className="font-bold text-sky-400 text-sm">8K Ultra HD (7680 x 4320)</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400">Wallpaper Title</p>
                <p className="font-semibold text-slate-200 truncate max-w-[160px]">{wallpaper.title}</p>
              </div>
            </div>

            {/* Action Button */}
            {isCompleted ? (
              <motion.button
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onClick={handleClaim8KDownload}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all animate-bounce"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>8K Unlocked! Download Master File Now</span>
              </motion.button>
            ) : (
              <button
                disabled
                className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 cursor-not-allowed opacity-80"
              >
                <Play className="w-4 h-4 text-sky-400 animate-spin" />
                <span>Please watch ad ({timeLeft}s left to unlock)</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
