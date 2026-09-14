// Picks the storage backend automatically:
// - No .env config -> localStorage (works immediately, single-device)
// - VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY set -> Supabase (cross-device)
// See storage.local.js and storage.supabase.js for details on each.

import * as local from './storage.local';
import * as supabaseImpl from './storage.supabase';

const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

const impl = hasSupabaseConfig ? supabaseImpl : local;

export const storage = {
  get: impl.get,
  set: impl.set,
  delete: impl.del,
};
