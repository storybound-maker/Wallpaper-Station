import React from 'react';
import { Sparkles, Monitor, ShieldCheck, Zap, Layers, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 pb-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>About Wallpaper Station</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Engineered for <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Screen Perfectionists</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Wallpaper Station is a digital gallery platform providing uncompressed 4K, 8K, and mobile OLED wallpapers curated for modern high-refresh workstations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Zero Compression</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every wallpaper is delivered in native 3840x2160 or 7680x4320 precision without JPEG artifact compression.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Monitor className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">OLED Battery Saved</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our specialized AMOLED section features deep #000000 black levels that shut off self-emissive pixels on OLED screens.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Free Commercial License</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All wallpaper assets are freely available for personal monitors, mobile devices, commercial video streams, and presentations.
          </p>
        </div>
      </div>
    </div>
  );
};
