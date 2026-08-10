import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
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
  LogIn,
  ChevronDown,
  MoreHorizontal
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
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
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

  interface NavItem {
    id: PageView;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string | number;
    adminOnly?: boolean;
  }

  // Primary top navbar items
  const primaryNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Explore', icon: Compass },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  // Secondary items placed in "More" dropdown for desktop
  const rawSecondaryItems: NavItem[] = [
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: user.favoriteIds.length > 0 ? user.favoriteIds.length : undefined },
    { id: 'contact', label: 'Request Wallpaper', icon: HelpCircle },
    { id: 'admin', label: 'Upload Suite', icon: Upload, adminOnly: true },
  ];

  const secondaryNavItems: NavItem[] = rawSecondaryItems.filter((item) => !item.adminOnly || user.isAdmin);

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activePage);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setJoinModalOpen(true);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo with Personal Browser Icon */}
          <div
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-sky-500/40 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src="/src/assets/images/app_logo_favicon_1786366764662.jpg"
                alt="Wallpaper Station Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white group-hover:text-sky-400 transition-colors">
                Wallpaper Station
              </span>
              <span className="hidden sm:block text-[9px] tracking-widest uppercase text-slate-400 font-medium">
                4K & 8K Ultra HD
              </span>
            </div>
          </div>

          {/* Compact Quick Search Input (Desktop) */}
          <form
            onSubmit={handleQuickSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-[180px] lg:max-w-[240px] xl:max-w-xs mx-2"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 4K wallpapers..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-slate-900/80 text-xs text-slate-100 placeholder-slate-500 rounded-full pl-8 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all"
            />
          </form>

          {/* Desktop Navigation (Compact + More Dropdown) */}
          <nav className="hidden lg:flex items-center gap-1 shrink">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-slate-800/90 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isSecondaryActive || moreDropdownOpen
                    ? 'text-sky-400 bg-sky-500/10 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
                <span>More</span>
                {user.favoriteIds.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                )}
                <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 glass-panel rounded-xl p-1.5 shadow-xl border border-slate-700/80 z-50 text-slate-200 bg-[#0B1220]/95"
                  >
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activePage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActivePage(item.id);
                            setMoreDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'text-sky-400 bg-sky-500/15 font-semibold'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions (Consolidated & Compact) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center gap-1.5 shadow-sm ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700/80 text-amber-400 hover:bg-slate-800 hover:border-amber-400/50'
                  : 'bg-white border-slate-200 text-sky-600 hover:bg-slate-50 hover:border-sky-400'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xl:inline">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden xl:inline">Night</span>
                </>
              )}
            </button>

            {/* Admin Suite Button - SHOWN ONLY IF ADMINISTRATOR UID */}
            {user.isAdmin && (
              <button
                onClick={() => setActivePage('admin')}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  activePage === 'admin'
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden xl:inline">Admin Suite</span>
              </button>
            )}

            {/* Authentication Buttons (When Logged Out) */}
            {!user.isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuthModal('signup')}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 transition-all shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
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
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-700"
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
                      className="absolute right-0 mt-2 w-60 glass-panel rounded-2xl p-2 shadow-2xl border border-slate-700/80 z-50 text-slate-200 bg-[#0B1220]/95"
                    >
                      <div className="p-2.5 border-b border-slate-800 flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-sky-500/40"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-bold text-white truncate">{user.name}</p>
                            {user.isAdmin && (
                              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" title="Administrator" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <button
                          onClick={() => {
                            setActivePage('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                          <span>My Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setActivePage('favorites');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 text-rose-400" />
                          <span>Saved Favorites ({user.favoriteIds.length})</span>
                        </button>

                        {/* Admin Only Upload Link */}
                        {user.isAdmin && (
                          <button
                            onClick={() => {
                              setActivePage('admin');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Upload Wallpaper (Admin)</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            toggleTheme();
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
                          <span>{theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            signOut();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
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
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              transition={{ duration: 0.2 }}
              className="lg:hidden glass-panel border-t border-slate-800 px-4 py-5 space-y-4"
            >
              {/* Mobile Search Form */}
              <form onSubmit={handleQuickSearchSubmit} className="flex items-center relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search wallpapers..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-sky-500"
                />
              </form>

              <div className="grid grid-cols-2 gap-2">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
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
