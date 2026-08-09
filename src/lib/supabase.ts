import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Wallpaper,
  ResolutionOption,
  CategoryName,
  OrientationType,
} from '../types';

/* ============================================================
   ADMIN
   ============================================================ */

export const ADMIN_UID =
  '188791bc-6d87-4d28-8716-0f1efcad00e1';

/* ============================================================
   SUPABASE CONFIGURATION
   ============================================================ */

export const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

/* ============================================================
   SUPABASE CLIENT
   ============================================================ */

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  const { url, key } = getSupabaseConfig();

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  if (!clientInstance) {
    clientInstance = createClient(url, key);
  }

  return clientInstance;
};

export const resetSupabaseClientInstance = () => {
  clientInstance = null;
};

/* ============================================================
   AUTH HELPERS
   ============================================================ */

export async function getCurrentUser() {
  const client = getSupabaseClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function signInAdmin(
  email: string,
  password: string
) {
  const client = getSupabaseClient();

  const {
    data,
    error,
  } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Login succeeded but no user was returned.');
  }

  if (data.user.id !== ADMIN_UID) {
    await client.auth.signOut();

    throw new Error(
      'This account does not have administrator permission.'
    );
  }

  return data.user;
}

export async function signOutUser() {
  const client = getSupabaseClient();

  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    return Boolean(
      user && user.id === ADMIN_UID
    );
  } catch {
    return false;
  }
}

/* ============================================================
   DATABASE ROW -> WALLPAPER
   ============================================================ */

export function mapDbRowToWallpaper(
  row: any
): Wallpaper {
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

/* ============================================================
   WALLPAPER -> DATABASE PAYLOAD
   ============================================================ */

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

    url: imageUrl,

    image_url: imageUrl,

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
      },

    author_name:
      wp.author?.name ||
      'Station Creator',

    author_avatar:
      wp.author?.avatar ||
      null,

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

/* ============================================================
   FETCH WALLPAPERS
   ============================================================ */

export async function fetchWallpapersFromSupabase(): Promise<
  Wallpaper[]
> {
  const client = getSupabaseClient();

  const {
    data,
    error,
  } = await client
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

/* ============================================================
   ADMIN CHECK
   ============================================================ */

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error(
      'You must be signed in as administrator.'
    );
  }

  if (user.id !== ADMIN_UID) {
    throw new Error(
      'You do not have administrator permission.'
    );
  }

  return user;
}

/* ============================================================
   UPLOAD IMAGE FILE + DATABASE RECORD
   ============================================================ */

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

  await requireAdmin();

  if (!file) {
    throw new Error(
      'Please select an image file.'
    );
  }

  if (!file.type.startsWith('image/')) {
    throw new Error(
      'Only image files are allowed.'
    );
  }

  const maxSize =
    25 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      'Image must be smaller than 25 MB.'
    );
  }

  const BUCKET_NAME =
    'wallpapers';

  const fileExt =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() ||
    'jpg';

  const safeBaseName =
    file.name
      .replace(/\.[^/.]+$/, '')
      .replace(
        /[^a-zA-Z0-9-_]/g,
        '-'
      )
      .toLowerCase();

  const fileName =
    `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}-${safeBaseName}.${fileExt}`;

  const filePath =
    `wallpapers/${fileName}`;

  /* -------------------------------
     1. Upload image
     ------------------------------- */

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
          file.type ||
          'image/jpeg',
      }
    );

  if (uploadError) {
    throw new Error(
      `Storage upload failed: ${uploadError.message}`
    );
  }

  /* -------------------------------
     2. Public URL
     ------------------------------- */

  const {
    data: publicUrlData,
  } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  const publicUrl =
    publicUrlData?.publicUrl || '';

  if (!publicUrl) {
    throw new Error(
      'The image uploaded but no public URL was returned.'
    );
  }

  /* -------------------------------
     3. Database record
     ------------------------------- */

  const dbPayload =
    mapWallpaperToDbPayload({
      ...metadata,
      url: publicUrl,
      thumbnailUrl: publicUrl,
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
    /*
      If database insertion fails, remove the uploaded
      image so we don't leave orphaned files in Storage.
    */

    await client.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    throw new Error(
      `Image uploaded but database insert failed: ${insertError.message}`
    );
  }

  return mapDbRowToWallpaper(
    insertedData
  );
}

/* ============================================================
   INSERT WALLPAPER USING URL
   ============================================================ */

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

  await requireAdmin();

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
    throw new Error(
      `Database insert failed: ${error.message}`
    );
  }

  return mapDbRowToWallpaper(data);
}

/* ============================================================
   DELETE WALLPAPER
   ============================================================ */

export async function deleteWallpaperFromSupabase(
  id: string
): Promise<void> {
  const client = getSupabaseClient();

  await requireAdmin();

  const {
    error,
  } = await client
    .from('wallpapers')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

/* ============================================================
   UPDATE WALLPAPER STATS
   ============================================================ */

export async function incrementStatsInSupabase(
  id: string,
  field:
    | 'downloads'
    | 'views'
    | 'favorites',
  incrementBy = 1
): Promise<void> {
  const client = getSupabaseClient();

  /*
    Stats are deliberately handled through a controlled
    database operation. If the current RLS policy does not
    allow this client-side update, we simply don't break
    the wallpaper experience.
  */

  try {
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
          currentValue +
          incrementBy,
      })
      .eq('id', id);
  } catch {
    // Statistics should never break downloads/browsing.
  }
}

/* ============================================================
   SEED DATABASE
   ============================================================ */

export async function seedInitialWallpapersToSupabase(
  initialWallpapers: Wallpaper[]
): Promise<Wallpaper[]> {
  const client = getSupabaseClient();

  await requireAdmin();

  const dbPayloads =
    initialWallpapers.map(
      (wp) =>
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
    throw error;
  }

  return (data || []).map(
    mapDbRowToWallpaper
  );
}
