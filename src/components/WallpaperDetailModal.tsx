import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Heart,
  Share2,
  Eye,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  FolderPlus,
  Tag as TagIcon,
  Sparkles,
  Calendar,
  HardDrive
} from 'lucide-react';
import { Wallpaper, ResolutionOption } from '../types';
import { useApp } from '../context/AppContext';

export const WallpaperDetailModal: React.FC = () => {
  const {
    activeWallpaper,
    setActiveWallpaper,
    user,
    toggleFavorite,
    downloadWallpaper,
    userCollections,
    addToCollection,
    wallpapers,
    addToast,
    triggerSearch,
  } = useApp();

  const [devicePreviewMode, setDevicePreviewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [selectedRes, setSelectedRes] = useState<ResolutionOption>('4K');
  const [copiedLink, setCopiedLink] = useState(false);
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);

  if (!activeWallpaper) return null;

  const isFavorite = user.favoriteIds.includes(activeWallpaper.id);

  // Related Wallpapers
  const relatedWallpapers = wallpapers
    .filter((w) => w.id !== activeWallpaper.id && w.category === activeWallpaper.category)
    .slice(0, 4);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    addToast('Wallpaper link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleDownload = () => {
    downloadWallpaper(activeWallpaper, selectedRes);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Modal Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveWallpaper(null)}
          className="fixed inset-0 bg-[#060A13]/90 backdrop-blur-2xl"
        />

        {/* Modal Content Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-6xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto text-slate-100 bg-[#0B1220]/95"
        >
          {/* Modal Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800/50">
                {activeWallpaper.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
                {activeWallpaper.title}
              </h2>
            </div>

            {/* Screen Preview Mode Toggles */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setDevicePreviewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  devicePreviewMode === 'desktop'
                    ? 'bg-sky-500/20 text-sky-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDevicePreviewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  devicePreviewMode === 'mobile'
                    ? 'bg-sky-500/20 text-sky-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setDevicePreviewMode('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  devicePreviewMode === 'tablet'
                    ? 'bg-sky-500/20 text-sky-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveWallpaper(null)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Scrollable Body */}
          <div className="overflow-y-auto p-6 space-y-8 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Device Screen Simulator / Image Stage */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl p-4 sm:p-6 border border-slate-800/80 min-h-[360px] relative overflow-hidden">
                <div
                  className={`transition-all duration-300 flex items-center justify-center ${
                    devicePreviewMode === 'mobile'
                      ? 'w-[240px] h-[480px] rounded-[36px] border-[10px] border-slate-800 shadow-2xl shadow-sky-500/10 relative overflow-hidden'
                      : devicePreviewMode === 'tablet'
                      ? 'w-[420px] h-[340px] rounded-[24px] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden'
                      : 'w-full max-h-[500px] rounded-xl overflow-hidden shadow-2xl border border-slate-800/60'
                  }`}
                >
                  <img
                    src={activeWallpaper.url}
                    alt={activeWallpaper.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <p className="text-xs text-slate-500 mt-4 font-mono">
                  Displaying simulated {devicePreviewMode.toUpperCase()} screen view ({activeWallpaper.resolution})
                </p>
              </div>

              {/* Right Column: Actions, Specs & Download Controls */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{activeWallpaper.title}</h1>
                  <p className="text-sm text-slate-400 leading-relaxed">{activeWallpaper.description}</p>
                </div>

                {/* Author Info Card */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <img
                    src={activeWallpaper.author.avatar}
                    alt={activeWallpaper.author.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-sky-500/40"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">Created & Published by</p>
                    <p className="text-sm font-semibold text-white">{activeWallpaper.author.name}</p>
                  </div>
                  <span className="text-[11px] font-bold text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/40">
                    VERIFIED
                  </span>
                </div>

                {/* Download Selector & Primary Actions */}
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Target Resolution
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1080p', '1440p', '4K', '8K', 'Mobile', 'Desktop'] as ResolutionOption[]).map((res) => (
                      <button
                        key={res}
                        onClick={() => setSelectedRes(res)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 ${
                          selectedRes === res
                            ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/30'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{res}</span>
                        {res === '8K' && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1 rounded uppercase">
                            AD
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleDownload}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-all duration-300 ${
                      selectedRes === '8K'
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-amber-500/25'
                        : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    <span>
                      {selectedRes === '8K'
                        ? 'Watch 5s Ad & Download 8K Master File'
                        : `Download ${selectedRes} HD Wallpaper`}
                    </span>
                  </button>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                      onClick={() => toggleFavorite(activeWallpaper.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                        isFavorite
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                      <span>{isFavorite ? 'Liked' : 'Like'} ({activeWallpaper.favorites})</span>
                    </button>

                    <button
                      onClick={handleCopyShareLink}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 flex items-center justify-center gap-2"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied' : 'Share'}</span>
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setCollectionDropdownOpen(!collectionDropdownOpen)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 flex items-center justify-center gap-2"
                      >
                        <FolderPlus className="w-4 h-4 text-indigo-400" />
                        <span>Add</span>
                      </button>

                      {collectionDropdownOpen && (
                        <div className="absolute right-0 bottom-12 w-56 glass-panel rounded-2xl p-2 shadow-2xl border border-slate-700 z-50">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                            Add to Collection
                          </p>
                          {userCollections.length === 0 ? (
                            <p className="text-xs text-slate-500 p-2">No collections yet</p>
                          ) : (
                            userCollections.map((col) => (
                              <button
                                key={col.id}
                                onClick={() => {
                                  addToCollection(col.id, activeWallpaper.id);
                                  setCollectionDropdownOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 truncate"
                              >
                                {col.title}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Original Resolution</span>
                    <span className="font-semibold text-slate-200">{activeWallpaper.resolution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">File Size</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-sky-400" />
                      {activeWallpaper.size}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Views & Downloads</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-indigo-400" />
                      {activeWallpaper.views.toLocaleString()} views
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Published Date</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      {activeWallpaper.uploadDate}
                    </span>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Primary Color Palette
                  </span>
                  <div className="flex items-center gap-2">
                    {activeWallpaper.colorHex.map((hex, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tags & Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeWallpaper.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setActiveWallpaper(null);
                          triggerSearch(tag);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-sky-950/60 hover:text-sky-400 text-xs text-slate-400 border border-slate-800 hover:border-sky-800/40 transition-colors flex items-center gap-1"
                      >
                        <TagIcon className="w-3 h-3 text-slate-500" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Wallpapers Section */}
            {relatedWallpapers.length > 0 && (
              <div className="pt-6 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>More in {activeWallpaper.category}</span>
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {relatedWallpapers.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => setActiveWallpaper(rel)}
                      className="group cursor-pointer rounded-2xl overflow-hidden glass-panel border border-slate-800 hover:border-sky-500/40 transition-all"
                    >
                      <img
                        src={rel.thumbnailUrl}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-white truncate">{rel.title}</p>
                        <p className="text-[10px] text-slate-400">{rel.resolutionTag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
