// Optional storage backend: Supabase (Postgres).
// Enables real cross-device sharing — a link created on one device can be
// opened by a guest on any other device, because data lives in a real
// database instead of the creator's browser.
//
// Setup:
//   1. Create a free project at https://supabase.com
//   2. Run supabase/schema.sql in the Supabase SQL editor
//   3. Copy your Project URL + anon public key into .env (see .env.example)
//   4. Restart `npm run dev` — src/lib/storage.js switches to this file
//      automatically once both env vars are present.
//
// Note on privacy: there is no login system here, so "personal" data
// (My Invitations / My Templates) is scoped to a random device ID stored
// in this browser's localStorage, not to a real account. Clearing browser
// data or switching devices starts a fresh, empty personal list. Shared
// data (a saved invitation, looked up by its ID) is readable by anyone
// with the link, which is the intended behaviour. The SQL schema also
// ships with a wide-open row-level-security policy suitable for a personal
// project — tighten it before handling real user accounts or sensitive data.

import { createClient } from '@supabase/supabase-js';

// Fall back to harmless placeholders so this module can always be imported
// (see storage.js) without throwing, even when Supabase isn't configured —
// the placeholder client is simply never called in that case.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const client = createClient(supabaseUrl, supabaseKey);

const SHARED_OWNER = '__shared__';
const TABLE = 'momenku_storage';

function getDeviceId() {
  let id = localStorage.getItem('momenku_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('momenku_device_id', id);
  }
  return id;
}

function ownerFor(shared) {
  return shared ? SHARED_OWNER : getDeviceId();
}

export async function get(key, shared = false) {
  const { data, error } = await client
    .from(TABLE)
    .select('value')
    .eq('storage_key', key)
    .eq('owner_id', ownerFor(shared))
    .maybeSingle();
  if (error || !data) return null;
  return { key, value: data.value, shared };
}

export async function set(key, value, shared = false) {
  const { error } = await client.from(TABLE).upsert(
    {
      storage_key: key,
      owner_id: ownerFor(shared),
      shared,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'storage_key,owner_id' }
  );
  if (error) throw error;
  return { key, value, shared };
}

export async function del(key, shared = false) {
  await client.from(TABLE).delete().eq('storage_key', key).eq('owner_id', ownerFor(shared));
  return { key, deleted: true, shared };
}
