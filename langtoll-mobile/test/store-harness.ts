// A fresh store per test. The store is module state hydrated once from
// AsyncStorage, so each test seeds the (mocked, in-memory) storage and
// requires the module again in an isolated registry — the real code, not a
// copy, with the state the test wants. Modules that read the store (plans)
// are required in the same isolation so they bind to the same instance.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from '@/lib/store';

type StoreModule = typeof import('@/lib/store');
type PlansModule = typeof import('@/lib/plans');

export async function freshStore(seed: Partial<AppState>): Promise<{ store: StoreModule; plans: PlansModule }> {
  await AsyncStorage.setItem('langtoll:v1', JSON.stringify(seed));
  let store!: StoreModule;
  let plans!: PlansModule;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    store = require('@/lib/store');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plans = require('@/lib/plans');
  });
  await store.hydrate();
  return { store, plans };
}

/** Local wall-clock instant, the way the app and its users think of time. */
export function local(y: number, m: number, d: number, h = 12, min = 0): Date {
  return new Date(y, m - 1, d, h, min, 0, 0);
}
