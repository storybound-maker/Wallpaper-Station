import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, ImagePlus, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryName } from '../types';
import { CATEGORIES_DATA } from '../data/wallpapers';

export const RequestPage: React.FC = () => {
  const { addToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryName>('Cyberpunk');
  const [resolution, setResolution] = useState('4K Ultra HD');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim() && email.trim()) {
      setSubmitted(true);
      addToast('Wallpaper request submitted! Our creators will review it.', 'success');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 pb-16 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>COMMUNITY REQUEST DESK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Request a Custom Wallpaper
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Can't find the exact style, anime character, futuristic scenery, or AMOLED background you're searching for? Submit your request below!
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Wallpaper Request Received!</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Thank you! Your request for <span className="text-sky-400 font-bold">"{title}"</span> has been logged. You will receive an email notification at <span className="text-slate-200 font-medium">{email}</span> when it is published.
          </p>
          <button
            onClick={() => {
              setTitle('');
              setDescription('');
              setSubmitted(false);
            }}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-sky-400 border border-slate-800 transition-colors"
          >
            Submit Another Wallpaper Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-700/80 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
              Wallpaper Title / Concept Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rainy Cyberpunk Alleyway at Midnight with Neon Glow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                Preferred Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryName)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {CATEGORIES_DATA.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                Target Resolution & Format
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="4K Ultra HD">4K Ultra HD (3840 x 2160)</option>
                <option value="8K Resolution">8K Resolution (7680 x 4320)</option>
                <option value="Mobile OLED 9:16">Mobile OLED 9:16 Vertical</option>
                <option value="Ultrawide 21:9">Ultrawide 21:9 Workstation</option>
                <option value="Dual Monitor 32:9">Dual Monitor 32:9</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
              Detailed Description & Visual Notes *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe color scheme, mood, elements, lighting, or specific details you want included..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
              Your Email Address (for notification when ready) *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Wallpaper Request</span>
          </button>
        </form>
      )}
    </div>
  );
};
