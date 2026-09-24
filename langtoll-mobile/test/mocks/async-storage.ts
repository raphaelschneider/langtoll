// In-memory AsyncStorage for tests: the store persists on every setState and
// hydrates at import time; nothing here ever touches disk.
// One map for the whole test process: jest.isolateModules() re-instantiates
// this module along with the store, and a fresh store must still find what a
// test seeded before requiring it.
const g = globalThis as unknown as { __langtollAsyncStorage?: Map<string, string> };
const memory = (g.__langtollAsyncStorage ??= new Map<string, string>());

const AsyncStorage = {
  async getItem(key: string): Promise<string | null> {
    return memory.get(key) ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    memory.set(key, value);
  },
  async removeItem(key: string): Promise<void> {
    memory.delete(key);
  },
  async clear(): Promise<void> {
    memory.clear();
  },
};

export default AsyncStorage;
