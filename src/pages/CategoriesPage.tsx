import React from 'react';
import { motion } from 'motion/react';
import { Grid, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/wallpapers';

export const CategoriesPage: React.FC = () => {
  const { wallpapers, setSelectedCategory, setActivePage } = useApp();

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto py-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Grid className="w-4 h-4" />
          <span>Curated Wallpaper Hubs</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Browse by <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Category</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Choose from 14 distinct visual categories tailored to your desktop and phone aesthetic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_DATA.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            onClick={() => {
              setSelectedCategory(cat.name);
              setActivePage('search');
            }}
            className="group cursor-pointer rounded-3xl overflow-hidden glass-panel border border-slate-800 hover:border-sky-500/50 hover:shadow-2xl transition-all duration-300 relative h-72 flex flex-col justify-end p-6"
          >
            {/* Background Image */}
            <img
              src={cat.coverUrl}
              alt={cat.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800/40">
                  {wallpapers.filter((w) => w.category === cat.name).length || cat.count} Wallpapers
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center text-slate-300 group-hover:text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white group-hover:text-sky-300 transition-colors">
                {cat.name}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
