import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Wallpaper, CategoryName, Collection, FilterState, UserProfile, ToastMessage, ResolutionOption } from '../types';
import { INITIAL_WALLPAPERS, CURATED_COLLECTIONS } from '../data/wallpapers';
import { AdModal } from '../components/AdModal';
import {
  isSupabaseConfigured,
  fetchWallpapersFromSupabase,
  uploadWallpaperFileAndSave,
  insertWallpaperToSupabase,
  deleteWallpaperFromSupabase,
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
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
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

const defaultUser: UserProfile = {
  id: 'usr-1',
  name: 'Alex Vance',
  email: 'alex.vance@wallpaperstation.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isLoggedIn: true,
  isAdmin: true,
  favoriteIds: ['wp-1', 'wp-2', 'wp-4', 'wp-6'],
  downloadHistoryIds: ['wp-1', 'wp-3'],
  userCollections: [],
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

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ws_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultUser;
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

  const [activePage, setActivePage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | 'All'>('All');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [activeWallpaper, setActiveWallpaper] = useState<Wallpaper | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 8K Ad Download Modal State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adModalWallpaper, setAdModalWallpaper] = useState<Wallpaper | null>(null);
  const [adModalResolution, setAdModalResolution] = useState<ResolutionOption>('8K');

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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
        // Table exists but is empty - keep initial state or allow seeding
        setWallpapers(INITIAL_WALLPAPERS);
      }
    } catch (err: any) {
      console.warn('Could not fetch from Supabase table:', err);
      setIsSupabaseConnected(false);
      setWallpaperError(
        err.message || 'Could not connect to Supabase database table "wallpapers". Please check SQL schema.'
      );
      // Fallback to local storage or initial wallpapers
      const saved = localStorage.getItem('ws_wallpapers');
      if (saved) {
        try { setWallpapers(JSON.parse(saved)); } catch { setWallpapers(INITIAL_WALLPAPERS); }
      } else {
        setWallpapers(INITIAL_WALLPAPERS);
      }
    } finally {
      setIsLoadingWallpapers(false);
    }
  }, []);

  useEffect(() => {
    refetchWallpapers();
  }, [refetchWallpapers]);

  // Persist local state backup
  useEffect(() => {
    localStorage.setItem('ws_wallpapers', JSON.stringify(wallpapers));
  }, [wallpapers]);

  useEffect(() => {
    localStorage.setItem('ws_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ws_user_collections', JSON.stringify(userCollections));
  }, [userCollections]);

  // Sync scroll on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const toggleFavorite = (id: string) => {
    setUser((prev) => {
      const exists = prev.favoriteIds.includes(id);
      const newFavs = exists
        ? prev.favoriteIds.filter((favId) => favId !== id)
        : [...prev.favoriteIds, id];

      // Update wallpaper favorite count
      setWallpapers((wps) =>
        wps.map((wp) =>
          wp.id === id ? { ...wp, favorites: wp.favorites + (exists ? -1 : 1) } : wp
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

      return { ...prev, favoriteIds: newFavs };
    });
  };

  const downloadWallpaper = async (
    wp: Wallpaper,
    resolution: ResolutionOption = '4K',
    isAdVerified = false
  ) => {
    // If 8K resolution requested and ad not verified yet, show Ad Modal
    if (resolution === '8K' && !isAdVerified) {
      setAdModalWallpaper(wp);
      setAdModalResolution('8K');
      setIsAdModalOpen(true);
      return;
    }

    // Increment downloads count in wallpapers state
    setWallpapers((prev) =>
      prev.map((w) => (w.id === wp.id ? { ...w, downloads: w.downloads + 1 } : w))
    );

    if (isSupabaseConnected) {
      incrementStatsInSupabase(wp.id, 'downloads', 1).catch(() => {});
    }

    // Save to user history
    setUser((prev) => ({
      ...prev,
      downloadHistoryIds: Array.from(new Set([wp.id, ...prev.downloadHistoryIds])),
    }));

    const fileName = `${wp.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${resolution.toLowerCase()}.jpg`;

    addToast(`Preparing download for ${wp.title} (${resolution})...`, 'info');

    // Case 1: Data URL
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

    // Case 2: Direct Blob fetch
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

    // Case 3: Canvas rendering method
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
  const uploadWallpaperWithFile = async (
    file: File,
    metadata: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate' | 'url' | 'thumbnailUrl'>
  ) => {
    addToast('Uploading wallpaper image...', 'info');

    // 1. If Supabase is configured, attempt upload to Storage & DB
    if (isSupabaseConfigured()) {
      try {
        const created = await uploadWallpaperFileAndSave({ file, metadata });
        setWallpapers((prev) => [created, ...prev]);
        addToast(`Uploaded & published "${created.title}" to Supabase!`, 'success');
        return;
      } catch (err: any) {
        console.warn('Supabase upload notice, converting to local image data:', err);
        addToast(`Cloud Storage Notice: ${err.message || 'Using local image mode'}. Published locally!`, 'info');
      }
    }

    // 2. Local Fallback: Convert file to Data URL so upload succeeds cleanly without breaking
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.readAsDataURL(file);
    });

    const created: Wallpaper = {
      ...metadata,
      id: 'wp-' + Date.now(),
      url: dataUrl,
      thumbnailUrl: dataUrl,
      views: 1,
      downloads: 0,
      favorites: 0,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setWallpapers((prev) => [created, ...prev]);
    addToast(`Published "${created.title}" successfully! (Set Supabase keys in Admin for cloud storage)`, 'success');
  };

  // Add wallpaper via image URL or local fallback
  const addWallpaper = async (
    newWp: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate'>
  ) => {
    if (isSupabaseConnected) {
      try {
        addToast('Saving wallpaper to Supabase database...', 'info');
        const created = await insertWallpaperToSupabase(newWp);
        setWallpapers((prev) => [created, ...prev]);
        addToast(`Wallpaper "${created.title}" published to Supabase!`, 'success');
        return;
      } catch (err: any) {
        console.warn('Falling back to local state:', err);
      }
    }

    const created: Wallpaper = {
      ...newWp,
      id: 'wp-' + Date.now(),
      views: 12,
      downloads: 0,
      favorites: 0,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setWallpapers((prev) => [created, ...prev]);
    addToast(`Wallpaper "${created.title}" published to local station state!`, 'success');
  };

  const deleteWallpaper = async (id: string) => {
    if (isSupabaseConnected) {
      try {
        await deleteWallpaperFromSupabase(id);
      } catch (err) {
        console.warn('Could not delete from Supabase:', err);
      }
    }
    setWallpapers((prev) => prev.filter((w) => w.id !== id));
    if (activeWallpaper?.id === id) {
      setActiveWallpaper(null);
    }
    addToast('Wallpaper removed', 'info');
  };

  const editWallpaper = (id: string, updated: Partial<Wallpaper>) => {
    setWallpapers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
    addToast('Wallpaper details updated', 'success');
  };

  const seedSupabaseDatabase = async () => {
    if (!isSupabaseConfigured()) {
      addToast('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your env first', 'error');
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
        setUser,
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
