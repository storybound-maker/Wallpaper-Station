import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  Wallpaper,
  CategoryName,
  Collection,
  FilterState,
  UserProfile,
  ToastMessage,
  ResolutionOption,
} from '../types';

import {
  INITIAL_WALLPAPERS,
  CURATED_COLLECTIONS,
} from '../data/wallpapers';

import { AdModal } from '../components/AdModal';

import {
  isSupabaseConfigured,
  getSupabaseClient,
  fetchWallpapersFromSupabase,
  uploadWallpaperFileAndSave,
  insertWallpaperToSupabase,
  deleteWallpaperFromSupabase,
  incrementStatsInSupabase,
  seedInitialWallpapersToSupabase,
} from '../lib/supabase';

/**
 * ============================================================
 * ADMIN CONFIGURATION
 * ============================================================
 *
 * This is your Supabase Auth user's UUID.
 *
 * IMPORTANT:
 * This is NOT a secret.
 * Your real protection comes from Supabase RLS policies.
 */
const ADMIN_USER_ID = '188791bc-6d87-4d28-8716-0f1efcad00e1';

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

  downloadWallpaper: (
    wp: Wallpaper,
    resolution?: ResolutionOption
  ) => void;

  createCollection: (
    title: string,
    description: string
  ) => void;

  addToCollection: (
    collectionId: string,
    wallpaperId: string
  ) => void;

  addWallpaper: (
    newWp: Omit<
      Wallpaper,
      'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate'
    >
  ) => Promise<void>;

  uploadWallpaperWithFile: (
    file: File,
    metadata: Omit<
      Wallpaper,
      | 'id'
      | 'views'
      | 'downloads'
      | 'favorites'
      | 'uploadDate'
      | 'url'
      | 'thumbnailUrl'
    >
  ) => Promise<void>;

  deleteWallpaper: (id: string) => Promise<void>;

  editWallpaper: (
    id: string,
    updated: Partial<Wallpaper>
  ) => void;

  toasts: ToastMessage[];
  addToast: (
    message: string,
    type?: 'success' | 'info' | 'error'
  ) => void;

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

/**
 * IMPORTANT:
 * Do NOT make the default user an administrator.
 *
 * The real Supabase Auth session determines the user.
 */
