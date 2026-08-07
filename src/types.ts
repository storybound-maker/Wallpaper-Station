export type CategoryName =
  | 'Nature'
  | 'Space'
  | 'Gaming'
  | 'Cars'
  | 'Anime'
  | 'Technology'
  | 'Abstract'
  | 'AMOLED'
  | 'Minimal'
  | 'Architecture'
  | 'Cyberpunk'
  | 'Neon'
  | 'Animals'
  | 'Cities';

export type ResolutionOption = '1080p' | '1440p' | '4K' | '8K' | 'Mobile' | 'Tablet' | 'Desktop';

export type OrientationType = 'landscape' | 'portrait' | 'square';

export type SortOption = 'popularity' | 'newest' | 'downloads' | 'views';

export interface Wallpaper {
  id: string;
  title: string;
  description: string;
  url: string; // Original high-res image URL
  thumbnailUrl: string; // Optimized grid thumbnail
  category: CategoryName;
  resolution: string; // e.g., "3840 x 2160"
  resolutionTag: ResolutionOption;
  size: string; // e.g., "4.8 MB"
  orientation: OrientationType;
  colorHex: string[]; // Primary color palette in hex e.g. ["#0f172a", "#38bdf8"]
  colorName?: string; // e.g., "Blue", "Dark", "Purple"
  uploadDate: string; // YYYY-MM-DD
  views: number;
  downloads: number;
  favorites: number;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    profileUrl?: string;
  };
  isFeatured?: boolean;
  isWallpaperOfTheDay?: boolean;
  isAIGenerated?: boolean;
  aspectRatio: string; // e.g., "16:9", "9:16", "21:9"
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  itemCount: number;
  wallpaperIds: string[];
  isCurated?: boolean;
}

export interface CategoryInfo {
  name: CategoryName;
  description: string;
  coverUrl: string;
  count: number;
  accentColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  favoriteIds: string[];
  downloadHistoryIds: string[];
  userCollections: Collection[];
}

export interface FilterState {
  searchQuery: string;
  category: CategoryName | 'All';
  resolutionTag: ResolutionOption | 'All';
  orientation: OrientationType | 'All';
  color: string | 'All';
  sortBy: SortOption;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}
