// Local storage helpers with JSON handling

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  has(key: string) {
    return localStorage.getItem(key) !== null;
  }
};

export const KEYS = {
  appState: 'wms.app.state.v1'
};
