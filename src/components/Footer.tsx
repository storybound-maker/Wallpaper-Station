import React, { useState } from 'react';
import { Sparkles, Send, ShieldCheck, Heart, Layers, Download, Eye, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/wallpapers';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategory, addToast, wallpapers } = useApp();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('Subscribed! You will now receive weekly 8K wallpaper drops.', 'success');
      setEmail('');
    }
  };

  const totalDownloads = wallpapers.reduce((acc, wp) => acc + wp.downloads, 184200);
  const totalViews = wallpapers.reduce((acc, wp) => acc + wp.views, 452100);

  return (
    <footer className="w-full bg-[#080E1A] border-t border-slate-800/80 mt-24 text-slate-400">
      {/* Live Stats Bar */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xl sm:text-2xl">
              <Download className="w-5 h-5" />
              <span>{totalDownloads.toLocaleString()}</span>
            </div>
            <span className="text-xs text-slate-500 uppercase font-semibold mt-1">Total Downloads</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl sm:text-2xl">
              <Eye className="w-5 h-5" />
              <span>{totalViews.toLocaleString()}</span>
            </div>
            <span className="text-xs text-slate-500 uppercase font-semibold mt-1">Wallpaper Views</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl sm:text-2xl">
              <Layers className="w-5 h-5" />
              <span>15,400+</span>
            </div>
            <span className="text-xs text-slate-500 uppercase font-semibold mt-1">4K & 8K Assets</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xl sm:text-2xl">
              <Globe className="w-5 h-5" />
              <span>100% Free</span>
            </div>
            <span className="text-xs text-slate-500 uppercase font-semibold mt-1">Commercial License</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Newsletter Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">Wallpaper Station</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Discover stunning wallpapers for every screen. Crafted for monitors, mobile OLED displays, and ultra-wide workstations.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Get Weekly Ultra-HD Drops
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 flex-1"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white p-2.5 rounded-xl font-medium shadow-md shadow-sky-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Categories Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Top Categories</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES_DATA.slice(0, 6).map((cat) => (
              <li key={cat.name}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setActivePage('search');
                  }}
                  className="hover:text-sky-400 transition-colors"
                >
                  {cat.name} Wallpapers
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Platform Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => setActivePage('trending')} className="hover:text-sky-400 transition-colors">
                Trending 4K
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('latest')} className="hover:text-sky-400 transition-colors">
                New Releases
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('collections')} className="hover:text-sky-400 transition-colors">
                Curated Collections
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('contact')} className="hover:text-sky-400 transition-colors">
                Request a Wallpaper
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('admin')} className="hover:text-sky-400 transition-colors">
                Creator & Admin Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Community</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => setActivePage('about')} className="hover:text-sky-400 transition-colors">
                About Wallpaper Station
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('contact')} className="hover:text-sky-400 transition-colors">
                Request Wallpaper
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('legal')} className="hover:text-sky-400 transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('legal')} className="hover:text-sky-400 transition-colors">
                Terms of Service
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 bg-[#060A13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Wallpaper Station Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            <span>for screen perfectionists worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
