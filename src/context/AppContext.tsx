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
  getCurrentSupabaseUser,
  ADMIN_UID,
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

  isAdmin: boolean;

  isAdminMode: boolean;

  setAdminMode: (
    enabled: boolean
  ) => void;

  toggleAdminMode: () => void;

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
 *
 * We no longer hard-code isAdmin: true.
 *
 * The real Supabase authenticated user
 * determines administrator status.
 */

const defaultUser: UserProfile = {
  id: '',
  name: 'Guest',
  email: '',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isLoggedIn: false,
  isAdmin: false,
  favoriteIds: [],
  downloadHistoryIds: [],
  userCollections: [],
};

const AppContext =
  createContext<
    AppContextType | undefined
  >(undefined);

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children,
}) => {
  /**
   * ==========================================================
   * THEME
   * ==========================================================
   */

  const [
    theme,
    setThemeState,
  ] = useState<ThemeMode>(() => {
    const saved =
      localStorage.getItem(
        'ws_theme'
      );

    if (
      saved === 'light' ||
      saved === 'dark'
    ) {
      return saved;
    }

    return 'dark';
  });

  const setTheme =
    useCallback(
      (
        newTheme: ThemeMode
      ) => {
        setThemeState(
          newTheme
        );

        localStorage.setItem(
          'ws_theme',
          newTheme
        );
      },
      []
    );

  const toggleTheme =
    useCallback(() => {
      const next =
        theme === 'dark'
          ? 'light'
          : 'dark';

      setTheme(next);
    }, [
      theme,
      setTheme,
    ]);

  useEffect(() => {
    if (
      theme === 'light'
    ) {
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

  /**
   * ==========================================================
   * WALLPAPERS
   * ==========================================================
   */

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
  ] = useState<
    string | null
  >(null);

  const [
    isSupabaseConnected,
    setIsSupabaseConnected,
  ] = useState(
    isSupabaseConfigured()
  );

  const [
    curatedCollections,
  ] = useState<
    Collection[]
  >(
    CURATED_COLLECTIONS
  );

  /**
   * ==========================================================
   * REAL SUPABASE USER
   * ==========================================================
   */

  const [
    user,
    setUser,
  ] = useState<UserProfile>(
    defaultUser
  );

  const [
    isAdmin,
    setIsAdmin,
  ] = useState(false);

  const [
    isAdminMode,
    setIsAdminMode,
  ] = useState(false);

  /**
   * Load actual Supabase
   * authenticated user.
   */

  useEffect(() => {
    let mounted = true;

    const loadAuthUser =
      async () => {
        try {
          const authUser =
            await getCurrentSupabaseUser();

          if (
            !mounted
          ) {
            return;
          }

          if (
            authUser
          ) {
            const admin =
              authUser.id ===
              ADMIN_UID;

            setIsAdmin(
              admin
            );

            /**
             * Keep existing local
             * favorites/history if
             * available, but use the
             * real authenticated
             * identity.
             */

            setUser(
              (previous) => ({
                ...previous,

                id:
                  authUser.id,

                name:
                  authUser.user_metadata
                    ?.full_name ||
                  authUser.user_metadata
                    ?.name ||
                  authUser.email ||
                  'Wallpaper Station User',

                email:
                  authUser.email ||
                  '',

                avatar:
                  authUser.user_metadata
                    ?.avatar_url ||
                  previous.avatar,

                isLoggedIn:
                  true,

                isAdmin:
                  admin,
              })
            );
          } else {
            setIsAdmin(
              false
            );

            setIsAdminMode(
              false
            );

            setUser(
              defaultUser
            );
          }
        } catch (error) {
          console.error(
            'Auth initialization failed:',
            error
          );
        }
      };

    loadAuthUser();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Automatically close Admin Suite
   * if the user is not an admin.
   */

  useEffect(() => {
    if (!isAdmin) {
      setIsAdminMode(
        false
      );
    }
  }, [isAdmin]);

  /**
   * Admin Suite controls.
   */

  const setAdminMode =
    useCallback(
      (
        enabled: boolean
      ) => {
        if (
          !isAdmin
        ) {
          setIsAdminMode(
            false
          );
          return;
        }

        setIsAdminMode(
          enabled
        );
      },
      [isAdmin]
    );

  const toggleAdminMode =
    useCallback(() => {
      if (
        !isAdmin
      ) {
        setIsAdminMode(
          false
        );
        return;
      }

      setIsAdminMode(
        (previous) =>
          !previous
      );
    }, [isAdmin]);

  /**
   * ==========================================================
   * USER COLLECTIONS
   * ==========================================================
   */

  const [
    userCollections,
    setUserCollections,
  ] = useState<
    Collection[]
  >(() => {
    const saved =
      localStorage.getItem(
        'ws_user_collections'
      );

    if (saved) {
      try {
        return JSON.parse(
          saved
        );
      } catch {
        // Continue to default.
      }
    }

    return [
      {
        id:
          'ucol-1',

        title:
          'Desktop Favorites',

        description:
          'Selected 4K backgrounds for wide high-resolution screens.',

        coverUrl:
          'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',

        itemCount: 2,

        wallpaperIds: [
          'wp-1',
          'wp-2',
        ],
      },
    ];
  });

  /**
   * ==========================================================
   * NAVIGATION
   * ==========================================================
   */

  const [
    activePage,
    setActivePageState,
  ] = useState<PageView>(
    'home'
  );

  /**
   * Prevent non-admin users
   * from opening the Admin page.
   */

  const setActivePage =
    useCallback(
      (
        page: PageView
      ) => {
        if (
          page ===
            'admin' &&
          !isAdmin
        ) {
          return;
        }

        setActivePageState(
          page
        );
      },
      [isAdmin]
    );

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
  ] = useState(
    defaultFilters
  );

  const [
    toasts,
    setToasts,
  ] = useState<
    ToastMessage[]
  >([]);

  /**
   * ==========================================================
   * AD MODAL
   * ==========================================================
   */

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
  ] = useState<
    ResolutionOption
  >('8K');

  /**
   * ==========================================================
   * TOASTS
   * ==========================================================
   */

  const removeToast =
    useCallback(
      (id: string) => {
        setToasts(
          (previous) =>
            previous.filter(
              (toast) =>
                toast.id !==
                id
            )
        );
      },
      []
    );

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
            .substring(
              2,
              5
            );

        setToasts(
          (previous) => [
            ...previous,
            {
              id,
              type,
              message,
            },
          ]
        );

        setTimeout(
          () =>
            removeToast(
              id
            ),
          4000
        );
      },
      [removeToast]
    );

  /**
   * ==========================================================
   * FETCH WALLPAPERS
   * ==========================================================
   */

  const refetchWallpapers =
    useCallback(
      async () => {
        setIsLoadingWallpapers(
          true
        );

        setWallpaperError(
          null
        );

        if (
          !isSupabaseConfigured()
        ) {
          setIsSupabaseConnected(
            false
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

          if (
            data &&
            data.length >
              0
          ) {
            setWallpapers(
              data
            );
          } else {
            setWallpapers(
              INITIAL_WALLPAPERS
            );
          }
        } catch (
          error: any
        ) {
          console.warn(
            'Could not fetch wallpapers from Supabase:',
            error
          );

          setIsSupabaseConnected(
            false
          );

          setWallpaperError(
            error?.message ||
              'Could not connect to the Supabase wallpapers table.'
          );

          /**
           * IMPORTANT:
           *
           * Do NOT restore image Data URLs
           * from localStorage.
           *
           * That was the source of the
           * QuotaExceededError.
           */

          setWallpapers(
            INITIAL_WALLPAPERS
          );
        } finally {
          setIsLoadingWallpapers(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    refetchWallpapers();
  }, [
    refetchWallpapers,
  ]);

  /**
   * ==========================================================
   * LOCAL STORAGE
   * ==========================================================
   *
   * We deliberately DO NOT save wallpapers
   * into localStorage anymore.
   *
   * Images belong in Supabase Storage.
   */

  useEffect(() => {
    localStorage.setItem(
      'ws_user_profile',
      JSON.stringify(
        user
      )
    );
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      'ws_user_collections',
      JSON.stringify(
        userCollections
      )
    );
  }, [
    userCollections,
  ]);

  /**
   * ==========================================================
   * PAGE SCROLL
   * ==========================================================
   */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [activePage]);

  /**
   * ==========================================================
   * RESET WALLPAPERS
   * ==========================================================
   */

  const resetToDefaultWallpapers =
    useCallback(() => {
      /**
       * This only resets the browser's
       * displayed state.
       *
       * It does NOT delete your Supabase
       * wallpapers.
       */

      setWallpapers(
        INITIAL_WALLPAPERS
      );

      addToast(
        'Local wallpaper display reset.',
        'info'
      );
    }, [addToast]);

  /**
   * ==========================================================
   * FAVORITES
   * ==========================================================
   */

  const toggleFavorite =
    useCallback(
      (
        id: string
      ) => {
        setUser(
          (previous) => {
            const exists =
              previous.favoriteIds.includes(
                id
              );

            const newFavorites =
              exists
                ? previous.favoriteIds.filter(
                    (
                      favoriteId
                    ) =>
                      favoriteId !==
                      id
                  )
                : [
                    ...previous.favoriteIds,
                    id,
                  ];

            setWallpapers(
              (previousWallpapers) =>
                previousWallpapers.map(
                  (
                    wallpaper
                  ) =>
                    wallpaper.id ===
                    id
                      ? {
                          ...wallpaper,

                          favorites:
                            Math.max(
                              0,
                              wallpaper.favorites +
                                (exists
                                  ? -1
                                  : 1)
                            ),
                        }
                      : wallpaper
                )
            );

            if (
              isSupabaseConnected
            ) {
              incrementStatsInSupabase(
                id,
                'favorites',
                exists
                  ? -1
                  : 1
              ).catch(
                () => {}
              );
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
              ...previous,

              favoriteIds:
                newFavorites,
            };
          }
        );
      },
      [
        isSupabaseConnected,
        addToast,
      ]
    );

  /**
   * ==========================================================
   * DOWNLOAD
   * ==========================================================
   */

  const downloadWallpaper =
    async (
      wp: Wallpaper,
      resolution:
        ResolutionOption = '4K',
      isAdVerified = false
    ) => {
      if (
        resolution ===
          '8K' &&
        !isAdVerified
      ) {
        setAdModalWallpaper(
          wp
        );

        setAdModalResolution(
          '8K'
        );

        setIsAdModalOpen(
          true
        );

        return;
      }

      setWallpapers(
        (previous) =>
          previous.map(
            (wallpaper) =>
              wallpaper.id ===
              wp.id
                ? {
                    ...wallpaper,

                    downloads:
                      wallpaper.downloads +
                      1,
                  }
                : wallpaper
          )
      );

      if (
        isSupabaseConnected
      ) {
        incrementStatsInSupabase(
          wp.id,
          'downloads',
          1
        ).catch(
          () => {}
        );
      }

      setUser(
        (previous) => ({
          ...previous,

          downloadHistoryIds:
            Array.from(
              new Set([
                wp.id,
                ...previous.downloadHistoryIds,
              ])
            ),
        })
      );

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

      /**
       * Data URLs are only supported for
       * old/demo wallpapers.
       *
       * Uploaded wallpapers should use
       * normal Supabase URLs.
       */

      if (
        wp.url.startsWith(
          'data:'
        )
      ) {
        const link =
          document.createElement(
            'a'
          );

        link.href =
          wp.url;

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
            wp.url,
            {
              mode: 'cors',
            }
          );

        if (
          response.ok
        ) {
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

          setTimeout(
            () =>
              URL.revokeObjectURL(
                blobUrl
              ),
            10000
          );

          addToast(
            `Downloaded ${wp.title} (${resolution})!`,
            'success'
          );

          return;
        }
      } catch {
        // Continue to fallback.
      }

      /**
       * Final fallback.
       */

      const link =
        document.createElement(
          'a'
        );

      link.href =
        wp.url;

      link.download =
        fileName;

      link.target =
        '_blank';

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

  /**
   * ==========================================================
   * COLLECTIONS
   * ==========================================================
   */

  const createCollection =
    (
      title: string,
      description: string
    ) => {
      const newCollection: Collection =
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
        (previous) => [
          newCollection,
          ...previous,
        ]
      );

      addToast(
        `Collection "${title}" created successfully!`,
        'success'
      );
    };

  const addToCollection =
    (
      collectionId: string,
      wallpaperId: string
    ) => {
      setUserCollections(
        (previous) =>
          previous.map(
            (
              collection
            ) => {
              if (
                collection.id !==
                collectionId
              ) {
                return collection;
              }

              if (
                collection.wallpaperIds.includes(
                  wallpaperId
                )
              ) {
                addToast(
                  'Wallpaper is already in this collection',
                  'info'
                );

                return collection;
              }

              addToast(
                `Added to collection "${collection.title}"`,
                'success'
              );

              return {
                ...collection,

                itemCount:
                  collection.itemCount +
                  1,

                wallpaperIds:
                  [
                    ...collection.wallpaperIds,
                    wallpaperId,
                  ],
              };
            }
          )
      );
    };

  /**
   * ==========================================================
   * ADMIN FILE UPLOAD
   * ==========================================================
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
      /**
       * First check React's admin state.
       */

      if (!isAdmin) {
        addToast(
          'Admin access required to upload wallpapers.',
          'error'
        );

        return;
      }

      /**
       * Then the Supabase function itself
       * checks the real authenticated UID.
       */

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
          (previous) => [
            created,
            ...previous,
          ]
        );

        addToast(
          `Uploaded & published "${created.title}" successfully!`,
          'success'
        );
      } catch (
        error: any
      ) {
        console.error(
          'Wallpaper upload failed:',
          error
        );

        addToast(
          error?.message ||
            'Wallpaper upload failed.',
          'error'
        );

        /**
         * IMPORTANT:
         *
         * There is NO Data URL fallback.
         *
         * This prevents giant images from
         * being stored in localStorage.
         */
      }
    };

  /**
   * ==========================================================
   * ADD WALLPAPER FROM URL
   * ADMIN ONLY
   * ==========================================================
   */

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
          'Admin access required to publish wallpapers.',
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
          (previous) => [
            created,
            ...previous,
          ]
        );

        addToast(
          `Wallpaper "${created.title}" published successfully!`,
          'success'
        );
      } catch (
        error: any
      ) {
        console.error(
          'Wallpaper insert failed:',
          error
        );

        addToast(
          error?.message ||
            'Could not publish wallpaper.',
          'error'
        );
      }
    };

  /**
   * ==========================================================
   * DELETE WALLPAPER
   * ==========================================================
   */

  const deleteWallpaper =
    async (
      id: string
    ) => {
      if (!isAdmin) {
        addToast(
          'Admin access required to delete wallpapers.',
          'error'
        );

        return;
      }

      try {
        await deleteWallpaperFromSupabase(
          id
        );

        setWallpapers(
          (previous) =>
            previous.filter(
              (wallpaper) =>
                wallpaper.id !==
                id
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
          'Wallpaper removed successfully.',
          'info'
        );
      } catch (
        error: any
      ) {
        console.error(
          'Could not delete wallpaper:',
          error
        );

        addToast(
          error?.message ||
            'Could not delete wallpaper.',
          'error'
        );
      }
    };

  /**
   * ==========================================================
   * EDIT WALLPAPER
   * ==========================================================
   */

  const editWallpaper =
    (
      id: string,
      updated: Partial<Wallpaper>
    ) => {
      if (!isAdmin) {
        addToast(
          'Admin access required to edit wallpapers.',
          'error'
        );

        return;
      }

      /**
       * This updates the local UI only.
       *
       * If your AdminDashboard currently
       * needs persistent metadata editing,
       * we can add the Supabase UPDATE call
       * next.
       */

      setWallpapers(
        (previous) =>
          previous.map(
            (wallpaper) =>
              wallpaper.id ===
              id
                ? {
                    ...wallpaper,
                    ...updated,
                  }
                : wallpaper
          )
      );

      addToast(
        'Wallpaper details updated.',
        'success'
      );
    };

  /**
   * ==========================================================
   * SEED DATABASE
   * ==========================================================
   */

  const seedSupabaseDatabase =
    async () => {
      if (!isAdmin) {
        addToast(
          'Admin access required to seed the database.',
          'error'
        );

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
          'Seeding wallpapers table in Supabase...',
          'info'
        );

        const seeded =
          await seedInitialWallpapersToSupabase(
            INITIAL_WALLPAPERS
          );

        if (
          seeded &&
          seeded.length >
            0
        ) {
          setWallpapers(
            seeded
          );

          setIsSupabaseConnected(
            true
          );

          addToast(
            `Successfully seeded ${seeded.length} wallpapers into Supabase!`,
            'success'
          );
        } else {
          await refetchWallpapers();
        }
      } catch (
        error: any
      ) {
        console.error(
          'Seeding failed:',
          error
        );

        addToast(
          error?.message ||
            'Database seeding failed.',
          'error'
        );
      }
    };

  /**
   * ==========================================================
   * FILTERS
   * ==========================================================
   */

  const resetFilters =
    () => {
      setFilters(
        defaultFilters
      );

      setSelectedCategory(
        'All'
      );
    };

  const triggerSearch =
    (
      query: string
    ) => {
      setFilters(
        (previous) => ({
          ...previous,

          searchQuery:
            query,
        })
      );

      setActivePage(
        'search'
      );
    };

  /**
   * ==========================================================
   * CONTEXT
   * ==========================================================
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

        isAdmin,

        isAdminMode,

        setAdminMode,

        toggleAdminMode,

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

          setIsAdModalOpen(
            false
          );
        }}
      />
    </AppContext.Provider>
  );
};

export const useApp =
  () => {
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
