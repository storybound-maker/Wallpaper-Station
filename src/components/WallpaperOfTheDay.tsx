import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, Download, Eye, Heart, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WallpaperOfTheDay: React.FC = () => {
  const { wallpapers, setActiveWallpaper, downloadWallpaper, toggleFavorite, user } = useApp();

  const wotd = wallpapers.find((w) => w.isWallpaperOfTheDay) || wallpapers[0];

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!wotd) return null;

  const isFavorite = user.favoriteIds.includes(wotd.id);

  return (
    <section className="relative my-12 rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl">
      <div className="relative min-h-[420px] lg:min-h-[480px] flex items-center">
        {/* Background Image with Dark Vignette */}
        <img
          src={wotd.url}
          alt={wotd.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />

        {/* Content Overlay */}
        <div className="relative z-10 max-w-2xl px-6 py-10 sm:px-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              WALLPAPER OF THE DAY
            </span>
            <span className="glass-badge px-3 py-1 rounded-full text-xs font-bold text-sky-300 border border-slate-700">
              {wotd.resolutionTag} Ultra HD
            </span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {wotd.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed line-clamp-2">
              {wotd.description}
            </p>
          </div>

          {/* Artist & Timer Info */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-3">
              <img
                src={wotd.author.avatar}
                alt={wotd.author.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-sky-400"
              />
              <div>
                <p className="text-xs text-slate-400">Created by</p>
                <p className="text-sm font-semibold text-white">{wotd.author.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Next Drop In:</span>
              <span className="font-bold text-sky-400">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => downloadWallpaper(wotd, wotd.resolutionTag)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-sky-500/25 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Download 4K HD</span>
            </button>

            <button
              onClick={() => setActiveWallpaper(wotd)}
              className="px-5 py-3 rounded-2xl glass-panel hover:bg-slate-800/80 text-white font-semibold text-sm flex items-center gap-2 border border-slate-700/80 transition-colors"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Preview Screen</span>
            </button>

            <button
              onClick={() => toggleFavorite(wotd.id)}
              className={`p-3 rounded-2xl glass-panel border transition-all ${
                isFavorite
                  ? 'bg-rose-500/30 text-rose-400 border-rose-500/50'
                  : 'text-slate-300 hover:text-rose-400 border-slate-700/80'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
