// A night off: the store's pause state with the real code. The native shield
// is mocked — what matters here is that the timestamp rules hold.
import { freshStore, local } from '../test/store-harness';

const grantUnlock = jest.fn();
const lockNow = jest.fn();
jest.mock('@/lib/blocking', () => ({ grantUnlock: (...a: unknown[]) => grantUnlock(...a), lockNow: (...a: unknown[]) => lockNow(...a) }));

afterEach(() => {
  jest.useRealTimers();
  grantUnlock.mockClear();
  lockNow.mockClear();
});

describe('isLockPaused / expireLockPause', () => {
  test('no pause on record means not paused', async () => {
    const { store } = await freshStore({ lockPausedUntil: null });
    expect(store.isLockPaused()).toBe(false);
  });

  test('a pause in the future is a pause; one in the past is not', async () => {
    const now = local(2026, 9, 24, 23).getTime();
    const { store } = await freshStore({ lockPausedUntil: now + 60_000 });
    expect(store.isLockPaused(store.getState(), now)).toBe(true);
    expect(store.isLockPaused(store.getState(), now + 60_000)).toBe(false); // exactly at the end: over
  });

  test('expireLockPause clears a finished pause and leaves a running one', async () => {
    const now = local(2026, 9, 25, 8).getTime();
    const { store } = await freshStore({ lockPausedUntil: now - 1 });
    store.expireLockPause(now);
    expect(store.getState().lockPausedUntil).toBeNull();

    const { store: s2 } = await freshStore({ lockPausedUntil: now + 3600_000 });
    s2.expireLockPause(now);
    expect(s2.getState().lockPausedUntil).toBe(now + 3600_000);
  });
});

describe('pauseLock / resumeLock', () => {
  test('pausing records the end, drops any running pass and lifts the shield for the whole pause', async () => {
    const now = local(2026, 9, 24, 23).getTime();
    jest.useFakeTimers().setSystemTime(now);
    const { store } = await freshStore({ lockPausedUntil: null, unlockExpiresAt: now + 5 * 60_000 });
    const until = now + 9 * 3600_000; // 08:00
    store.pauseLock(until);
    const s = store.getState();
    expect(s.lockPausedUntil).toBe(until);
    expect(s.unlockExpiresAt).toBeNull();
    expect(grantUnlock).toHaveBeenCalledWith(9 * 60);
    expect(store.isLockPaused()).toBe(true);
  });

  test('a pause ending within the minute still lifts the shield for one minute, never zero', async () => {
    const now = local(2026, 9, 24, 7, 59).getTime();
    jest.useFakeTimers().setSystemTime(now);
    const { store } = await freshStore({ lockPausedUntil: null });
    store.pauseLock(now + 20_000);
    expect(grantUnlock).toHaveBeenCalledWith(1);
  });

  test('resuming clears the pause and locks now', async () => {
    const now = local(2026, 9, 24, 23).getTime();
    jest.useFakeTimers().setSystemTime(now);
    const { store } = await freshStore({ lockPausedUntil: now + 3600_000 });
    store.resumeLock();
    expect(store.getState().lockPausedUntil).toBeNull();
    expect(store.isLockPaused()).toBe(false);
    expect(lockNow).toHaveBeenCalled();
  });

  test('the pause survives a restart — it is persisted with the state', async () => {
    const now = local(2026, 9, 24, 23).getTime();
    jest.useFakeTimers().setSystemTime(now);
    const { store } = await freshStore({ lockPausedUntil: null });
    store.pauseLock(now + 3600_000);
    await Promise.resolve(); // let persist() write
    const { store: reloaded } = await freshStore(JSON.parse((await (await import('@react-native-async-storage/async-storage')).default.getItem('langtoll:v1')) as string));
    expect(reloaded.getState().lockPausedUntil).toBe(now + 3600_000);
  });
});
