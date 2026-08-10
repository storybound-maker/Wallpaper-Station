import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Wallpaper, CategoryName, Collection, FilterState, UserProfile, ToastMessage, ResolutionOption } from '../types';
import { INITIAL_WALLPAPERS, CURATED_COLLECTIONS } from '../data/wallpapers';
import { AdModal } from '../components/AdModal';
import {
  isSupabaseConfigured,
  getSupabaseClient,
  ADMIN_SUPABASE_UID,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  sendPasswordResetEmail,
  fetchWallpapersFromSupabase,
  uploadWallpaperFileAndSave,
  insertWallpaperToSupabase,
  deleteWallpaperFromSupabase,
  updateWallpaperInSupabase,
  incrementStatsInSupabase,
  seedInitialWallpapersToSupabase
} from '../lib/supabase';

export type PageView =
  | 'home'
  | 'search'
  | 'categories'
  | 'trending'
  | 'latest'
  | 'collections'
  | 'favorites'
  | 'admin'
  | 'profile'
  | 'about'
  | 'contact'
  | 'legal'
  | 'ai-generator';

export type ThemeMode = 'dark' | 'light';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  resetToDefaultWallpapers: () => void;
  wallpapers: Wallpaper[];
  isLoadingWallpapers: boolean;
  wallpaperError: string | null;
  isSupabaseConnected: boolean;
  curatedCollections: Collection[];
  userCollections: Collection[];
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  selectedCategory: CategoryName | 'All';
  setSelectedCategory: (cat: CategoryName | 'All') => void;
  selectedCollectionId: string | null;
  setSelectedCollectionId: (colId: string | null) => void;
  activeWallpaper: Wallpaper | null;
  setActiveWallpaper: (wp: Wallpaper | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  user: UserProfile;
  session: Session | null;
  authUser: User | null;
  isAuthLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  toggleFavorite: (id: string) => void;
  downloadWallpaper: (wp: Wallpaper, resolution?: ResolutionOption) => void;
  createCollection: (title: string, description: string) => void;
  addToCollection: (collectionId: string, wallpaperId: string) => void;
  addWallpaper: (newWp: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate'>) => Promise<void>;
  uploadWallpaperWithFile: (
    file: File,
    metadata: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate' | 'url' | 'thumbnailUrl'>
  ) => Promise<void>;
  deleteWallpaper: (id: string) => Promise<void>;
  editWallpaper: (id: string, updated: Partial<Wallpaper>) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  resetFilters: () => void;
  triggerSearch: (query: string) => void;
  seedSupabaseDatabase: () => Promise<void>;
  refetchWallpapers: () => Promise<void>;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  resolutionTag: 'All',
  orientation: 'All',
  color: 'All',
  sortBy: 'popularity',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ws_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('ws_theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(INITIAL_WALLPAPERS);

  const resetToDefaultWallpapers = useCallback(() => {
    localStorage.removeItem('ws_wallpapers');
    setWallpapers(INITIAL_WALLPAPERS);
  }, []);

  const [isLoadingWallpapers, setIsLoadingWallpapers] = useState<boolean>(true);
  const [wallpaperError, setWallpaperError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured());

  const [curatedCollections] = useState<Collection[]>(CURATED_COLLECTIONS);

  // --- Real Supabase Authentication State ---
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ws_favorite_ids');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['wp-1', 'wp-2', 'wp-4', 'wp-6'];
  });

  const [downloadHistoryIds, setDownloadHistoryIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ws_download_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['wp-1', 'wp-3'];
  });

  const [userCollections, setUserCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('ws_user_collections');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'ucol-1',
        title: 'Desktop Favorites',
        description: 'Selected 4K backgrounds for wide high-resolution screens.',
        coverUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
        itemCount: 2,
        wallpaperIds: ['wp-1', 'wp-2'],
      }
    ];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Supabase Auth Session
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setIsAuthLoading(false);
      return;
    }

    // 1. Get initial session
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Supabase getSession error:', error);
      }
      setSession(session);
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Derive UserProfile from real auth session
  const isAdmin = authUser?.id === ADMIN_SUPABASE_UID;
  const userEmail = authUser?.email || 'guest';
  const fallbackAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`;
  const avatarUrl = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || fallbackAvatar;

  const user: UserProfile = {
    id: authUser ? authUser.id : '',
    name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || (authUser?.email ? authUser.email.split('@')[0] : 'Guest User'),
    email: authUser?.email || '',
    avatar: avatarUrl,
    isLoggedIn: Boolean(authUser),
    isAdmin: isAdmin,
    favoriteIds,
    downloadHistoryIds,
    userCollections,
  };

  // Auth Functions
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        addToast(error.message, 'error');
        return { error };
      }
      addToast('Signed in successfully!', 'success');
      return { error: null };
    } catch (err: any) {
      addToast(err.message || 'Sign in failed', 'error');
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await signUpWithEmail(email, password, name);
      if (error) {
        addToast(error.message, 'error');
        return { error, user: null };
      }
      addToast('Account created successfully!', 'success');
      return { error: null, user: data.user };
    } catch (err: any) {
      addToast(err.message || 'Sign up failed', 'error');
      return { error: err, user: null };
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      addToast('Signed out successfully', 'info');
    } catch (err: any) {
      addToast('Error signing out', 'error');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await sendPasswordResetEmail(email);
      if (error) {
        addToast(error.message, 'error');
        return { error };
      }
      addToast('Password reset email sent!', 'success');
      return { error: null };
    } catch (err: any) {
      addToast(err.message || 'Failed to send reset email', 'error');
      return { error: err };
    }
  };

  const [activePage, setActivePage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | 'All'>('All');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [activeWallpaper, setActiveWallpaper] = useState<Wallpaper | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // 8K Ad Download Modal State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adModalWallpaper, setAdModalWallpaper] = useState<Wallpaper | null>(null);
  const [adModalResolution, setAdModalResolution] = useState<ResolutionOption>('8K');

  // Load wallpapers from Supabase
  const refetchWallpapers = useCallback(async () => {
    setIsLoadingWallpapers(true);
    setWallpaperError(null);

    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      setIsLoadingWallpapers(false);
      return;
    }

    try {
      const data = await fetchWallpapersFromSupabase();
      setIsSupabaseConnected(true);

      if (data && data.length > 0) {
        setWallpapers(data);
      } else {
        setWallpapers(INITIAL_WALLPAPERS);
      }
    } catch (err: any) {
      console.warn('Could not fetch from Supabase table:', err);
      setIsSupabaseConnected(false);
      setWallpaperError(
        err.message || 'Could not connect to Supabase database table "wallpapers". Please check SQL schema.'
      );
      setWallpapers(INITIAL_WALLPAPERS);
    } finally {
      setIsLoadingWallpapers(false);
    }
  }, []);

  useEffect(() => {
    refetchWallpapers();
  }, [refetchWallpapers]);

  // Backup favorite IDs and download history in localStorage
  useEffect(() => {
    localStorage.setItem('ws_favorite_ids', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem('ws_download_history', JSON.stringify(downloadHistoryIds));
  }, [downloadHistoryIds]);

  useEffect(() => {
    localStorage.setItem('ws_user_collections', JSON.stringify(userCollections));
  }, [userCollections]);

  // Sync scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const toggleFavorite = (id: string) => {
    const exists = favoriteIds.includes(id);
    const newFavs = exists
      ? favoriteIds.filter((favId) => favId !== id)
      : [...favoriteIds, id];

    setFavoriteIds(newFavs);

    // Update wallpaper favorite count
    setWallpapers((wps) =>
      wps.map((wp) =>
        wp.id === id ? { ...wp, favorites: Math.max(0, wp.favorites + (exists ? -1 : 1)) } : wp
      )
    );

    // Increment in Supabase asynchronously
    if (isSupabaseConnected) {
      incrementStatsInSupabase(id, 'favorites', exists ? -1 : 1).catch(() => {});
    }

    addToast(
      exists ? 'Removed wallpaper from favorites' : 'Saved wallpaper to favorites!',
      exists ? 'info' : 'success'
    );
  };

  const downloadWallpaper = async (
    wp: Wallpaper,
    resolution: ResolutionOption = '4K',
    isAdVerified = false
  ) => {
    if (resolution === '8K' && !isAdVerified) {
      setAdModalWallpaper(wp);
      setAdModalResolution('8K');
      setIsAdModalOpen(true);
      return;
    }

    setWallpapers((prev) =>
      prev.map((w) => (w.id === wp.id ? { ...w, downloads: w.downloads + 1 } : w))
    );

    if (isSupabaseConnected) {
      incrementStatsInSupabase(wp.id, 'downloads', 1).catch(() => {});
    }

    setDownloadHistoryIds((prev) => Array.from(new Set([wp.id, ...prev])));

    const fileName = `${wp.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${resolution.toLowerCase()}.jpg`;
    addToast(`Preparing download for ${wp.title} (${resolution})...`, 'info');

    if (wp.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = wp.url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast(`Downloaded ${wp.title}!`, 'success');
      return;
    }

    try {
      const response = await fetch(wp.url, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        addToast(`Downloaded ${wp.title} (${resolution})!`, 'success');
        return;
      }
    } catch {
      // Fallback below
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1920;
        canvas.height = img.naturalHeight || 1080;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                addToast(`Downloaded ${wp.title} (${resolution})!`, 'success');
              } else {
                fallbackLink();
              }
            },
            'image/jpeg',
            0.95
          );
          return;
        }
      } catch {
        fallbackLink();
      }
    };
    img.onerror = () => {
      fallbackLink();
    };

    const fallbackLink = () => {
      const link = document.createElement('a');
      link.href = wp.url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast(`Opened image download link for ${wp.title}!`, 'success');
    };

    img.src = wp.url;
  };

  const createCollection = (title: string, description: string) => {
    const newCol: Collection = {
      id: 'ucol-' + Date.now(),
      title,
      description,
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      itemCount: 0,
      wallpaperIds: [],
    };
    setUserCollections((prev) => [newCol, ...prev]);
    addToast(`Collection "${title}" created successfully!`, 'success');
  };

  const addToCollection = (collectionId: string, wallpaperId: string) => {
    setUserCollections((prev) =>
      prev.map((col) => {
        if (col.id === collectionId) {
          if (col.wallpaperIds.includes(wallpaperId)) {
            addToast('Wallpaper is already in this collection', 'info');
            return col;
          }
          addToast(`Added to collection "${col.title}"`, 'success');
          return {
            ...col,
            itemCount: col.itemCount + 1,
            wallpaperIds: [...col.wallpaperIds, wallpaperId],
          };
        }
        return col;
      })
    );
  };

  // Upload image file to Supabase Storage & insert DB record
  // STRICT REQUIREMENT: No base64 Data URL fallback in localStorage!
  const uploadWallpaperWithFile = async (
    file: File,
    metadata: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate' | 'url' | 'thumbnailUrl'>
  ) => {
    if (!user.isAdmin) {
      addToast('Only the administrator UID can upload wallpapers.', 'error');
      throw new Error('Unauthorized: Administrator access required.');
    }

    addToast('Uploading wallpaper image to Supabase Storage...', 'info');

    if (!isSupabaseConfigured()) {
      const errorMsg = 'Supabase client is not configured. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      addToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }

    try {
      const created = await uploadWallpaperFileAndSave({ file, metadata });
      setWallpapers((prev) => [created, ...prev]);
      addToast(`Uploaded & published "${created.title}" to Supabase!`, 'success');
    } catch (err: any) {
      console.error('Supabase upload failed:', err);
      const errorMsg = err.message || 'Supabase upload failed.';
      addToast(`Upload failed: ${errorMsg}`, 'error');
      throw err;
    }
  };

  // Add wallpaper via image URL to Supabase DB table
  const addWallpaper = async (
    newWp: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate'>
  ) => {
    if (!user.isAdmin) {
      addToast('Only the administrator UID can publish wallpapers.', 'error');
      throw new Error('Unauthorized: Administrator access required.');
    }

    if (!isSupabaseConfigured()) {
      const errorMsg = 'Supabase client is not configured. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
      addToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }

    try {
      addToast('Saving wallpaper to Supabase database...', 'info');
      const created = await insertWallpaperToSupabase(newWp);
      setWallpapers((prev) => [created, ...prev]);
      addToast(`Wallpaper "${created.title}" published to Supabase!`, 'success');
    } catch (err: any) {
      console.error('Supabase insert failed:', err);
      const errorMsg = err.message || 'Database insert failed.';
      addToast(`Publish failed: ${errorMsg}`, 'error');
      throw err;
    }
  };

  const deleteWallpaper = async (id: string) => {
    if (!user.isAdmin) {
      addToast('Only the administrator UID can delete wallpapers.', 'error');
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        await deleteWallpaperFromSupabase(id);
        addToast('Wallpaper removed from Supabase', 'info');
      } catch (err: any) {
        addToast(`Delete failed: ${err.message || 'Could not delete wallpaper'}`, 'error');
        return;
      }
    }
    setWallpapers((prev) => prev.filter((w) => w.id !== id));
    if (activeWallpaper?.id === id) {
      setActiveWallpaper(null);
    }
  };

  const editWallpaper = async (id: string, updated: Partial<Wallpaper>) => {
    if (!user.isAdmin) {
      addToast('Only the administrator UID can edit wallpapers.', 'error');
      return;
    }
    if (isSupabaseConfigured()) {
      try {
        await updateWallpaperInSupabase(id, updated);
        addToast('Wallpaper updated in Supabase!', 'success');
      } catch (err: any) {
        addToast(`Edit failed: ${err.message || 'Could not update wallpaper'}`, 'error');
        return;
      }
    }
    setWallpapers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
    if (activeWallpaper?.id === id) {
      setActiveWallpaper((prev) => (prev ? { ...prev, ...updated } : null));
    }
    if (!isSupabaseConfigured()) {
      addToast('Wallpaper details updated locally', 'success');
    }
  };

  const seedSupabaseDatabase = async () => {
    if (!isSupabaseConfigured()) {
      addToast('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment first', 'error');
      return;
    }

    try {
      addToast('Seeding wallpapers table in Supabase...', 'info');
      const seeded = await seedInitialWallpapersToSupabase(INITIAL_WALLPAPERS);
      if (seeded && seeded.length > 0) {
        setWallpapers(seeded);
        setIsSupabaseConnected(true);
        addToast(`Successfully seeded ${seeded.length} wallpapers into Supabase!`, 'success');
      } else {
        refetchWallpapers();
      }
    } catch (err: any) {
      addToast(`Seeding failed: ${err.message || 'Make sure wallpapers table exists'}`, 'error');
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSelectedCategory('All');
  };

  const triggerSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    setActivePage('search');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        resetToDefaultWallpapers,
        wallpapers,
        isLoadingWallpapers,
        wallpaperError,
        isSupabaseConnected,
        curatedCollections,
        userCollections,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        selectedCollectionId,
        setSelectedCollectionId,
        activeWallpaper,
        setActiveWallpaper,
        filters,
        setFilters,
        user,
        session,
        authUser,
        isAuthLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        toggleFavorite,
        downloadWallpaper,
        createCollection,
        addToCollection,
        addWallpaper,
        uploadWallpaperWithFile,
        deleteWallpaper,
        editWallpaper,
        toasts,
        addToast,
        removeToast,
        resetFilters,
        triggerSearch,
        seedSupabaseDatabase,
        refetchWallpapers,
      }}
    >
      {children}
      <AdModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        wallpaper={adModalWallpaper}
        resolution={adModalResolution}
        onAdComplete={() => {
          if (adModalWallpaper) {
            downloadWallpaper(adModalWallpaper, adModalResolution, true);
          }
        }}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
