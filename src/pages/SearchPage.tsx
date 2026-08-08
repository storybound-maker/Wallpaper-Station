import React from 'react';
import { Search, X, SlidersHorizontal, RefreshCw, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryName, ResolutionOption, OrientationType, SortOption } from '../types';
import { CATEGORIES_DATA } from '../data/wallpapers';
import { MasonryGrid } from '../components/MasonryGrid';

export const SearchPage: React.FC = () => {
  const { wallpapers, isLoadingWallpapers, filters, setFilters, selectedCategory, setSelectedCategory, resetFilters } = useApp();

  // Filter logic
  const filteredWallpapers = wallpapers.filter((wp) => {
    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = wp.title.toLowerCase().includes(q);
      const matchDesc = wp.description.toLowerCase().includes(q);
      const matchCategory = wp.category.toLowerCase().includes(q);
      const matchTags = wp.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCategory && !matchTags) return false;
    }

    // Category filter
    const activeCat = selectedCategory !== 'All' ? selectedCategory : filters.category;
    if (activeCat !== 'All' && wp.category !== activeCat) return false;

    // Resolution filter
    if (filters.resolutionTag !== 'All' && wp.resolutionTag !== filters.resolutionTag) return false;

    // Orientation filter
    if (filters.orientation !== 'All' && wp.orientation !== filters.orientation) return false;

    // Color filter
    if (filters.color !== 'All') {
      if (wp.colorName && wp.colorName.toLowerCase() !== filters.color.toLowerCase()) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    }
    if (filters.sortBy === 'downloads') {
      return b.downloads - a.downloads;
    }
    if (filters.sortBy === 'views') {
      return b.views - a.views;
    }
    // popularity default
    return b.favorites - a.favorites;
  });

  const colorOptions = ['All', 'Blue', 'Dark', 'Red', 'Purple', 'Green', 'Cyan', 'Black', 'Pink', 'Gray'];

  return (
    <div className="space-y-8 pb-12">
      {/* Search & Filter Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <Search className="w-7 h-7 text-sky-400" />
              <span>Explore & Search Wallpapers</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Showing {filteredWallpapers.length} high definition wallpapers matching your criteria.
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Instant Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search wallpapers by title, category, or tag (e.g., Cyberpunk, 8K, Space, Japan)..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-900/90 text-white placeholder-slate-500 text-sm sm:text-base rounded-2xl pl-12 pr-10 py-3.5 border border-slate-800 focus:outline-none focus:border-sky-500/80"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 border-t border-slate-800/80">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory !== 'All' ? selectedCategory : filters.category}
              onChange={(e) => {
                const val = e.target.value as CategoryName | 'All';
                setSelectedCategory(val);
                setFilters((prev) => ({ ...prev, category: val }));
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES_DATA.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Resolution Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Resolution
            </label>
            <select
              value={filters.resolutionTag}
              onChange={(e) => setFilters((prev) => ({ ...prev, resolutionTag: e.target.value as ResolutionOption | 'All' }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Resolutions</option>
              <option value="1080p">1080p (Full HD)</option>
              <option value="1440p">1440p (2K)</option>
              <option value="4K">4K (Ultra HD)</option>
              <option value="8K">8K (Extreme HD)</option>
              <option value="Mobile">Mobile (Portrait)</option>
            </select>
          </div>

          {/* Orientation Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Orientation
            </label>
            <select
              value={filters.orientation}
              onChange={(e) => setFilters((prev) => ({ ...prev, orientation: e.target.value as OrientationType | 'All' }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Orientations</option>
              <option value="landscape">Desktop (Landscape)</option>
              <option value="portrait">Mobile (Portrait)</option>
            </select>
          </div>

          {/* Color Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Primary Color
            </label>
            <select
              value={filters.color}
              onChange={(e) => setFilters((prev) => ({ ...prev, color: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {colorOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Colors' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="downloads">Most Downloaded</option>
              <option value="newest">Newest First</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory !== 'All' ||
          filters.resolutionTag !== 'All' ||
          filters.orientation !== 'All' ||
          filters.color !== 'All' ||
          filters.searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Active Filters:
            </span>

            {selectedCategory !== 'All' && (
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-sky-500/30">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('All')}>
                  <X className="w-3.5 h-3.5 hover:text-white" />
                </button>
              </span>
            )}

            {filters.resolutionTag !== 'All' && (
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-sky-500/30">
                <span>Resolution: {filters.resolutionTag}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, resolutionTag: 'All' }))}>
                  <X className="w-3.5 h-3.5 hover:text-white" />
                </button>
              </span>
            )}

            {filters.orientation !== 'All' && (
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-sky-500/30">
                <span>Orientation: {filters.orientation}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, orientation: 'All' }))}>
                  <X className="w-3.5 h-3.5 hover:text-white" />
                </button>
              </span>
            )}

            {filters.color !== 'All' && (
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-sky-500/30">
                <span>Color: {filters.color}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, color: 'All' }))}>
                  <X className="w-3.5 h-3.5 hover:text-white" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid Results */}
      <MasonryGrid wallpapers={filteredWallpapers} isLoading={isLoadingWallpapers} />
    </div>
  );
};
