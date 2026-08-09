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
  fetchWallpapersFromSupabase,
  uploadWallpaperFileAndSave,
  insertWallpaperToSupabase,
  deleteWallpaperFromSupabase,
  incrementStatsInSupabase,
  seedInitialWallpapersToSupabase,
  getCurrentUser,
  signInAdmin,
  signOutUser,
  ADMIN_UID,
} from '../lib/supabase';

/* ============================================================
   TYPES
   ============================================================ */

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

export type ThemeMode =
  | 'dark'
  | 'light';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (
    theme: ThemeMode
  ) => void;

  resetToDefaultWallpapers: () => void;

  wallpapers: Wallpaper[];

  isLoadingWallpapers: boolean;

  wallpaperError:
    | string
    | null;

  isSupabaseConnected: boolean;

  curatedCollections: Collection[];

  userCollections: Collection[];

  activePage: PageView;

  setActivePage: (
    page: PageView
  ) => void;

  selectedCategory:
    | CategoryName
    | 'All';

  setSelectedCategory: (
    cat:
      | CategoryName
      | 'All'
  ) => void;

  selectedCollectionId:
    | string
    | null;

  setSelectedCollectionId: (
    colId:
      | string
      | null
  ) => void;

  activeWallpaper:
    | Wallpaper
    | null;

  setActiveWallpaper: (
    wp:
      | Wallpaper
      | null
  ) => void;

  filters: FilterState;

  setFilters: React.Dispatch<
    React.SetStateAction<FilterState>
  >;

  user: UserProfile;

  setUser: React.Dispatch<
    React.SetStateAction<UserProfile>
  >;

  /* AUTH */

  authLoading: boolean;

  isAdmin: boolean;

  adminUser:
    | any
    | null;

  loginAdmin: (
    email: string,
    password: string
  ) => Promise<void>;

  logoutAdmin: () => Promise<void>;

  /* WALLPAPERS */

  toggleFavorite: (
    id: string
  ) => void;

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
      | 'id'
      | 'views'
      | 'downloads'
      | 'favorites'
      | 'uploadDate'
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

  deleteWallpaper: (
    id: string
  ) => Promise<void>;

  editWallpaper: (
    id: string,
    updated: Partial<Wallpaper>
  ) => void;

  toasts: ToastMessage[];

  addToast: (
    message: string,
    type?:
      | 'success'
      | 'info'
      | 'error'
  ) => void;

  removeToast: (
    id: string
  ) => void;

  resetFilters: () => void;

  triggerSearch: (
    query: string
  ) => void;

  seedSupabaseDatabase: () => Promise<void>;

  refetchWallpapers: () => Promise<void>;
}

/* ============================================================
   DEFAULT FILTERS
   ============================================================ */

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  resolutionTag: 'All',
  orientation: 'All',
  color: 'All',
  sortBy: 'popularity',
};

/* ============================================================
   DEFAULT LOCAL USER
   ============================================================ */

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

/* ============================================================
   CONTEXT
   ============================================================ */

const AppContext =
  createContext<
    AppContextType | undefined
  >(undefined);

