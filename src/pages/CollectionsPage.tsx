import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FolderHeart, Plus, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/MasonryGrid';

export const CollectionsPage: React.FC = () => {
  const {
    curatedCollections,
    userCollections,
    createCollection,
    wallpapers,
    selectedCollectionId,
    setSelectedCollectionId,
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const allCollections = [...curatedCollections, ...userCollections];
  const activeCollection = allCollections.find((c) => c.id === selectedCollectionId);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createCollection(newTitle.trim(), newDesc.trim());
      setNewTitle('');
      setNewDesc('');
      setCreateModalOpen(false);
    }
  };

  // If a collection is selected, render its wallpapers
  if (activeCollection) {
    const collectionWallpapers = wallpapers.filter((w) =>
      activeCollection.wallpaperIds.includes(w.id)
    );

    return (
      <div className="space-y-8 pb-12">
        <button
          onClick={() => setSelectedCollectionId(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Collections</span>
        </button>

        <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-700/80 p-8 sm:p-12">
          <img
            src={activeCollection.coverUrl}
            alt={activeCollection.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/80 to-transparent" />
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800/40">
              {collectionWallpapers.length} Items in Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              {activeCollection.title}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">{activeCollection.description}</p>
          </div>
        </div>

        <MasonryGrid wallpapers={collectionWallpapers} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderHeart className="w-4 h-4" />
            <span>THEMED PACKAGES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated Collections
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Hand-assembled collections designed for specific multi-monitor desk setups.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* Curated Collections Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Official Editorial Packages</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curatedCollections.map((col) => (
            <motion.div
              key={col.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCollectionId(col.id)}
              className="group cursor-pointer rounded-3xl overflow-hidden glass-panel border border-slate-800 hover:border-sky-500/50 transition-all duration-300 relative h-72 flex flex-col justify-end p-6"
            >
              <img
                src={col.coverUrl}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent" />
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-800/40">
                  {col.itemCount} Wallpapers
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {col.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Custom Collections Grid */}
      {userCollections.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>My Custom Collections</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCollections.map((col) => (
              <motion.div
                key={col.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedCollectionId(col.id)}
                className="group cursor-pointer rounded-3xl overflow-hidden glass-panel border border-slate-800 hover:border-sky-500/50 transition-all duration-300 relative h-64 flex flex-col justify-end p-6"
              >
                <img
                  src={col.coverUrl}
                  alt={col.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/40">
                    Personal Collection • {col.itemCount} Wallpapers
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Creating New Collection */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060A13]/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white">Create New Collection</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ultrawide OLED Workstation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Favorite dark wallpapers for multi-monitor setup..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
