import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Sparkles,
  TrendingUp,
  Flame,
  Grid,
  Bot,
  ArrowRight,
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA, POPULAR_SEARCH_TAGS } from '../data/wallpapers';
import { WallpaperOfTheDay } from '../components/WallpaperOfTheDay';
import { MasonryGrid } from '../components/MasonryGrid';

export const HomePage: React.FC = () => {
  const {
    wallpapers,
    curatedCollections,
    setActivePage,
    setSelectedCategory,
    setSelectedCollectionId,
    triggerSearch,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'newest'>('featured');
  const [currentHeroBgIndex, setCurrentHeroBgIndex] = useState(0);

  // Background slideshow imagery for Hero
  const heroBackgrounds = [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2560&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2560&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2560&auto=format&fit=crop',
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentHeroBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [heroBackgrounds.length]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      triggerSearch(searchQuery.trim());
    }
  };

  // Filtered wallpaper lists based on active tab
  const getDisplayedWallpapers = () => {
    if (activeTab === 'trending') {
      return [...wallpapers].sort((a, b) => b.downloads - a.downloads);
    }
    if (activeTab === 'newest') {
      return [...wallpapers].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }
    return wallpapers.filter((w) => w.isFeatured) || wallpapers;
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl min-h-[520px] lg:min-h-[600px] flex items-center justify-center">
        {/* Background Slideshow with Smooth Crossfade */}
        {heroBackgrounds.map((bg, i) => (
          <div
            key={bg}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === currentHeroBgIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/80 via-[#0B1220]/90 to-[#0B1220]" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 animate-pulse-glow" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider shadow-xl shadow-sky-500/10"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Discover 15,000+ Premium 4K & 8K Wallpapers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight"
          >
            Stunning Wallpapers for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Every Screen You Own.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Hand-curated ultra high-resolution backdrops engineered for desktop monitors, mobile OLED displays, and multi-screen workstations.
          </motion.p>

          {/* Hero Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleHeroSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center"
          >
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by keywords: Cyberpunk, AMOLED, Tokyo Night, Space..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl pl-12 pr-32 py-4 border border-slate-700/80 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 shadow-2xl transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* Popular Tag Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs"
          >
            <span className="text-slate-400 font-semibold">Popular Searches:</span>
            {POPULAR_SEARCH_TAGS.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => triggerSearch(tag)}
                className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-sky-950/80 hover:text-sky-300 text-slate-300 border border-slate-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories Carousel / Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-sky-400" />
            <span>Explore Categories</span>
          </h2>
          <button
            onClick={() => setActivePage('categories')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>View All (14)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES_DATA.slice(0, 7).map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setActivePage('search');
              }}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-slate-800/80 p-3 h-28 flex flex-col justify-end text-left transition-all hover:border-sky-500/50 hover:shadow-lg"
            >
              <img
                src={cat.coverUrl}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
              <div className="relative z-10">
                <span className="text-sm font-bold text-white block group-hover:text-sky-300 transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {cat.count}+ wallpapers
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Wallpaper Of The Day Section */}
      <WallpaperOfTheDay />

      {/* Main Wallpaper Feed Section with Tabs */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Handpicked Wallpapers</h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'featured'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'trending'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('newest')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'newest'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>New Releases</span>
            </button>
          </div>
        </div>

        {/* Masonry Wallpaper Feed */}
        <MasonryGrid wallpapers={getDisplayedWallpapers()} />
      </section>

      {/* Curated Collections Banner */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              <span>Curated Collections</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Hand-assembled theme packages for themed desk setups.
            </p>
          </div>
          <button
            onClick={() => setActivePage('collections')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>View All Collections</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {curatedCollections.slice(0, 3).map((col) => (
            <div
              key={col.id}
              onClick={() => {
                setSelectedCollectionId(col.id);
                setActivePage('collections');
              }}
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-800/40">
                  {col.itemCount} Wallpapers
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Studio Teaser Section */}
      <section className="rounded-3xl glass-panel p-8 sm:p-12 border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
            <Bot className="w-4 h-4 text-sky-400" />
            <span>AI STUDIO ENGINE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Can't find what you're looking for? Generate it with AI.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Use our AI Wallpaper Synthesizer powered by Gemini to create high-resolution 4K wallpaper art from simple text descriptions.
          </p>
          <button
            onClick={() => setActivePage('ai-generator')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm flex items-center gap-3 shadow-xl shadow-sky-500/20 transition-all"
          >
            <span>Launch AI Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-full md:w-80 h-52 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shrink-0">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
            alt="AI Preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent flex items-end p-4">
            <span className="text-xs font-bold text-sky-300 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-700">
              Generated in 2.4s (4K)
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
