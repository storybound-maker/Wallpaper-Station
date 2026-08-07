import React from 'react';
import { Home, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotFoundPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 font-extrabold text-4xl shadow-2xl">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-white">Wallpaper Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md">
        The page or wallpaper path you requested does not exist or has been moved to another gallery collection.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setActivePage('home')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
        <button
          onClick={() => setActivePage('search')}
          className="px-6 py-3 rounded-2xl glass-panel text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-800"
        >
          <Compass className="w-4 h-4 text-sky-400" />
          <span>Explore Wallpapers</span>
        </button>
      </div>
    </div>
  );
};
