// Anonymous, stable install identity — the key that telemetry, the AI proxy and the
// admin Support lookup share. No accounts: this id is the whole identity model
// (relift's mechanism, minus its sqlite profile row — here it's one AsyncStorage key).
//
// Deliberately SEPARATE from the app-state blob (langtoll:v1): a settings "reset"
// wipes progress but must not mint a new identity, or support codes and the
// server-side entitlement mirror would dangle.
//
// Access is synchronous from a module cache so call sites (telemetry, fetch headers)
// never await. initDeviceId() is awaited once at app start (_layout, before anything
// user-visible); until it resolves getDeviceId() returns 'unknown' and telemetry
// drops the event rather than forking a second id.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'langtoll:device';

let cached: string | null = null;

function mint(): string {
  let hex = '';
  for (let i = 0; i < 24; i++) hex += Math.floor(Math.random() * 16).toString(16);
  return `dev_${hex}`;
}

/** Load (or mint + persist) the install id. Await once at app start. */
export async function initDeviceId(): Promise<string> {
  if (cached) return cached;
  try {
    const stored = await AsyncStorage.getItem(KEY);
    if (stored) {
      cached = stored;
      return stored;
    }
    const fresh = mint();
    cached = fresh;
    await AsyncStorage.setItem(KEY, fresh);
    return fresh;
  } catch {
    // Storage hiccup: run with an ephemeral id rather than crash — it heals to a
    // stable one on the next successful launch.
    cached ??= mint();
    return cached;
  }
}

/** Sync accessor. 'unknown' only in the pre-init window (callers treat that as "drop"). */
export function getDeviceId(): string {
  return cached ?? 'unknown';
}

/** Short human-readable form for the Settings support row: XXXX-XXXX. */
export function supportCode(): string {
  const id = getDeviceId();
  if (id === 'unknown') return '—';
  const raw = id.replace(/^dev_/, '').slice(0, 8).toUpperCase();
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

/** Where a human answers. Also in the store metadata and the review notes. */
export const SUPPORT_EMAIL = 'support@langtoll.app';