const defaultUser: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  isLoggedIn: false,
  isAdmin: false,
  favoriteIds: [],
  downloadHistoryIds: [],
  userCollections: [],
};

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /**
   * ============================================================
   * THEME
   * ============================================================
   */

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ws_theme');

    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

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

  /**
   * ============================================================
   * WALLPAPERS
   * ============================================================
   */

  const [wallpapers, setWallpapers] =
    useState<Wallpaper[]>(INITIAL_WALLPAPERS);

  const resetToDefaultWallpapers = useCallback(() => {
    localStorage.removeItem('ws_wallpapers');
    setWallpapers(INITIAL_WALLPAPERS);
  }, []);

  const [isLoadingWallpapers, setIsLoadingWallpapers] =
    useState(true);

  const [wallpaperError, setWallpaperError] =
    useState<string | null>(null);

  const [isSupabaseConnected, setIsSupabaseConnected] =
    useState(isSupabaseConfigured());

  const [curatedCollections] =
    useState<Collection[]>(CURATED_COLLECTIONS);

  /**
   * ============================================================
   * AUTHENTICATED USER
   * ============================================================
   */

  const [user, setUser] = useState<UserProfile>(defaultUser);

  /**
   * Convert Supabase Auth user into the application's UserProfile.
   */
  const buildUserProfile = useCallback(
    (authUser: any): UserProfile => {
      if (!authUser) {
        return defaultUser;
      }

      const isAdmin =
        authUser.id === ADMIN_USER_ID;

      return {
        id: authUser.id,

        name:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split('@')[0] ||
          'User',

        email: authUser.email || '',

        avatar:
          authUser.user_metadata?.avatar_url ||
          '',

        isLoggedIn: true,

        /**
         * Admin is determined ONLY from the Supabase Auth UID.
         */
        isAdmin,

        favoriteIds: [],

        downloadHistoryIds: [],

        userCollections: [],
      };
    },
    []
  );

  /**
   * ============================================================
   * AUTH INITIALIZATION
   * ============================================================
   */

  useEffect(() => {
    const client = getSupabaseClient();

    if (!client) {
      console.warn(
        'Supabase client unavailable. User is treated as logged out.'
      );

      setUser(defaultUser);
      return;
    }

    let mounted = true;

    /**
     * Get the current authenticated session.
     */
    const loadSession = async () => {
      const {
        data,
        error,
      } = await client.auth.getSession();

      if (error) {
        console.error(
          'Could not load Supabase session:',
          error
        );

        if (mounted) {
          setUser(defaultUser);
        }

        return;
      }

      if (!mounted) return;

      if (data.session?.user) {
        setUser(
          buildUserProfile(data.session.user)
        );
      } else {
        setUser(defaultUser);
      }
    };

    loadSession();

    /**
     * Keep React state synchronized with Supabase Auth.
     */
    const {
      data: authListener,
    } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(
            buildUserProfile(session.user)
          );
        } else {
          setUser(defaultUser);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [buildUserProfile]);

  /**
   * ============================================================
   * USER COLLECTIONS
   * ============================================================
   */

  const [userCollections, setUserCollections] =
    useState<Collection[]>(() => {
      const saved =
        localStorage.getItem(
          'ws_user_collections'
        );

      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }

      return [
        {
          id: 'ucol-1',
          title: 'Desktop Favorites',
          description:
            'Selected 4K backgrounds for wide high-resolution screens.',
          coverUrl:
            'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
          itemCount: 2,
          wallpaperIds: ['wp-1', 'wp-2'],
        },
      ];
    });

  /**
   * ============================================================
   * NAVIGATION / FILTERS
   * ============================================================
   */

  const [activePage, setActivePage] =
    useState<PageView>('home');

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryName | 'All'>('All');

  const [selectedCollectionId, setSelectedCollectionId] =
    useState<string | null>(null);

  const [activeWallpaper, setActiveWallpaper] =
    useState<Wallpaper | null>(null);

  const [filters, setFilters] =
    useState<FilterState>(defaultFilters);

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  /**
   * ============================================================
   * AD DOWNLOAD MODAL
   * ============================================================
   */

  const [isAdModalOpen, setIsAdModalOpen] =
    useState(false);

  const [adModalWallpaper, setAdModalWallpaper] =
    useState<Wallpaper | null>(null);

  const [adModalResolution, setAdModalResolution] =
    useState<ResolutionOption>('8K');

  /**
   * ============================================================
   * TOASTS
   * ============================================================
   */

  const removeToast = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    },
    []
  );

  const addToast = useCallback(
    (
      message: string,
      type: 'success' | 'info' | 'error' = 'success'
    ) => {
      const id =
        Date.now().toString() +
        Math.random()
          .toString(36)
          .substring(2, 5);

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          message,
        },
      ]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  /**
   * ============================================================
   * ADMIN SECURITY HELPER
   * ============================================================
   *
   * This prevents normal users from even attempting admin
   * operations through the frontend.
   *
   * Supabase RLS remains the actual security boundary.
   */

  const requireAdmin = useCallback((): boolean => {
    if (!user.isLoggedIn) {
      addToast(
        'You must be logged in to perform this action.',
        'error'
      );

      return false;
    }

    if (!user.isAdmin) {
      addToast(
        'You do not have administrator permission.',
        'error'
      );

      return false;
    }

    return true;
  }, [user.isLoggedIn, user.isAdmin, addToast]);

  /**
   * ============================================================
   * LOAD WALLPAPERS FROM SUPABASE
   * ============================================================
   */

  const refetchWallpapers = useCallback(
    async () => {
      setIsLoadingWallpapers(true);
      setWallpaperError(null);

      if (!isSupabaseConfigured()) {
        setIsSupabaseConnected(false);
        setIsLoadingWallpapers(false);
        return;
      }

      try {
        const data =
          await fetchWallpapersFromSupabase();

        setIsSupabaseConnected(true);

        if (data && data.length > 0) {
          setWallpapers(data);
        } else {
          setWallpapers(INITIAL_WALLPAPERS);
        }
      } catch (err: any) {
        console.warn(
          'Could not fetch wallpapers from Supabase:',
          err
        );

        setIsSupabaseConnected(false);

        setWallpaperError(
          err?.message ||
            'Could not connect to Supabase.'
        );

        const saved =
          localStorage.getItem(
            'ws_wallpapers'
          );

        if (saved) {
          try {
            setWallpapers(
              JSON.parse(saved)
            );
          } catch {
            setWallpapers(
              INITIAL_WALLPAPERS
            );
          }
        } else {
          setWallpapers(
            INITIAL_WALLPAPERS
          );
        }
      } finally {
        setIsLoadingWallpapers(false);
      }
    },
    []
  );

  useEffect(() => {
    refetchWallpapers();
  }, [refetchWallpapers]);

  /**
   * ============================================================
   * LOCAL BACKUPS
   * ============================================================
   */

  useEffect(() => {
    localStorage.setItem(
      'ws_wallpapers',
      JSON.stringify(wallpapers)
    );
  }, [wallpapers]);

  useEffect(() => {
    localStorage.setItem(
      'ws_user_profile',
      JSON.stringify(user)
    );
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      'ws_user_collections',
      JSON.stringify(
        userCollections
      )
    );
  }, [userCollections]);

  /**
   * ============================================================
   * SCROLL
   * ============================================================
   */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [activePage]);

  /**
   * ============================================================
   * FAVORITES
   * ============================================================
   */

  const toggleFavorite = (
    id: string
  ) => {
    setUser((prev) => {
      const exists =
        prev.favoriteIds.includes(id);

      const newFavs = exists
        ? prev.favoriteIds.filter(
            (favId) =>
              favId !== id
          )
        : [
            ...prev.favoriteIds,
            id,
          ];

      setWallpapers((wps) =>
        wps.map((wp) =>
          wp.id === id
            ? {
                ...wp,
                favorites:
                  wp.favorites +
                  (exists
                    ? -1
                    : 1),
              }
            : wp
        )
      );

      if (isSupabaseConnected) {
        incrementStatsInSupabase(
          id,
          'favorites',
          exists ? -1 : 1
        ).catch(() => {});
      }

      addToast(
        exists
          ? 'Removed wallpaper from favorites'
          : 'Saved wallpaper to favorites!',
        exists
          ? 'info'
          : 'success'
      );

      return {
        ...prev,
        favoriteIds: newFavs,
      };
    });
  };

  /**
   * ============================================================
   * DOWNLOAD WALLPAPER
   * ============================================================
   */

  const downloadWallpaper = async (
    wp: Wallpaper,
    resolution: ResolutionOption = '4K',
    isAdVerified = false
  ) => {
    if (
      resolution === '8K' &&
      !isAdVerified
    ) {
      setAdModalWallpaper(wp);
      setAdModalResolution('8K');
      setIsAdModalOpen(true);
      return;
    }

    setWallpapers((prev) =>
      prev.map((w) =>
        w.id === wp.id
          ? {
              ...w,
              downloads:
                w.downloads + 1,
            }
          : w
      )
    );

    if (isSupabaseConnected) {
      incrementStatsInSupabase(
        wp.id,
        'downloads',
        1
      ).catch(() => {});
    }

    setUser((prev) => ({
      ...prev,
      downloadHistoryIds:
        Array.from(
          new Set([
            wp.id,
            ...prev.downloadHistoryIds,
          ])
        ),
    }));

    const fileName =
      `${wp.title
        .toLowerCase()
        .replace(
          /[^a-z0-9]/g,
          '-'
        )}-${resolution.toLowerCase()}.jpg`;

    addToast(
      `Preparing download for ${wp.title} (${resolution})...`,
      'info'
    );

    if (
      wp.url.startsWith('data:')
    ) {
      const link =
        document.createElement(
          'a'
        );

      link.href = wp.url;
      link.download = fileName;

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      addToast(
        `Downloaded ${wp.title}!`,
        'success'
      );

      return;
    }

    try {
      const response =
        await fetch(wp.url, {
          mode: 'cors',
        });

      if (response.ok) {
        const blob =
          await response.blob();

        const blobUrl =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            'a'
          );

        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        setTimeout(() => {
          URL.revokeObjectURL(
            blobUrl
          );
        }, 10000);

        addToast(
          `Downloaded ${wp.title} (${resolution})!`,
          'success'
        );

        return;
      }
    } catch {
      // Continue to fallback.
    }

    const fallbackLink = () => {
      const link =
        document.createElement(
          'a'
        );

      link.href = wp.url;
      link.download = fileName;
      link.target = '_blank';

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      addToast(
        `Opened image download link for ${wp.title}!`,
        'success'
      );
    };

    const img =
      new Image();

    img.crossOrigin =
      'anonymous';

    img.onload = () => {
      try {
        const canvas =
          document.createElement(
            'canvas'
          );

        canvas.width =
          img.naturalWidth ||
          1920;

        canvas.height =
          img.naturalHeight ||
          1080;

        const ctx =
          canvas.getContext(
            '2d'
          );

        if (ctx) {
          ctx.drawImage(
            img,
            0,
            0
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                fallbackLink();
                return;
              }

              const blobUrl =
                URL.createObjectURL(
                  blob
                );

              const link =
                document.createElement(
                  'a'
                );

              link.href =
                blobUrl;

              link.download =
                fileName;

              document.body.appendChild(
                link
              );

              link.click();

              document.body.removeChild(
                link
              );

              setTimeout(() => {
                URL.revokeObjectURL(
                  blobUrl
                );
              }, 10000);

              addToast(
                `Downloaded ${wp.title} (${resolution})!`,
                'success'
              );
            },
            'image/jpeg',
            0.95
          );

          return;
        }
      } catch {
        fallbackLink();
      }

      fallbackLink();
    };

    img.onerror =
      fallbackLink;

    img.src = wp.url;
  };

  /**
   * ============================================================
   * COLLECTIONS
   * ============================================================
   */

  const createCollection = (
    title: string,
    description: string
  ) => {
    const newCol: Collection = {
      id:
        'ucol-' +
        Date.now(),

      title,
      description,

      coverUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',

      itemCount: 0,
      wallpaperIds: [],
    };

    setUserCollections(
      (prev) => [
        newCol,
        ...prev,
      ]
    );

    addToast(
      `Collection "${title}" created successfully!`,
      'success'
    );
  };

  const addToCollection = (
    collectionId: string,
    wallpaperId: string
  ) => {
    setUserCollections(
      (prev) =>
        prev.map((col) => {
          if (
            col.id !==
            collectionId
          ) {
            return col;
          }

          if (
            col.wallpaperIds.includes(
              wallpaperId
            )
          ) {
            addToast(
              'Wallpaper is already in this collection',
              'info'
            );

            return col;
          }

          addToast(
            `Added to collection "${col.title}"`,
            'success'
          );

          return {
            ...col,

            itemCount:
              col.itemCount + 1,

            wallpaperIds: [
              ...col.wallpaperIds,
              wallpaperId,
            ],
          };
        })
    );
  };

  /**
   * ============================================================
   * ADMIN: FILE UPLOAD
   * ============================================================
   */

  const uploadWallpaperWithFile =
    async (
      file: File,
      metadata: Omit<
        Wallpaper,
        | 'id'
        | 'views'
        | 'downloads'
        | 'favorites'
        | 'uploadDate'
        | 'url'
        | 'thumbnailUrl'
      >
    ) => {
      if (!requireAdmin()) {
        return;
      }

      if (
        !isSupabaseConfigured()
      ) {
        addToast(
          'Supabase is not configured. Uploads are disabled.',
          'error'
        );

        return;
      }

      addToast(
        'Uploading wallpaper image...',
        'info'
      );

      try {
        const created =
          await uploadWallpaperFileAndSave(
            {
              file,
              metadata,
            }
          );

        setWallpapers(
          (prev) => [
            created,
            ...prev,
          ]
        );

        addToast(
          `Uploaded & published "${created.title}"!`,
          'success'
        );
      } catch (err: any) {
        console.error(
          'Admin upload failed:',
          err
        );

        addToast(
          err?.message ||
            'Upload failed. Make sure you are the administrator and Storage policies are configured.',
          'error'
        );

        throw err;
      }
    };

  /**
   * ============================================================
   * ADMIN: ADD WALLPAPER URL
   * ============================================================
   */

  const addWallpaper = async (
    newWp: Omit<
      Wallpaper,
      | 'id'
      | 'views'
      | 'downloads'
      | 'favorites'
      | 'uploadDate'
    >
  ) => {
    if (!requireAdmin()) {
      return;
    }

    if (
      !isSupabaseConfigured()
    ) {
      addToast(
        'Supabase is not configured. Publishing is disabled.',
        'error'
      );

      return;
    }

    try {
      addToast(
        'Saving wallpaper to Supabase...',
        'info'
      );

      const created =
        await insertWallpaperToSupabase(
          newWp
        );

      setWallpapers(
        (prev) => [
          created,
          ...prev,
        ]
      );

      addToast(
        `Wallpaper "${created.title}" published!`,
        'success'
      );
    } catch (err: any) {
      console.error(
        'Admin publish failed:',
        err
      );

      addToast(
        err?.message ||
          'Could not publish wallpaper.',
        'error'
      );

      throw err;
    }
  };

  /**
   * ============================================================
   * ADMIN: DELETE WALLPAPER
   * ============================================================
   */

  const deleteWallpaper =
    async (id: string) => {
      if (!requireAdmin()) {
        return;
      }

      try {
        await deleteWallpaperFromSupabase(
          id
        );

        setWallpapers(
          (prev) =>
            prev.filter(
              (w) =>
                w.id !== id
            )
        );

        if (
          activeWallpaper?.id ===
          id
        ) {
          setActiveWallpaper(
            null
          );
        }

        addToast(
          'Wallpaper removed.',
          'success'
        );
      } catch (err: any) {
        console.error(
          'Delete failed:',
          err
        );

        addToast(
          err?.message ||
            'Could not delete wallpaper. You may not have permission.',
          'error'
        );

        throw err;
      }
    };

  /**
   * ============================================================
   * ADMIN: EDIT WALLPAPER
   * ============================================================
   *
   * This updates the local UI.
   *
   * For permanent database editing, your supabase.ts should
   * also contain an updateWallpaper function.
   */

  const editWallpaper = (
    id: string,
    updated: Partial<Wallpaper>
  ) => {
    if (!requireAdmin()) {
      return;
    }

    setWallpapers(
      (prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                ...updated,
              }
            : w
        )
    );

    addToast(
      'Wallpaper details updated.',
      'success'
    );
  };

  /**
   * ============================================================
   * ADMIN: SEED DATABASE
   * ============================================================
   */

  const seedSupabaseDatabase =
    async () => {
      if (!requireAdmin()) {
        return;
      }

      if (
        !isSupabaseConfigured()
      ) {
        addToast(
          'Supabase is not configured.',
          'error'
        );

        return;
      }

      try {
        addToast(
          'Seeding wallpapers table...',
          'info'
        );

        const seeded =
          await seedInitialWallpapersToSupabase(
            INITIAL_WALLPAPERS
          );

        if (
          seeded &&
          seeded.length > 0
        ) {
          setWallpapers(
            seeded
          );

          setIsSupabaseConnected(
            true
          );

          addToast(
            `Successfully seeded ${seeded.length} wallpapers!`,
            'success'
          );
        } else {
          await refetchWallpapers();
        }
      } catch (err: any) {
        console.error(
          'Seeding failed:',
          err
        );

        addToast(
          err?.message ||
            'Seeding failed.',
          'error'
        );

        throw err;
      }
    };

  /**
   * ============================================================
   * FILTERS
   * ============================================================
   */

  const resetFilters = () => {
    setFilters(
      defaultFilters
    );

    setSelectedCategory(
      'All'
    );
  };

  const triggerSearch = (
    query: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));

    setActivePage(
      'search'
    );
  };

  /**
   * ============================================================
   * PROVIDER
   * ============================================================
   */

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
        onClose={() =>
          setIsAdModalOpen(false)
        }
        wallpaper={
          adModalWallpaper
        }
        resolution={
          adModalResolution
        }
        onAdComplete={() => {
          if (
            adModalWallpaper
          ) {
            downloadWallpaper(
              adModalWallpaper,
              adModalResolution,
              true
            );
          }
        }}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};
