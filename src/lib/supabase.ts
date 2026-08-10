import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Wallpaper,
  ResolutionOption,
  CategoryName,
  OrientationType,
} from '../types';

export const ADMIN_SUPABASE_UID =
  import.meta.env.VITE_ADMIN_SUPABASE_UID || '';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean =>
  Boolean(supabaseUrl && supabaseAnonKey);

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
};

// ─────────────────────────────────────────────
// EMAIL / PASSWORD AUTHENTICATION
// ─────────────────────────────────────────────

export const signInWithEmail = async (
  email: string,
  password: string
) => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      data: null,
      error: new Error('Supabase is not configured.'),
    };
  }

  return client.auth.signInWithPassword({
    email,
    password,
  });
};

// ─────────────────────────────────────────────
// GOOGLE AUTHENTICATION
// ─────────────────────────────────────────────

export const signInWithGoogle = async () => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      data: {
        provider: 'google' as const,
        url: null,
      },
      error: new Error('Supabase is not configured.'),
    };
  }

  return client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
};

// ─────────────────────────────────────────────
// CREATE ACCOUNT
// ─────────────────────────────────────────────

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
      error: new Error('Supabase is not configured.'),
    };
  }

  return client.auth.signUp({
    email,
    password,
    options: {
      data: name
        ? {
            full_name: name,
            name,
          }
        : undefined,
      emailRedirectTo: window.location.origin,
    },
  });
};

// ─────────────────────────────────────────────
// SIGN OUT
// ─────────────────────────────────────────────

export const signOutUser = async () => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      error: null,
    };
  }

  return client.auth.signOut();
};

// ─────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────

export const sendPasswordResetEmail = async (
  email: string
) => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      data: {},
      error: new Error('Supabase is not configured.'),
    };
  }

  return client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/`,
  });
};

// ─────────────────────────────────────────────
// WALLPAPER DATABASE
// ─────────────────────────────────────────────

export const fetchWallpapersFromSupabase = async (): Promise<
  Wallpaper[]
> => {
  const client = getSupabaseClient();

  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('wallpapers')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data || []) as Wallpaper[];
};

export const uploadWallpaperFileAndSave = async (
  file: File,
  wallpaperId: string
) => {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const path = `${wallpaperId}/${file.name}`;

  const { error } = await client.storage
    .from('wallpapers')
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data } = client.storage
    .from('wallpapers')
    .getPublicUrl(path);

  return data.publicUrl;
};

export const insertWallpaperToSupabase = async (
  wallpaper: any
) => {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  return client
    .from('wallpapers')
    .insert(wallpaper)
    .select()
    .single();
};

export const deleteWallpaperFromSupabase = async (
  id: string
) => {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  return client
    .from('wallpapers')
    .delete()
    .eq('id', id);
};

export const updateWallpaperInSupabase = async (
  id: string,
  updated: any
) => {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  return client
    .from('wallpapers')
    .update(updated)
    .eq('id', id)
    .select()
    .single();
};

export const incrementStatsInSupabase = async (
  id: string,
  field: string,
  amount = 1
) => {
  const client = getSupabaseClient();

  if (!client) {
    return;
  }

  const { data: current, error: fetchError } =
    await client
      .from('wallpapers')
      .select(field)
      .eq('id', id)
      .single();

  if (fetchError) {
    throw fetchError;
  }

  const currentValue = Number(
    (current as any)?.[field] || 0
  );

  const { error } = await client
    .from('wallpapers')
    .update({
      [field]: Math.max(
        0,
        currentValue + amount
      ),
    })
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const seedInitialWallpapersToSupabase = async (
  wallpapers: Wallpaper[]
) => {
  const client = getSupabaseClient();

  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  return client
    .from('wallpapers')
    .upsert(wallpapers);
};
