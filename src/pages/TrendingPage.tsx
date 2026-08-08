import React, { useState } from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/MasonryGrid';

export const TrendingPage: React.FC = () => {
  const { wallpapers, isLoadingWallpapers } = useApp();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  // Sort by downloads & views
  const trendingWallpapers = [...wallpapers].sort((a, b) => b.downloads * 2 + b.views - (a.downloads * 2 + a.views));

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>MOST POPULAR DOWNLOADS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Trending Wallpapers</h1>
          <p className="text-slate-400 text-sm mt-1">
            Wallpapers experiencing the highest download velocity across the platform.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'week' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'month' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timeframe === 'all' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <MasonryGrid wallpapers={trendingWallpapers} isLoading={isLoadingWallpapers} />
    </div>
  );
};
