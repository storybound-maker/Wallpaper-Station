/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Wallpaper, ResolutionOption, CategoryName, OrientationType } from '../types';

export const ADMIN_SUPABASE_UID = '188791bc-6d87-4d28-8716-0f1efcad00e1';

export const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('ws_supabase_url');
  const customKey = localStorage.getItem('ws_supabase_key');

  const url = customUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const key = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { url, key };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(
    url &&
    key &&
    url.startsWith('http') &&
    url !== 'https://your-supabase-project.supabase.co' &&
    key !== 'your-supabase-anon-key' &&
    key.length > 20
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getSupabaseConfig();
  if (
    url &&
    key &&
    url.startsWith('http') &&
    url !== 'https://your-supabase-project.supabase.co' &&
    key !== 'your-supabase-anon-key' &&
    key.length > 20
  ) {
    if (!clientInstance) {
      clientInstance = createClient(url, key);
    }
    return clientInstance;
  }
  return null;
};

export const resetSupabaseClientInstance = () => {
  clientInstance = null;
};

export const supabase: SupabaseClient | null = getSupabaseClient();

// Supabase Auth Helper Methods
export async function signInWithEmail(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');
  return await client.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');
  return await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || '',
        name: name || ''
      }
    }
  });
}

export async function signOutUser() {
  const client = getSupabaseClient();
  if (!client) return;
  return await client.auth.signOut();
}

export async function sendPasswordResetEmail(email: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');
  return await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}`
  });
}

export async function signInWithGoogle() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');
  return await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`
    }
  });
}

// Convert DB row (handles snake_case and camelCase) to Wallpaper type
export function mapDbRowToWallpaper(row: any): Wallpaper {
  return {
    id: String(row.id),
    title: row.title || 'Untitled Wallpaper',
    description: row.description || '',
    url: row.url || row.image_url || '',
    thumbnailUrl: row.thumbnail_url || row.thumbnailUrl || row.url || '',
    category: (row.category as CategoryName) || 'Cyberpunk',
    resolution: row.resolution || '3840 x 2160',
    resolutionTag: (row.resolution_tag || row.resolutionTag || '4K') as ResolutionOption,
    size: row.size || '5.0 MB',
    orientation: (row.orientation as OrientationType) || 'landscape',
    colorHex: Array.isArray(row.color_hex)
      ? row.color_hex
      : Array.isArray(row.colorHex)
      ? row.colorHex
      : ['#0B1220', '#38BDF8', '#818CF8'],
    colorName: row.color_name || row.colorName || 'Blue',
    uploadDate: row.upload_date || row.uploadDate || new Date().toISOString().split('T')[0],
    views: Number(row.views || 0),
    downloads: Number(row.downloads || 0),
    favorites: Number(row.favorites || 0),
    tags: Array.isArray(row.tags) ? row.tags : typeof row.tags === 'string' ? row.tags.split(',') : [],
    author: typeof row.author === 'object' && row.author !== null
      ? {
          name: row.author.name || 'Creator',
          avatar: row.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          profileUrl: row.author.profileUrl
        }
      : {
          name: row.author_name || row.authorName || 'Station Creator',
          avatar: row.author_avatar || row.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        },
    isFeatured: Boolean(row.is_featured ?? row.isFeatured ?? false),
    isWallpaperOfTheDay: Boolean(row.is_wallpaper_of_the_day ?? row.isWallpaperOfTheDay ?? false),
    isAIGenerated: Boolean(row.is_ai_generated ?? row.isAIGenerated ?? false),
    aspectRatio: row.aspect_ratio || row.aspectRatio || '16:9',
  };
}

// Map Wallpaper type to DB insert payload (snake_case)
export function mapWallpaperToDbPayload(wp: Partial<Wallpaper>) {
  return {
    title: wp.title,
    description: wp.description,
    url: wp.url,
    thumbnail_url: wp.thumbnailUrl || wp.url,
    category: wp.category,
    resolution: wp.resolution,
    resolution_tag: wp.resolutionTag,
    size: wp.size,
    orientation: wp.orientation,
    color_hex: wp.colorHex,
    color_name: wp.colorName,
    upload_date: wp.uploadDate || new Date().toISOString().split('T')[0],
    views: wp.views ?? 0,
    downloads: wp.downloads ?? 0,
    favorites: wp.favorites ?? 0,
    tags: wp.tags,
    author: wp.author,
    author_name: wp.author?.name,
    author_avatar: wp.author?.avatar,
    is_featured: wp.isFeatured ?? false,
    is_wallpaper_of_the_day: wp.isWallpaperOfTheDay ?? false,
    is_ai_generated: wp.isAIGenerated ?? false,
    aspect_ratio: wp.aspectRatio || '16:9',
  };
}

// Fetch all wallpapers from Supabase DB
export async function fetchWallpapersFromSupabase(): Promise<Wallpaper[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('wallpapers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase fetch notice:', error.message || error);
    throw error;
  }

  return (data || []).map(mapDbRowToWallpaper);
}