/* ============================================================
   PROVIDER
   ============================================================ */

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  /* ==========================================================
     THEME
     ========================================================== */

  const [
    theme,
    setThemeState,
  ] = useState<ThemeMode>(() => {
    const saved =
      localStorage.getItem(
        'ws_theme'
      );

    return saved === 'light'
      ? 'light'
      : 'dark';
  });

  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);

      localStorage.setItem(
        'ws_theme',
        newTheme
      );
    },
    []
  );

  const toggleTheme =
    useCallback(() => {
      setTheme(
        theme === 'dark'
          ? 'light'
          : 'dark'
      );
    }, [theme, setTheme]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add(
        'light'
      );

      document.documentElement.classList.remove(
        'dark'
      );
    } else {
      document.documentElement.classList.add(
        'dark'
      );

      document.documentElement.classList.remove(
        'light'
      );
    }
  }, [theme]);

  /* ==========================================================
     WALLPAPERS
     ========================================================== */

  const [
    wallpapers,
    setWallpapers,
  ] = useState<Wallpaper[]>(
    INITIAL_WALLPAPERS
  );

  const [
    isLoadingWallpapers,
    setIsLoadingWallpapers,
  ] = useState(true);

  const [
    wallpaperError,
    setWallpaperError,
  ] = useState<string | null>(
    null
  );

  const [
    isSupabaseConnected,
    setIsSupabaseConnected,
  ] = useState(
    isSupabaseConfigured()
  );

  /* ==========================================================
     AUTH
     ========================================================== */

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const [
    adminUser,
    setAdminUser,
  ] = useState<any | null>(
    null
  );

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(false);

  /* ==========================================================
     USER
     ========================================================== */

  const [
    user,
    setUser,
  ] = useState<UserProfile>(
    defaultUser
  );

  /* ==========================================================
     COLLECTIONS
     ========================================================== */

  const [
    curatedCollections,
  ] = useState<Collection[]>(
    CURATED_COLLECTIONS
  );

  const [
    userCollections,
    setUserCollections,
  ] = useState<Collection[]>([]);

  /* ==========================================================
     PAGE STATE
     ========================================================== */

  const [
    activePage,
    setActivePage,
  ] = useState<PageView>('home');

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<
    CategoryName | 'All'
  >('All');

  const [
    selectedCollectionId,
    setSelectedCollectionId,
  ] = useState<
    string | null
  >(null);

  const [
    activeWallpaper,
    setActiveWallpaper,
  ] = useState<
    Wallpaper | null
  >(null);

  const [
    filters,
    setFilters,
  ] = useState<FilterState>(
    defaultFilters
  );

  const [
    toasts,
    setToasts,
  ] = useState<ToastMessage[]>([]);

  /* ==========================================================
     8K AD MODAL
     ========================================================== */

  const [
    isAdModalOpen,
    setIsAdModalOpen,
  ] = useState(false);

  const [
    adModalWallpaper,
    setAdModalWallpaper,
  ] = useState<
    Wallpaper | null
  >(null);

  const [
    adModalResolution,
    setAdModalResolution,
  ] = useState<ResolutionOption>(
    '8K'
  );

  /* ==========================================================
     TOASTS
     ========================================================== */

  const removeToast =
    useCallback((id: string) => {
      setToasts((prev) =>
        prev.filter(
          (toast) =>
            toast.id !== id
        )
      );
    }, []);

  const addToast =
    useCallback(
      (
        message: string,
        type:
          | 'success'
          | 'info'
          | 'error' = 'success'
      ) => {
        const id =
          Date.now().toString() +
          Math.random()
            .toString(36)
            .substring(2, 7);

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

  /* ==========================================================
     CHECK SUPABASE AUTH SESSION
     ========================================================== */

  const checkAuth =
    useCallback(async () => {
      if (!isSupabaseConfigured()) {
        setAdminUser(null);
        setIsAdmin(false);
        setUser(defaultUser);
        setAuthLoading(false);
        return;
      }

      try {
        const currentUser =
          await getCurrentUser();

        if (
          currentUser &&
          currentUser.id ===
            ADMIN_UID
        ) {
          setAdminUser(
            currentUser
          );

          setIsAdmin(true);

          setUser({
            ...defaultUser,
            id: currentUser.id,
            email:
              currentUser.email ||
              '',
            name:
              currentUser.user_metadata
                ?.full_name ||
              currentUser.email ||
              'Admin',
            isLoggedIn: true,
            isAdmin: true,
            favoriteIds: [],
            downloadHistoryIds: [],
          });
        } else {
          setAdminUser(null);
          setIsAdmin(false);

          setUser({
            ...defaultUser,
            id:
              currentUser?.id ||
              '',
            email:
              currentUser?.email ||
              '',
            name:
              currentUser?.email ||
              '',
            isLoggedIn:
              Boolean(currentUser),
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error(
          'Auth check failed:',
          error
        );

        setAdminUser(null);
        setIsAdmin(false);
        setUser(defaultUser);
      } finally {
        setAuthLoading(false);
      }
    }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /* ==========================================================
     ADMIN LOGIN
     ========================================================== */

  const loginAdmin =
    useCallback(
      async (
        email: string,
        password: string
      ) => {
        setAuthLoading(true);

        try {
          const loggedInUser =
            await signInAdmin(
              email,
              password
            );

          setAdminUser(
            loggedInUser
          );

          setIsAdmin(true);

          setUser({
            ...defaultUser,
            id: loggedInUser.id,
            email:
              loggedInUser.email ||
              email,
            name:
              loggedInUser
                .user_metadata
                ?.full_name ||
              loggedInUser.email ||
              'Admin',
            isLoggedIn: true,
            isAdmin: true,
            favoriteIds: [],
            downloadHistoryIds: [],
          });

          addToast(
            'Administrator login successful.',
            'success'
          );
        } catch (error: any) {
          setAdminUser(null);
          setIsAdmin(false);

          addToast(
            error?.message ||
              'Administrator login failed.',
            'error'
          );

          throw error;
        } finally {
          setAuthLoading(false);
        }
      },
      [addToast]
    );

  /* ==========================================================
     LOGOUT
     ========================================================== */

  const logoutAdmin =
    useCallback(async () => {
      try {
        await signOutUser();

        setAdminUser(null);
        setIsAdmin(false);

        setUser(defaultUser);

        addToast(
          'Signed out successfully.',
          'info'
        );
      } catch (error: any) {
        addToast(
          error?.message ||
            'Could not sign out.',
          'error'
        );
      }
    }, [addToast]);

  /* ==========================================================
     FETCH WALLPAPERS FROM SUPABASE
     ========================================================== */

  const refetchWallpapers =
    useCallback(async () => {
      setIsLoadingWallpapers(true);
      setWallpaperError(null);

      if (
        !isSupabaseConfigured()
      ) {
        setIsSupabaseConnected(
          false
        );

        setWallpapers(
          INITIAL_WALLPAPERS
        );

        setIsLoadingWallpapers(
          false
        );

        return;
      }

      try {
        const data =
          await fetchWallpapersFromSupabase();

        setIsSupabaseConnected(
          true
        );

        /*
          IMPORTANT:
          Supabase is now the source of truth.

          We do NOT save wallpapers to
          localStorage anymore.
        */

        setWallpapers(data);
      } catch (error: any) {
        console.error(
          'Could not load wallpapers:',
          error
        );

        setIsSupabaseConnected(
          false
        );

        setWallpaperError(
          error?.message ||
            'Could not load wallpapers from Supabase.'
        );

        /*
          We only show initial demo wallpapers
          if Supabase itself cannot be reached.
        */

        setWallpapers(
          INITIAL_WALLPAPERS
        );
      } finally {
        setIsLoadingWallpapers(
          false
        );
      }
    }, []);

  useEffect(() => {
    refetchWallpapers();
  }, [refetchWallpapers]);

  /* ==========================================================
     REMOVE OLD LOCAL WALLPAPER CACHE
     ========================================================== */

  useEffect(() => {
    /*
      Your previous application stored complete images
      inside localStorage.

      That caused:

      QuotaExceededError

      Remove that old cache once.
    */

    try {
      localStorage.removeItem(
        'ws_wallpapers'
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, []);

  /* ==========================================================
     USER COLLECTION LOCAL STORAGE
     ========================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        'ws_user_collections',
        JSON.stringify(
          userCollections
        )
      );
    } catch {
      // Ignore storage errors.
    }
  }, [userCollections]);

  /* ==========================================================
     PAGE SCROLL
     ========================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [activePage]);

  /* ==========================================================
     FAVORITES
     ========================================================== */

  const toggleFavorite = (
    id: string
  ) => {
    setUser((prev) => {
      const exists =
        prev.favoriteIds.includes(
          id
        );

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
                  Math.max(
                    0,
                    wp.favorites +
                      (exists
                        ? -1
                        : 1)
                  ),
              }
            : wp
        )
      );

      if (
        isSupabaseConnected
      ) {
        incrementStatsInSupabase(
          id,
          'favorites',
          exists ? -1 : 1
        ).catch(() => {});
      }

      addToast(
        exists
          ? 'Removed wallpaper from favorites.'
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

  /* ==========================================================
     DOWNLOAD
     ========================================================== */

  const downloadWallpaper =
    async (
      wp: Wallpaper,
      resolution:
        ResolutionOption = '4K',
      isAdVerified = false
    ) => {
      if (
        resolution === '8K' &&
        !isAdVerified
      ) {
        setAdModalWallpaper(wp);
        setAdModalResolution(
          '8K'
        );
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

      if (
        isSupabaseConnected
      ) {
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
        wp.url.startsWith(
          'data:'
        )
      ) {
        const link =
          document.createElement(
            'a'
          );

        link.href = wp.url;
        link.download =
          fileName;

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
          await fetch(
            wp.url
          );

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

          return;
        }
      } catch {
        // Fallback below.
      }

      const link =
        document.createElement(
          'a'
        );

      link.href = wp.url;
      link.download =
        fileName;
      link.target = '_blank';

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      addToast(
        `Opened image download link for ${wp.title}.`,
        'success'
      );
    };

  /* ==========================================================
     COLLECTIONS
     ========================================================== */

  const createCollection =
    (
      title: string,
      description: string
    ) => {
      const newCol: Collection =
        {
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
              'Wallpaper is already in this collection.',
              'info'
            );

            return col;
          }

          addToast(
            `Added to collection "${col.title}".`,
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

  /* ==========================================================
     ADMIN FILE UPLOAD
     ========================================================== */

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
      if (!isAdmin) {
        addToast(
          'You must sign in as administrator before uploading.',
          'error'
        );

        throw new Error(
          'Administrator authentication required.'
        );
      }

      addToast(
        'Uploading wallpaper...',
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

        /*
          Add the actual Supabase record
          to the UI immediately.
        */

        setWallpapers(
          (prev) => [
            created,
            ...prev,
          ]
        );

        addToast(
          `"${created.title}" uploaded successfully.`,
          'success'
        );
      } catch (error: any) {
        console.error(
          'Wallpaper upload failed:',
          error
        );

        addToast(
          error?.message ||
            'Wallpaper upload failed.',
          'error'
        );

        throw error;
      }
    };

  /* ==========================================================
     ADD WALLPAPER FROM URL
     ========================================================== */

  const addWallpaper =
    async (
      newWp: Omit<
        Wallpaper,
        | 'id'
        | 'views'
        | 'downloads'
        | 'favorites'
        | 'uploadDate'
      >
    ) => {
      if (!isAdmin) {
        addToast(
          'Administrator login required.',
          'error'
        );

        throw new Error(
          'Administrator authentication required.'
        );
      }

      try {
        addToast(
          'Saving wallpaper...',
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
          `"${created.title}" published successfully.`,
          'success'
        );
      } catch (error: any) {
        addToast(
          error?.message ||
            'Could not publish wallpaper.',
          'error'
        );

        throw error;
      }
    };

  /* ==========================================================
     DELETE WALLPAPER
     ========================================================== */

  const deleteWallpaper =
    async (
      id: string
    ) => {
      if (!isAdmin) {
        addToast(
          'Administrator login required.',
          'error'
        );

        throw new Error(
          'Administrator authentication required.'
        );
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
          'info'
        );
      } catch (error: any) {
        addToast(
          error?.message ||
            'Could not delete wallpaper.',
          'error'
        );

        throw error;
      }
    };

  /* ==========================================================
     EDIT WALLPAPER
     ========================================================== */

  const editWallpaper =
    (
      id: string,
      updated: Partial<Wallpaper>
    ) => {
      if (!isAdmin) {
        addToast(
          'Administrator login required.',
          'error'
        );

        return;
      }

      /*
        This updates the current UI.
        Your existing editing UI can later
        be connected to a Supabase UPDATE.
      */

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

  /* ==========================================================
     SEED DATABASE
     ========================================================== */

  const seedSupabaseDatabase =
    async () => {
      if (!isAdmin) {
        addToast(
          'Administrator login required.',
          'error'
        );

        return;
      }

      try {
        addToast(
          'Seeding Supabase database...',
          'info'
        );

        const seeded =
          await seedInitialWallpapersToSupabase(
            INITIAL_WALLPAPERS
          );

        setWallpapers(
          seeded
        );

        addToast(
          `Successfully added ${seeded.length} wallpapers.`,
          'success'
        );
      } catch (error: any) {
        addToast(
          error?.message ||
            'Database seeding failed.',
          'error'
        );
      }
    };

  /* ==========================================================
     RESET FILTERS
     ========================================================== */

  const resetFilters =
    () => {
      setFilters(
        defaultFilters
      );

      setSelectedCategory(
        'All'
      );
    };

  /* ==========================================================
     SEARCH
     ========================================================== */

  const triggerSearch =
    (query: string) => {
      setFilters(
        (prev) => ({
          ...prev,
          searchQuery:
            query,
        })
      );

      setActivePage(
        'search'
      );
    };

  /* ==========================================================
     RESET TO DEFAULT
     ========================================================== */

  const resetToDefaultWallpapers =
    useCallback(() => {
      /*
        We intentionally DO NOT overwrite the
        Supabase database.

        This only resets the local UI state.
      */

      setWallpapers(
        INITIAL_WALLPAPERS
      );
    }, []);

  /* ==========================================================
     CONTEXT VALUE
     ========================================================== */

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

        /* AUTH */

        authLoading,

        isAdmin,

        adminUser,

        loginAdmin,

        logoutAdmin,

        /* WALLPAPERS */

        toggleFavorite,

        downloadWallpaper,

        createCollection,

        addToCollection,

        addWallpaper,

        uploadWallpaperWithFile,

        deleteWallpaper,

        editWallpaper,

        /* TOASTS */

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
        isOpen={
          isAdModalOpen
        }
        onClose={() =>
          setIsAdModalOpen(
            false
          )
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

/* ============================================================
   HOOK
   ============================================================ */

export const useApp = () => {
  const context =
    useContext(
      AppContext
    );

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};
