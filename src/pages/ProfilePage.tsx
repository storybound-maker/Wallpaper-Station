import React, { useState } from 'react';
import { User as UserIcon, Heart, Download, FolderHeart, ShieldCheck, LogOut, LogIn, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/MasonryGrid';
import { JoinModal } from '../components/JoinModal';

export const ProfilePage: React.FC = () => {
  const { user, signOut, wallpapers } = useApp();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const downloadedWallpapers = wallpapers.filter((w) => user.downloadHistoryIds.includes(w.id));

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Sign In to Your Account</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sign in with your Supabase account to sync favorites, custom wallpaper collections, and access administrator tools.
          </p>
        </div>

        <button
          onClick={() => setIsJoinModalOpen(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all inline-flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In / Create Account</span>
        </button>

        <JoinModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          initialMode="signin"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* User Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover border-4 border-sky-500/40 shadow-2xl shrink-0"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              {user.isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ADMINISTRATOR
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 font-mono">{user.email}</p>
            <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
              UID: {user.id}
            </p>
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

        {/* Sign Out Button */}
        <button
          onClick={signOut}
          className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Download History Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-sky-400" />
          <span>My Download History</span>
        </h2>
        {downloadedWallpapers.length === 0 ? (
          <p className="text-slate-400 text-sm glass-panel p-6 rounded-2xl border border-slate-800">
            No wallpapers downloaded yet. Browse 4K & 8K wallpapers to build your download history.
          </p>
        ) : (
          <MasonryGrid wallpapers={downloadedWallpapers} />
        )}
      </div>
    </div>
  );
};
