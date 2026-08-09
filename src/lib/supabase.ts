```tsx
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

export const ADMIN_SUPABASE_UID =
  '188791bc-6d87-4d28-8716-0f1efcad00e1';

/* ============================================================
   SUPABASE CONFIGURATION
============================================================ */

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

/* ============================================================
   SUPABASE CONFIGURATION CHECK
============================================================ */

export const isSupabaseConfigured = (): boolean => {
  const config = getSupabaseConfig();

  return Boolean(
    config.url &&
      config.key &&
      config.url.startsWith('https://') &&
      config.key.length > 20
  );
};

/* ============================================================
   SUPABASE CLIENT
============================================================ */

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();

  if (!config.url || !config.key) {
    return null;
  }

  if (!config.url.startsWith('https://')) {
    return null;
  }

  if (config.key.length <= 20) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(
      config.url,
      config.key
    );
  }

  return clientInstance;
};

export const resetSupabaseClientInstance = (): void => {
  clientInstance = null;
};

export const getSupabase = (): SupabaseClient | null => {
  return getSupabaseClient();
};

/* ============================================================
   AUTH
============================================================ */

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      data: null,
      error: new Error(
        'Supabase is not configured.'
      ),
    };
  }

  return await client.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  name?: string
) => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      data: {
        user: null,
        session: null,
      },
      error: new Error(
        'Supabase is not configured.'
      ),
    };
  }

  return await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || '',
        name: name || '',
      },
    },
  });
};

export const signOutUser = async (): Promise<void> => {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const result = await client.auth.signOut();

  if (result.error) {
    throw result.error;
  }
};

export const sendPasswordResetEmail = async (
  email: string
) => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      error: new Error(
        'Supabase is not configured.'
      ),
    };
  }

  const result =
    await client.auth.resetPasswordForEmail(
      email
    );

  return {
    error: result.error,
  };
};

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
              .map(
                (tag: string) =>
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
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
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
      wp.isWallpaperOfTheDay ??
      false,

    is_ai_generated:
      wp.isAIGenerated ??
      false,

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
  const client =
    getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured. Check your Supabase URL and key.'
    );
  }

  const result =
    await client
      .from('wallpapers')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

  if (result.error) {
    console.error(
      'Supabase fetch error:',
      result.error
    );

    throw result.error;
  }

  return (
    result.data || []
  ).map(
    mapDbRowToWallpaper
  );
}

/* ============================================================
   UPLOAD WALLPAPER FILE
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
  const client =
    getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const bucketName =
    'wallpapers';

  const fileParts =
    file.name.split('.');

  const fileExt =
    fileParts.length > 1
      ? fileParts[
          fileParts.length - 1
        ].toLowerCase()
      : 'jpg';

  const safeBaseName =
    file.name
      .replace(
        /\.[^/.]+$/,
        ''
      )
      .replace(
        /[^a-zA-Z0-9-_]/g,
        '-'
      )
      .toLowerCase();

  const randomId =
    Math.random()
      .toString(36)
      .substring(
        2,
        8
      );

  const fileName =
    String(Date.now()) +
    '-' +
    randomId +
    '-' +
    safeBaseName +
    '.' +
    fileExt;

  const filePath =
    'wallpapers/' +
    fileName;

  const uploadResult =
    await client.storage
      .from(bucketName)
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

  if (uploadResult.error) {
    console.error(
      'Supabase Storage upload error:',
      uploadResult.error
    );

    throw new Error(
      'Storage upload failed: ' +
        uploadResult.error.message
    );
  }

  const publicResult =
    client.storage
      .from(bucketName)
      .getPublicUrl(
        filePath
      );

  const publicUrl =
    publicResult.data?.publicUrl ||
    '';

  if (!publicUrl) {
    throw new Error(
      'Image uploaded but Supabase did not return a public URL.'
    );
  }

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

  const insertResult =
    await client
      .from('wallpapers')
      .insert([
        dbPayload,
      ])
      .select()
      .single();

  if (insertResult.error) {
    console.error(
      'Supabase database insert error:',
      insertResult.error
    );

    throw new Error(
      'Image uploaded, but database insert failed: ' +
        insertResult.error.message
    );
  }

  return mapDbRowToWallpaper(
    insertResult.data
  );
}

/* ============================================================
   INSERT WALLPAPER USING EXISTING URL
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
  const client =
    getSupabaseClient();

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

  const result =
    await client
      .from('wallpapers')
      .insert([
        dbPayload,
      ])
      .select()
      .single();

  if (result.error) {
    console.error(
      'Supabase database insert error:',
      result.error
    );

    throw new Error(
      'Database insert failed: ' +
        result.error.message
    );
  }

  return mapDbRowToWallpaper(
    result.data
  );
}

/* ============================================================
   DELETE WALLPAPER
============================================================ */

export async function deleteWallpaperFromSupabase(
  id: string
): Promise<void> {
  const client =
    getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const result =
    await client
      .from('wallpapers')
      .delete()
      .eq(
        'id',
        id
      );

  if (result.error) {
    console.error(
      'Supabase delete error:',
      result.error
    );

    throw result.error;
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
  const client =
    getSupabaseClient();

  if (!client) {
    return;
  }

  const result =
    await client
      .from('wallpapers')
      .select(field)
      .eq(
        'id',
        id
      )
      .single();

  if (
    result.error ||
    !result.data
  ) {
    return;
  }

  const currentValue =
    Number(
      result.data[field] ||
        0
    );

  const updateData = {
    [field]:
      currentValue +
      incrementBy,
  };

  const updateResult =
    await client
      .from('wallpapers')
      .update(updateData)
      .eq(
        'id',
        id
      );

  if (updateResult.error) {
    console.error(
      'Supabase stats update error:',
      updateResult.error
    );
  }
}

/* ============================================================
   SEED DATABASE
============================================================ */

export async function seedInitialWallpapersToSupabase(
  initialWallpapers: Wallpaper[]
): Promise<Wallpaper[]> {
  const client =
    getSupabaseClient();

  if (!client) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  const payloads =
    initialWallpapers.map(
      (wallpaper) =>
        mapWallpaperToDbPayload(
          wallpaper
        )
    );

  const result =
    await client
      .from('wallpapers')
      .insert(
        payloads
      )
      .select();

  if (result.error) {
    console.error(
      'Supabase seed error:',
      result.error
    );

    throw result.error;
  }

  return (
    result.data || []
  ).map(
    mapDbRowToWallpaper
  );
}

/* ============================================================
   SUPABASE SQL SCHEMA
============================================================ */

export const SUPABASE_SQL_SCHEMA = [
  'create extension if not exists pgcrypto;',
  '',
  'create table if not exists public.wallpapers (',
  '  id uuid default gen_random_uuid() primary key,',
  '  title text not null,',
  '  description text,',
  '  image_url text,',
  '  url text,',
  '  thumbnail_url text,',
  "  category text not null default 'Cyberpunk',",
  "  resolution text default '3840 x 2160',",
  "  resolution_tag text default '4K',",
  "  size text default '5.0 MB',",
  "  orientation text default 'landscape',",
  '  color_hex jsonb default \'["#0B1220", "#38BDF8", "#818CF8"]\'::jsonb,',
  "  color_name text default 'Blue',",
  '  upload_date date default current_date,',
  '  views integer default 0,',
  '  downloads integer default 0,',
  '  favorites integer default 0,',
  "  tags jsonb default '[]'::jsonb,",
  "  author jsonb default '{\"name\":\"Station Creator\"}'::jsonb,",
  "  author_name text default 'Station Creator',",
  "  author_avatar text default '',",
  '  is_featured boolean default false,',
  '  is_wallpaper_of_the_day boolean default false,',
  '  is_ai_generated boolean default false,',
  "  aspect_ratio text default '16:9',",
  '  created_at timestamptz default now()',
  ');',
  '',
  'alter table public.wallpapers',
  'enable row level security;',
  '',
  'drop policy if exists "Public Access Read"',
  'on public.wallpapers;',
  '',
  'drop policy if exists "Authenticated Admin Insert"',
  'on public.wallpapers;',
  '',
  'drop policy if exists "Authenticated Admin Update"',
  'on public.wallpapers;',
  '',
  'drop policy if exists "Authenticated Admin Delete"',
  'on public.wallpapers;',
  '',
  'create policy "Public Access Read"',
  'on public.wallpapers',
  'for select',
  'using (true);',
  '',
  'create policy "Authenticated Admin Insert"',
  'on public.wallpapers',
  'for insert',
  'to authenticated',
  'with check (',
  "  auth.uid() = '188791bc-6d87-4d28-8716-0f1efcad00e1'::uuid",
  ');',
  '',
  'create policy "Authenticated Admin Update"',
  'on public.wallpapers',
  'for update',
  'to authenticated',
  'using (',
  "  auth.uid() = '188791bc-6d87-4d28-8716-0f1efcad00e1'::uuid",
  ')',
  'with check (',
  "  auth.uid() = '188791bc-6d87-4d28-8716-0f1efcad00e1'::uuid",
  ');',
  '',
  'create policy "Authenticated Admin Delete"',
  'on public.wallpapers',
  'for delete',
  'to authenticated',
  'using (',
  "  auth.uid() = '188791bc-6d87-4d28-8716-0f1efcad00e1'::uuid",
  ');',
].join('\n');
```

