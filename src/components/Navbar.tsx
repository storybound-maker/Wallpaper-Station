import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Heart,
  Grid,
  TrendingUp,
  FolderHeart,
  ShieldCheck,
  User as UserIcon,
  Menu,
  X,
  Compass,
  Home,
  LogOut,
  Upload,
  UserPlus,
  HelpCircle,
  Sun,
  Moon,
  RotateCcw,
  LogIn
} from 'lucide-react';
import { useApp, PageView } from '../context/AppContext';
import { JoinModal } from './JoinModal';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    user,
    signOut,
    triggerSearch,
    filters,
    theme,
    toggleTheme,
    resetToDefaultWallpapers
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [quickSearch, setQuickSearch] = useState(filters.searchQuery);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      triggerSearch(quickSearch.trim());
      setMobileMenuOpen(false);
    }
  };

  const allNavItems: { id: PageView; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; adminOnly?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Explore', icon: Compass },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: user.favoriteIds.length > 0 ? user.favoriteIds.length : undefined },
    { id: 'admin', label: 'Upload', icon: Upload, adminOnly: true },
    { id: 'contact', label: 'Request', icon: HelpCircle },
  ];

  // Filter out admin items for non-admins
  const navItems = allNavItems.filter((item) => !item.adminOnly || user.isAdmin);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setJoinModalOpen(true);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0B1220]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0B1220] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-400 transition-colors">
                Wallpaper Station
              </span>
              <span className="hidden sm:block text-[10px] tracking-widest uppercase text-slate-400 font-medium">
                4K & 8K Ultra HD
              </span>
            </div>
          </div>

          {/* Quick Search Input (Desktop) */}
          <form
            onSubmit={handleQuickSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-md mx-4"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 4K wallpapers, anime, cyberpunk, nature..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-slate-900/80 text-sm text-slate-100 placeholder-slate-500 rounded-full pl-10 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-white bg-slate-800/90 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center gap-2 shadow-sm ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 text-amber-400 hover:bg-slate-800 hover:border-amber-400/50'
                  : 'bg-white border-slate-200 text-sky-600 hover:bg-slate-50 hover:border-sky-400'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden sm:inline">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-600" />
                  <span className="hidden sm:inline">Night</span>
                </>
              )}
            </button>

            {/* Admin Suite Button - SHOWN ONLY IF ADMINISTRATOR UID */}
            {user.isAdmin && (
              <button
                onClick={() => setActivePage('admin')}
                className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  activePage === 'admin'
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Admin Suite</span>
              </button>
            )}

            {/* Authentication Buttons (When Logged Out) */}
            {!user.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Create Account</span>
                  <span className="sm:hidden">Sign Up</span>
                </button>
              </div>
            ) : (
              /* User Profile Menu (When Logged In) */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-sky-500/40 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 glass-panel rounded-2xl p-2 shadow-2xl border border-slate-700/80 z-50 text-slate-200 bg-[#0B1220]/95"
                    >
                      <div className="p-3 border-b border-slate-800 flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-sky-500/40"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            {user.isAdmin && (
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" title="Administrator" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="py-2 space-y-1">
                        <button
                          onClick={() => {
                            setActivePage('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-sky-400" />
                          <span>My Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setActivePage('favorites');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-400" />
                          <span>Saved Favorites ({user.favoriteIds.length})</span>
                        </button>

                        {/* Admin Only Upload Link */}
                        {user.isAdmin && (
                          <button
                            onClick={() => {
                              setActivePage('admin');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                          >
                            <Upload className="w-4 h-4 text-indigo-400" />
                            <span>Upload Wallpaper (Admin)</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            toggleTheme();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
                          <span>{theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            signOut();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden glass-panel border-t border-slate-800 px-4 py-6 space-y-4"
            >
              {/* Mobile Search Form */}
              <form onSubmit={handleQuickSearchSubmit} className="flex items-center relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search wallpapers..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:outline-none focus:border-sky-500"
                />
              </form>

              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                        isActive
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                {!user.isLoggedIn ? (
                  <div className="flex items-center gap-2 w-full justify-between">
                    <button
                      onClick={() => {
                        openAuthModal('signin');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-xs font-semibold text-sky-400"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('signup');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-xs font-semibold text-indigo-400"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-slate-400 truncate max-w-[180px]">
                      {user.email}
                    </span>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-400"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal Component */}
      <JoinModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
};
