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
 *
 * This is a Vite app, so the environment variables MUST use:
 *
 * VITE_SUPABASE_URL
 * VITE_SUPABASE_ANON_KEY
 *
 * The Vercel variables should therefore have those exact names.
 */

export const getSupabaseConfig = () => {
  // Optional local override from the Admin panel.
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

/**
 * Check whether Supabase credentials are available.
 */
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

/**
 * Reset cached Supabase client.
 * Used when credentials are changed from the Admin panel.
 */
export const resetSupabaseClientInstance = () => {
  clientInstance = null;
};

/**
 * Backwards-compatible exported client.
 *
 * IMPORTANT:
 * Because environment variables are loaded when the module
 * starts, functions below use getSupabaseClient() instead of
 * relying on this constant.
 */
export const supabase: SupabaseClient | null = getSupabaseClient();

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

    // New database structure uses "url".
    // image_url is kept as a fallback for older rows.
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
        : ['#0B1220', '#38BDF8', '#818CF8'],

    colorName:
      row.color_name ||
      row.colorName ||
      'Blue',

    uploadDate:
      row.upload_date ||
      row.uploadDate ||
      new Date().toISOString().split('T')[0],

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
            .map((tag: string) => tag.trim())
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
  return {
    title: wp.title,

    description:
      wp.description || '',

    url:
      wp.url || '',

    thumbnail_url:
      wp.thumbnailUrl ||
      wp.url ||
      '',

    category:
      wp.category || 'Cyberpunk',

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
      ['#0B1220', '#38BDF8', '#818CF8'],

    color_name:
      wp.colorName ||
      'Blue',

    upload_date:
      wp.uploadDate ||
      new Date().toISOString().split('T')[0],

    views:
      wp.views ?? 0,

    downloads:
      wp.downloads ?? 0,

    favorites:
      wp.favorites ?? 0,

    tags:
      wp.tags || [],

    author:
      wp.author || {
        name: 'Station Creator',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },

    author_name:
      wp.author?.name ||
      'Station Creator',

    author_avatar:
      wp.author?.avatar || null,

    is_featured:
      wp.isFeatured ?? false,

    is_wallpaper_of_the_day:
      wp.isWallpaperOfTheDay ?? false,

    is_ai_generated:
      wp.isAIGenerated ?? false,

    aspect_ratio:
      wp.aspectRatio ||
      '16:9',
  };
}

/**
 * ============================================================
 * FETCH WALLPAPERS
 * ============================================================
 */

export async function fetchWallpapersFromSupabase(): Promise<
  Wallpaper[]
> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  const { data, error } = await client
    .from('wallpapers')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Supabase fetch error:',
      error
    );

    throw error;
  }

  return (data || []).map(
    mapDbRowToWallpaper
  );
}

/**
 * ============================================================
 * UPLOAD FILE TO SUPABASE STORAGE + DATABASE
 * ============================================================
 *
 * IMPORTANT:
 * The Storage bucket is exactly:
 *
 * wallpapers
 *
 * Do NOT change this to "Wallpaper Station".
 */

export async function uploadWallpaperFileAndSave({
  file,
  metadata,
}: {
  file: File;

  metadata: Omit<
    Wallpaper,
    | 'id'
    | 'views'
    | 'downloads'
    | 'favorites'
    | 'uploadDate'
    | 'url'
    | 'thumbnailUrl'
  >;
}): Promise<Wallpaper> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  /**
   * Storage bucket name.
   */
  const BUCKET_NAME = 'wallpapers';

  /**
   * Make a safe unique filename.
   */
  const fileExt =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() || 'jpg';

  const safeBaseName =
    file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

  const fileName =
    `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}-${safeBaseName}.${fileExt}`;

  /**
   * Put uploaded files inside "wallpapers/".
   */
  const filePath =
    `wallpapers/${fileName}`;

  /**
   * ==========================================================
   * 1. UPLOAD IMAGE
   * ==========================================================
   */

  const {
    error: uploadError,
  } = await client.storage
    .from(BUCKET_NAME)
    .upload(
      filePath,
      file,
      {
        cacheControl: '3600',
        upsert: false,
        contentType:
          file.type || 'image/jpeg',
      }
    );

  if (uploadError) {
    console.error(
      'Supabase Storage upload error:',
      uploadError
    );

    throw new Error(
      `Storage upload failed: ${uploadError.message}`
    );
  }

  /**
   * ==========================================================
   * 2. GET PUBLIC IMAGE URL
   * ==========================================================
   */

  const {
    data: publicUrlData,
  } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  const publicUrl =
    publicUrlData.publicUrl;

  if (!publicUrl) {
    throw new Error(
      'Supabase uploaded the image but did not return a public URL.'
    );
  }

  /**
   * ==========================================================
   * 3. SAVE METADATA TO wallpapers TABLE
   * ==========================================================
   */

  const dbPayload =
    mapWallpaperToDbPayload({
      ...metadata,

      url: publicUrl,

      thumbnailUrl:
        publicUrl,

      views: 0,

      downloads: 0,

      favorites: 0,

      uploadDate:
        new Date()
          .toISOString()
          .split('T')[0],
    });

  const {
    data: insertedData,
    error: insertError,
  } = await client
    .from('wallpapers')
    .insert([dbPayload])
    .select()
    .single();

  if (insertError) {
    console.error(
      'Supabase database insert error:',
      insertError
    );

    /**
     * The image was uploaded but metadata failed.
     * Tell the user exactly what happened.
     */
    throw new Error(
      `Image uploaded, but database insert failed: ${insertError.message}`
    );
  }

  return mapDbRowToWallpaper(
    insertedData
  );
}

