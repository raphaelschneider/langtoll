// The generated content pool — the reason exercises stop repeating.
//
// The bundled packs hold a few hundred items per language/level. Someone doing
// ten unlocks a day exhausts that in days, which is exactly the complaint that
// started this: the same B1 sentence turning up session after session. The pool
// adds the shared catalogue on top — generated once on the server, cached in the
// database, and served identically to every user.
//
// CACHED ON DEVICE, ON PURPOSE. The lock has to work on a plane. Sessions must
// never wait on a network call, so the pool is fetched in the background, written
// to AsyncStorage, and read synchronously from memory afterwards. A user who has
// never had signal simply trains on the bundled packs — degraded, never broken.
//
// EVERY USER GETS IT. This is not a Plus feature. Cost scales with distinct
// content, not with installs, so there is nothing to ration — and repetition is
// the thing most likely to make someone uninstall.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language, Level, VocabItem, SentenceItem } from '@/content/german/types';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? null;

/** One generated topic pack as the server returns it. */
interface PoolPack {
  name: string;
  vocab: VocabItem[];
  sentences: SentenceItem[];
}

interface CachedPool {
  packs: PoolPack[];
  fetchedAt: string;
  /** Catalogue size at fetch time — lets us tell "complete" from "still warming". */
  catalogue: number;
}

const key = (language: Language, level: Level) => `langpass:pool:${language}:${level}`;

// In-memory mirror so activePack() — called on every session build — never awaits
// storage. Populated by loadPool(); a miss just means the bundled packs are used.
const memory = new Map<string, CachedPool>();

/** Cached pool for this pair, or null. Synchronous by design. */
export function poolFor(language: Language, level: Level): CachedPool | null {
  return memory.get(key(language, level)) ?? null;
}

/** Flattened, ready to merge into a pack. Items are tagged as AI-sourced. */
export function poolItems(
  language: Language,
  level: Level
): { vocab: VocabItem[]; sentences: SentenceItem[] } {
  const cached = poolFor(language, level);
  if (!cached) return { vocab: [], sentences: [] };
  const vocab: VocabItem[] = [];
  const sentences: SentenceItem[] = [];
  for (const pack of cached.packs) {
    for (const v of pack.vocab ?? []) vocab.push({ ...v, source: 'ai' });
    for (const s of pack.sentences ?? []) sentences.push({ ...s, source: 'ai' });
  }
  return { vocab, sentences };
}

/** Read the on-device cache into memory. Call once at launch, before sessions. */
export async function loadPool(language: Language, level: Level): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(key(language, level));
    if (raw) memory.set(key(language, level), JSON.parse(raw));
  } catch {
    // corrupt or absent — bundled packs carry the session
  }
}

/**
 * Fetch the pool for this pair and cache it. Safe to call on every launch: the
 * server serves from its own cache, and a failure leaves the previous copy in
 * place rather than emptying it.
 *
 * The endpoint warms at most one missing topic per request, so early calls
 * return a partial pool that grows. Re-syncing while `complete` is false is how
 * a device eventually reaches the full catalogue.
 */
export async function syncPool(language: Language, level: Level): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/api/topics/pool?language=${language}&level=${level}`, {
      headers: { 'x-device-id': await deviceId() },
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { packs?: PoolPack[]; catalogue?: number };
    if (!Array.isArray(body.packs) || body.packs.length === 0) return false;

    const cached: CachedPool = {
      packs: body.packs,
      fetchedAt: new Date().toISOString(),
      catalogue: body.catalogue ?? body.packs.length,
    };
    memory.set(key(language, level), cached);
    await AsyncStorage.setItem(key(language, level), JSON.stringify(cached));
    return true;
  } catch {
    return false; // offline — keep whatever is already cached
  }
}

/** Load the cache, then refresh in the background. Never throws, never blocks. */
export async function initPool(language: Language, level: Level): Promise<void> {
  await loadPool(language, level);
  void syncPool(language, level);
}

async function deviceId(): Promise<string> {
  try {
    const { getDeviceId } = await import('@/lib/db/queries');
    return await getDeviceId();
  } catch {
    return 'unknown';
  }
}
