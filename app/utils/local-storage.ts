// 安全地访问 localStorage 的包装器
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },

  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn(`Error setting localStorage key "${key}":`, e);
      }
    }
  },

  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};
