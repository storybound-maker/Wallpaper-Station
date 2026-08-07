import React from 'react';
import { User, Heart, Download, FolderHeart, ShieldCheck, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/MasonryGrid';

export const ProfilePage: React.FC = () => {
  const { user, wallpapers } = useApp();

  const downloadedWallpapers = wallpapers.filter((w) => user.downloadHistoryIds.includes(w.id));

  return (
    <div className="space-y-8 pb-12">
      {/* User Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80 flex flex-col md:flex-row items-center gap-6">
        <img
          src={user.avatar}
          alt={user.name}
          referrerPolicy="no-referrer"
          className="w-24 h-24 rounded-full object-cover border-4 border-sky-500/40 shadow-2xl shrink-0"
        />
        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            {user.isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                ADMINISTRATOR
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{user.email}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <strong>{user.favoriteIds.length}</strong> Favorites
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <strong>{user.downloadHistoryIds.length}</strong> Downloads
            </span>
            <span className="flex items-center gap-1">
              <FolderHeart className="w-3.5 h-3.5 text-indigo-400" />
              <strong>{user.userCollections.length}</strong> Custom Collections
            </span>
          </div>
        </div>
      </div>

      {/* Download History Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-sky-400" />
          <span>My Download History</span>
        </h2>
        {downloadedWallpapers.length === 0 ? (
          <p className="text-slate-400 text-sm glass-panel p-6 rounded-2xl border border-slate-800">
            No wallpapers downloaded yet in this browser session.
          </p>
        ) : (
          <MasonryGrid wallpapers={downloadedWallpapers} />
        )}
      </div>
    </div>
  );
};
