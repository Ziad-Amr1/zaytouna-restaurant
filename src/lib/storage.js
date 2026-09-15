/**
 * Safe wrapper around browser localStorage to handle private browsing quota limits,
 * DOMExceptions, and SSR environments gracefully.
 */
export const storage = {
  getItem(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch {
      return fallback;
    }
  },

  getJSON(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  setItem(key, value) {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
