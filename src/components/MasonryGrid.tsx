import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { WallpaperCard } from './WallpaperCard';
import { Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MasonryGridProps {
  wallpapers: Wallpaper[];
  isLoading?: boolean;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ wallpapers, isLoading = false }) => {
  const { resetFilters } = useApp();
  const [visibleCount, setVisibleCount] = useState(12);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const displayedWallpapers = wallpapers.slice(0, visibleCount);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-2xl glass-panel animate-pulse bg-slate-900 border border-slate-800"
          />
        ))}
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-3xl my-8 border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mb-4 border border-slate-800">
          <Layers className="w-8 h-8 text-sky-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Wallpapers Found</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          We couldn't find any wallpapers matching your search filters. Try adjusting your category, color, or keyword filters.
        </p>
        <button
          onClick={resetFilters}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="my-8">
      {/* Responsive Columns Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {displayedWallpapers.map((wp) => (
          <WallpaperCard key={wp.id} wallpaper={wp} />
        ))}
      </div>

      {/* Infinite Scroll / Load More CTA */}
      {visibleCount < wallpapers.length && (
        <div className="flex justify-center mt-12 mb-6">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 rounded-2xl glass-panel hover:bg-slate-800/80 border border-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm flex items-center gap-3 transition-all duration-300 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 group"
          >
            <Sparkles className="w-4 h-4 text-sky-400 group-hover:rotate-12 transition-transform" />
            <span>Load More Wallpapers ({wallpapers.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
};
