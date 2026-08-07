import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/MasonryGrid';

export const FavoritesPage: React.FC = () => {
  const { wallpapers, user, setActivePage } = useApp();

  const favoriteWallpapers = wallpapers.filter((w) => user.favoriteIds.includes(w.id));

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 mb-2">
          <Heart className="w-4 h-4 fill-rose-500" />
          <span>YOUR SAVED LIBRARY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Favorites</h1>
        <p className="text-slate-400 text-sm mt-1">
          You have {favoriteWallpapers.length} saved wallpapers in your personal library.
        </p>
      </div>

      {favoriteWallpapers.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 space-y-4">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Favorites Saved Yet</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Click the heart icon on any wallpaper card or detail preview to save it here for quick access.
          </p>
          <button
            onClick={() => setActivePage('search')}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20"
          >
            Explore Wallpapers
          </button>
        </div>
      ) : (
        <MasonryGrid wallpapers={favoriteWallpapers} />
      )}
    </div>
  );
};