// Upload image file to Supabase Storage Bucket 'wallpapers' and save metadata in DB
export async function uploadWallpaperFileAndSave({
  file,
  metadata
}: {
  file: File;
  metadata: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate' | 'url' | 'thumbnailUrl'>;
}): Promise<Wallpaper> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment or Admin portal.');
  }

  // 1. Storage Upload
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await client.storage
    .from('wallpapers')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.warn('Storage upload notice:', uploadError.message || uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 2. Get Public URL
  const { data: publicUrlData } = client.storage
    .from('wallpapers')
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  // 3. Insert Row into DB
  const dbPayload = mapWallpaperToDbPayload({
    ...metadata,
    url: publicUrl,
    thumbnailUrl: publicUrl,
    views: 0,
    downloads: 0,
    favorites: 0,
    uploadDate: new Date().toISOString().split('T')[0]
  });

  const { data: insertedData, error: insertError } = await client
    .from('wallpapers')
    .insert([dbPayload])
    .select()
    .single();

  if (insertError) {
    console.warn('DB Insert notice:', insertError.message || insertError);
    throw new Error(`Database insert failed: ${insertError.message}`);
  }

  return mapDbRowToWallpaper(insertedData);
}

// Insert single wallpaper metadata (for URL upload or seeding)
export async function insertWallpaperToSupabase(
  wpData: Omit<Wallpaper, 'id' | 'views' | 'downloads' | 'favorites' | 'uploadDate'>
): Promise<Wallpaper> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client is not initialized.');
  }

  const dbPayload = mapWallpaperToDbPayload({
    ...wpData,
    views: 0,
    downloads: 0,
    favorites: 0,
    uploadDate: new Date().toISOString().split('T')[0]
  });

  const { data, error } = await client
    .from('wallpapers')
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    console.warn('DB Insert notice:', error.message || error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return mapDbRowToWallpaper(data);
}

// Delete wallpaper from DB
export async function deleteWallpaperFromSupabase(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client
    .from('wallpapers')
    .delete()
    .eq('id', id);

  if (error) {
    console.warn('DB Delete notice:', error.message || error);
    throw error;
  }
}

// Update wallpaper metadata in Supabase DB
export async function updateWallpaperInSupabase(
  id: string,
  updated: Partial<Wallpaper>
): Promise<Wallpaper | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const dbPayload = mapWallpaperToDbPayload(updated);
  const cleanPayload = Object.fromEntries(
    Object.entries(dbPayload).filter(([_, v]) => v !== undefined)
  );

  const { data, error } = await client
    .from('wallpapers')
    .update(cleanPayload)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.warn('DB Update notice:', error.message || error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  return data ? mapDbRowToWallpaper(data) : null;
}

// Update wallpaper stats (downloads, views, favorites)
export async function incrementStatsInSupabase(
  id: string,
  field: 'downloads' | 'views' | 'favorites',
  incrementBy = 1
): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const { data } = await client
    .from('wallpapers')
    .select(field)
    .eq('id', id)
    .single();

  if (data) {
    const currentVal = Number(data[field] || 0);
    await client
      .from('wallpapers')
      .update({ [field]: currentVal + incrementBy })
      .eq('id', id);
  }
}

// Seed initial wallpapers array into Supabase
export async function seedInitialWallpapersToSupabase(
  initialWallpapers: Wallpaper[]
): Promise<Wallpaper[]> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client not configured.');

  const dbPayloads = initialWallpapers.map((wp) => mapWallpaperToDbPayload(wp));

  const { data, error } = await client
    .from('wallpapers')
    .insert(dbPayloads)
    .select();

  if (error) {
    console.warn('Seed notice:', error.message || error);
    throw error;
  }

  return (data || []).map(mapDbRowToWallpaper);
}

// SQL Schema code string helper for admin setup UI
export const SUPABASE_SQL_SCHEMA = `-- 1. Create Wallpapers Table
create table if not exists public.wallpapers (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  url text not null,
  thumbnail_url text,
  category text not null,
  resolution text default '3840 x 2160',
  resolution_tag text default '4K',
  size text default '5.0 MB',
  orientation text default 'landscape',
  color_hex jsonb default '["#0B1220", "#38BDF8", "#818CF8"]'::jsonb,
  color_name text default 'Blue',
  upload_date text default to_char(now(), 'YYYY-MM-DD'),
  views integer default 0,
  downloads integer default 0,
  favorites integer default 0,
  tags jsonb default '[]'::jsonb,
  author jsonb default '{"name": "Station Creator", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}'::jsonb,
  author_name text,
  author_avatar text,
  is_featured boolean default false,
  is_wallpaper_of_the_day boolean default false,
  is_ai_generated boolean default false,
  aspect_ratio text default '16:9',
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security & Allow Public Read/Write Access
alter table public.wallpapers enable row level security;

create policy "Public Access Read" on public.wallpapers for select using (true);
create policy "Public Access Insert" on public.wallpapers for insert with check (true);
create policy "Public Access Update" on public.wallpapers for update using (true);
create policy "Public Access Delete" on public.wallpapers for delete using (true);

-- 3. Storage Bucket Setup Instructions:
-- Go to Supabase Console -> Storage -> New Bucket
-- Name: "wallpapers"
-- Toggle ON "Public Bucket"
-- Under Storage Policies, create a policy allowing Public Read and Uploads.
`;
