import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Wallpaper,
  ResolutionOption,
  CategoryName,
  OrientationType,
} from '../types';

/**
 * ============================================================
 * SUPABASE CONFIGURATION
 * ============================================================
 */

export const getSupabaseConfig = () => {
  const customUrl =
    typeof window !== 'undefined'
      ? localStorage.getItem('ws_supabase_url')
      : null;

  const customKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('ws_supabase_key')
      : null;

  const url =
    customUrl ||
    import.meta.env.VITE_SUPABASE_URL ||
    '';

  const key =
    customKey ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    '';

  return {
    url: url.trim(),
    key: key.trim(),
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();

  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    key.length > 20
  );
};

/**
 * ============================================================
 * SUPABASE CLIENT
 * ============================================================
 */

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();

  if (!url || !key) {
    return null;
  }

  if (!url.startsWith('https://')) {
    return null;
  }

  if (key.length <= 20) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(url, key);
  }

  return clientInstance;
};

export const resetSupabaseClientInstance = () => {
  clientInstance = null;
};

export const supabase: SupabaseClient | null =
  getSupabaseClient();

/**
 * ============================================================
 * DATABASE ROW -> WALLPAPER
 * ============================================================
 */

export function mapDbRowToWallpaper(row: any): Wallpaper {
  return {
    id: String(row.id),

    title:
      row.title ||
      'Untitled Wallpaper',

    description:
      row.description ||
      '',

    url:
      row.url ||
      row.image_url ||
      '',

    thumbnailUrl:
      row.thumbnail_url ||
      row.thumbnailUrl ||
      row.url ||
      row.image_url ||
      '',

    category:
      (row.category as CategoryName) ||
      'Cyberpunk',

    resolution:
      row.resolution ||
      '3840 x 2160',

    resolutionTag:
      (row.resolution_tag ||
        row.resolutionTag ||
        '4K') as ResolutionOption,

    size:
      row.size ||
      '5.0 MB',

    orientation:
      (row.orientation as OrientationType) ||
      'landscape',

    colorHex:
      Array.isArray(row.color_hex)
        ? row.color_hex
        : Array.isArray(row.colorHex)
          ? row.colorHex
          : [
              '#0B1220',
              '#38BDF8',
              '#818CF8',
            ],

    colorName:
      row.color_name ||
      row.colorName ||
      'Blue',

    uploadDate:
      row.upload_date ||
      row.uploadDate ||
      new Date()
        .toISOString()
        .split('T')[0],

    views:
      Number(row.views || 0),

    downloads:
      Number(row.downloads || 0),

    favorites:
      Number(row.favorites || 0),

    tags:
      Array.isArray(row.tags)
        ? row.tags
        : typeof row.tags === 'string'
          ? row.tags
              .split(',')
              .map((tag: string) =>
                tag.trim()
              )
              .filter(Boolean)
          : [],

    author:
      typeof row.author === 'object' &&
      row.author !== null
        ? {
            name:
              row.author.name ||
              row.author_name ||
              'Creator',

            avatar:
              row.author.avatar ||
              row.author_avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',

            profileUrl:
              row.author.profileUrl ||
              row.author.profile_url,
          }
        : {
            name:
              row.author_name ||
              row.authorName ||
              'Station Creator',

            avatar:
              row.author_avatar ||
              row.authorAvatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          },

    isFeatured:
      Boolean(
        row.is_featured ??
        row.isFeatured ??
        false
      ),

    isWallpaperOfTheDay:
      Boolean(
        row.is_wallpaper_of_the_day ??
        row.isWallpaperOfTheDay ??
        false
      ),

    isAIGenerated:
      Boolean(
        row.is_ai_generated ??
        row.isAIGenerated ??
        false
      ),

    aspectRatio:
      row.aspect_ratio ||
      row.aspectRatio ||
      '16:9',
  };
}

/**
 * ============================================================
 * WALLPAPER -> DATABASE PAYLOAD
 * ============================================================
 */

export function mapWallpaperToDbPayload(
  wp: Partial<Wallpaper>
) {
  const imageUrl = wp.url || '';

  return {
    title:
      wp.title ||
      'Untitled Wallpaper',

    description:
      wp.description ||
      '',

    url:
      imageUrl,

    image_url:
      imageUrl,

    thumbnail_url:
      wp.thumbnailUrl ||
      imageUrl ||
      '',

    category:
      wp.category ||
      'Cyberpunk',

    resolution:
      wp.resolution ||
      '3840 x 2160',

    resolution_tag:
      wp.resolutionTag ||
      '4K',

    size:
      wp.size ||
      '5.0 MB',

    orientation:
      wp.orientation ||
      'landscape',

    color_hex:
      wp.colorHex ||
      [
        '#0B1220',
        '#38BDF8',
        '#818CF8',
      ],

    color_name:
      wp.colorName ||
      'Blue',

    upload_date:
      wp.uploadDate ||
      new Date()
        .toISOString()
        .split('T')[0],

    views:
      wp.views ?? 0,

    downloads:
      wp.downloads ?? 0,

    favorites:
      wp.favorites ?? 0,

    tags:
      wp.tags ||
      [],

    author:
      wp.author || {
        name: 'Station Creator',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=
