import React from 'react';
import { motion } from 'motion/react';
import { Download, Heart, Eye, Maximize2, Sparkles } from 'lucide-react';
import { Wallpaper } from '../types';
import { useApp } from '../context/AppContext';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  aspectRatioClass?: string;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper }) => {
  const { user, toggleFavorite, downloadWallpaper, setActiveWallpaper } = useApp();

  const isFavorite = user.favoriteIds.includes(wallpaper.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl overflow-hidden glass-panel border border-slate-800/80 hover:border-sky-500/40 hover:shadow-2xl hover:shadow-sky-500/10 mb-4 break-inside-avoid bg-slate-900 cursor-pointer"
    >
      {/* Resolution Badge Top Left */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <span className={`glass-badge px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide shadow-sm border backdrop-blur-md flex items-center gap-1 ${
          wallpaper.resolutionTag === '8K'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'text-sky-300 border-slate-700/60'
        }`}>
          <span>{wallpaper.resolutionTag}</span>
          {wallpaper.resolutionTag === '8K' && (
            <span className="text-[9px] bg-amber-500 text-slate-950 px-1 rounded font-black">AD</span>
          )}
        </span>
        {wallpaper.isAIGenerated && (
          <span className="glass-badge px-2 py-1 rounded-lg text-[10px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            AI
          </span>
        )}
      </div>

      {/* Top Right Quick Favorite */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(wallpaper.id);
          }}
          className={`p-2.5 rounded-xl glass-badge transition-all duration-200 ${
            isFavorite
              ? 'bg-rose-500/30 text-rose-400 border-rose-500/50 scale-105'
              : 'text-slate-300 hover:text-rose-400 hover:bg-slate-900/80'
          }`}
          title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Wallpaper Main Image */}
      <div onClick={() => setActiveWallpaper(wallpaper)} className="relative overflow-hidden w-full">
        <img
          src={wallpaper.thumbnailUrl}
          alt={wallpaper.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out min-h-[220px]"
        />

        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/95 via-[#0B1220]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/40">
                {wallpaper.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {wallpaper.resolution}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white line-clamp-1">{wallpaper.title}</h3>

            <div className="flex items-center justify-between pt-1">
              {/* Author Info */}
              <div className="flex items-center gap-2">
                <img
                  src={wallpaper.author.avatar}
                  alt={wallpaper.author.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-slate-700"
                />
                <span className="text-xs text-slate-300 font-medium truncate max-w-[100px]">
                  {wallpaper.author.name}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveWallpaper(wallpaper);
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
                  title="Full Screen Preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadWallpaper(wallpaper, wallpaper.resolutionTag);
                  }}
                  className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition-all"
                  title="One-Click Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Info (Always visible on mobile/clean) */}
      <div className="p-3.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
        <span className="font-semibold text-slate-200 truncate pr-2">{wallpaper.title}</span>
        <div className="flex items-center gap-3 shrink-0 text-slate-400 font-medium">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(wallpaper.id);
            }}
            className="flex items-center gap-1 hover:text-rose-400 transition-colors"
            title={isFavorite ? 'Unlike Wallpaper' : 'Like Wallpaper'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span>{wallpaper.favorites > 999 ? `${(wallpaper.favorites / 1000).toFixed(1)}k` : wallpaper.favorites}</span>
          </button>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            {wallpaper.views > 999 ? `${(wallpaper.views / 1000).toFixed(1)}k` : wallpaper.views}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-sky-400" />
            {wallpaper.downloads > 999 ? `${(wallpaper.downloads / 1000).toFixed(1)}k` : wallpaper.downloads}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