/**
 * ============================================================
 * INSERT WALLPAPER USING EXISTING URL
 * ============================================================
 */

export async function insertWallpaperToSupabase(
  wpData: Omit<
    Wallpaper,
    | 'id'
    | 'views'
    | 'downloads'
    | 'favorites'
    | 'uploadDate'
  >
): Promise<Wallpaper> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const dbPayload =
    mapWallpaperToDbPayload({
      ...wpData,

      views: 0,

      downloads: 0,

      favorites: 0,

      uploadDate:
        new Date()
          .toISOString()
          .split('T')[0],
    });

  const {
    data,
    error,
  } = await client
    .from('wallpapers')
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    console.error(
      'Supabase database insert error:',
      error
    );

    throw new Error(
      `Database insert failed: ${error.message}`
    );
  }

  return mapDbRowToWallpaper(data);
}

/**
 * ============================================================
 * DELETE WALLPAPER
 * ============================================================
 */

export async function deleteWallpaperFromSupabase(
  id: string
): Promise<void> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const {
    error,
  } = await client
    .from('wallpapers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(
      'Supabase delete error:',
      error
    );

    throw error;
  }
}

/**
 * ============================================================
 * UPDATE WALLPAPER STATS
 * ============================================================
 */

export async function incrementStatsInSupabase(
  id: string,
  field:
    | 'downloads'
    | 'views'
    | 'favorites',
  incrementBy = 1
): Promise<void> {
  const client = getSupabaseClient();

  if (!client) {
    return;
  }

  const {
    data,
    error,
  } = await client
    .from('wallpapers')
    .select(field)
    .eq('id', id)
    .single();

  if (error || !data) {
    return;
  }

  const currentValue =
    Number(data[field] || 0);

  await client
    .from('wallpapers')
    .update({
      [field]:
        currentValue + incrementBy,
    })
    .eq('id', id);
}

/**
 * ============================================================
 * SEED INITIAL WALLPAPERS
 * ============================================================
 */

export async function seedInitialWallpapersToSupabase(
  initialWallpapers: Wallpaper[]
): Promise<Wallpaper[]> {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const dbPayloads =
    initialWallpapers.map((wp) =>
      mapWallpaperToDbPayload(wp)
    );

  const {
    data,
    error,
  } = await client
    .from('wallpapers')
    .insert(dbPayloads)
    .select();

  if (error) {
    console.error(
      'Supabase seed error:',
      error
    );

    throw error;
  }

  return (data || []).map(
    mapDbRowToWallpaper
  );
}

/**
 * ============================================================
 * SQL SCHEMA
 * ============================================================
 */

export const SUPABASE_SQL_SCHEMA = `
-- ============================================================
-- WALLPAPER STATION DATABASE
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.wallpapers (
  id uuid default gen_random_uuid() primary key,

  title text not null,

  description text,

  url text not null,

  thumbnail_url text,

  category text not null default 'Cyberpunk',

  resolution text default '3840 x 2160',

  resolution_tag text default '4K',

  size text default '5.0 MB',

  orientation text default 'landscape',

  color_hex jsonb
    default '["#0B1220", "#38BDF8", "#818CF8"]'::jsonb,

  color_name text default 'Blue',

  upload_date text
    default to_char(now(), 'YYYY-MM-DD'),

  views integer default 0,

  downloads integer default 0,

  favorites integer default 0,

  tags jsonb default '[]'::jsonb,

  author jsonb
    default '{"name":"Station Creator"}'::jsonb,

  author_name text,

  author_avatar text,

  is_featured boolean default false,

  is_wallpaper_of_the_day boolean default false,

  is_ai_generated boolean default false,

  aspect_ratio text default '16:9',

  created_at timestamptz default now()
);

-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table public.wallpapers
enable row level security;

-- ============================================================
-- REMOVE OLD POLICIES IF THEY EXIST
-- ============================================================

drop policy if exists "Public Access Read"
on public.wallpapers;

drop policy if exists "Public Access Insert"
on public.wallpapers;

drop policy if exists "Public Access Update"
on public.wallpapers;

drop policy if exists "Public Access Delete"
on public.wallpapers;

-- ============================================================
-- PUBLIC DATABASE POLICIES
-- ============================================================

create policy "Public Access Read"
on public.wallpapers
for select
using (true);

create policy "Public Access Insert"
on public.wallpapers
for insert
with check (true);

create policy "Public Access Update"
on public.wallpapers
for update
using (true)
with check (true);

create policy "Public Access Delete"
on public.wallpapers
for delete
using (true);

-- ============================================================
-- STORAGE
-- ============================================================
--
-- Create a Supabase Storage bucket manually:
--
-- Bucket name:
-- wallpapers
--
-- Make it PUBLIC.
--
-- The application uploads files to:
--
-- wallpapers/wallpapers/<filename>
--
-- ============================================================
`;
