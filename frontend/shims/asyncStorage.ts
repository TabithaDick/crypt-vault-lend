// Lightweight AsyncStorage shim for web builds.
// This prevents MetaMask SDK's React Native storage import
// from breaking Next.js / Turbopack builds in browser environments.

const AsyncStorage = {
  getItem: async (_key: string): Promise<string | null> => null,
  setItem: async (_key: string, _value: string): Promise<void> => {},
  removeItem: async (_key: string): Promise<void> => {},
  clear: async (): Promise<void> => {},
  getAllKeys: async (): Promise<string[]> => [],
  multiGet: async (_keys: string[]): Promise<[string, string | null][]> => [],
  multiSet: async (_pairs: [string, string][]): Promise<void> => {},
  multiRemove: async (_keys: string[]): Promise<void> => {},
};

export default AsyncStorage;
