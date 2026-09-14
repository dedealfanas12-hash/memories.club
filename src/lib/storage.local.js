// Default storage backend: browser localStorage.
// Works immediately with zero setup, but is per-browser/per-device only.
// That means invitation links only render correctly on the SAME browser
// that created them — a guest opening the link on their own phone will
// see "not found". To make links work across devices, wire up
// storage.supabase.js instead (see README.md).

const PREFIX = 'momenku_v1_';

function fullKey(key, shared) {
  return `${PREFIX}${shared ? 'shared' : 'personal'}_${key}`;
}

export async function get(key, shared = false) {
  const raw = localStorage.getItem(fullKey(key, shared));
  if (raw === null) return null;
  return { key, value: raw, shared };
}

export async function set(key, value, shared = false) {
  localStorage.setItem(fullKey(key, shared), value);
  return { key, value, shared };
}

export async function del(key, shared = false) {
  localStorage.removeItem(fullKey(key, shared));
  return { key, deleted: true, shared };
}
