import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/MasonryGrid';

export const LatestPage: React.FC = () => {
  const { wallpapers } = useApp();

  const newestWallpapers = [...wallpapers].sort(
    (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20 mb-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>FRESH DROP STREAM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Latest Releases</h1>
        <p className="text-slate-400 text-sm mt-1">
          The newest high definition wallpapers published by artists and photographers.
        </p>
      </div>

      <MasonryGrid wallpapers={newestWallpapers} />
    </div>
  );
};
