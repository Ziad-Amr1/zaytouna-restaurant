/**
 * Safe wrapper around browser localStorage to handle private browsing quota limits,
 * DOMExceptions, and SSR environments gracefully.
 */
export const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch {
      return fallback;
    }
  },

  getItem(key, fallback = null) {
    return this.get(key, fallback);
  },

  getJSON(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch {
      return false;
    }
  },

  setItem(key, value) {
    return this.set(key, value);
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key) {
    return this.remove(key);
  },
};

export default storage;
