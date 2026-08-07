import React, { useState } from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [tab, setTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 pb-16">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setTab('privacy')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            tab === 'privacy'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setTab('terms')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            tab === 'terms'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Terms of Service
        </button>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 text-slate-300 text-sm leading-relaxed">
        {tab === 'privacy' ? (
          <>
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
            <p>Last updated: July 28, 2026</p>
            <p>
              At Wallpaper Station, your privacy is paramount. We do not track personal identifyable information without your explicit consent.
            </p>
            <h2 className="text-lg font-bold text-white pt-4">Data Collection</h2>
            <p>
              We collect anonymous telemetry logs including wallpaper download counters, search queries, and view metrics solely to organize popular wallpaper feeds.
            </p>
            <h2 className="text-lg font-bold text-white pt-4">Local Storage Usage</h2>
            <p>
              User favorites, custom collections, and local theme preferences are stored strictly inside your browser's local key-value storage (`localStorage`).
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
            <p>Last updated: July 28, 2026</p>
            <p>
              By accessing Wallpaper Station, you agree to comply with our commercial and personal wallpaper usage guidelines.
            </p>
            <h2 className="text-lg font-bold text-white pt-4">License & Usage</h2>
            <p>
              All wallpapers hosted on Wallpaper Station are free for personal desktop, mobile, and commercial background streaming uses. Re-selling raw wallpaper files as standalone packs is strictly prohibited.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
