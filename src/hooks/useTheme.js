import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";
const DARK = "dark";
const LIGHT = "light";

const listeners = new Set();
let currentTheme = getStoredTheme();

function getStoredTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === DARK ? DARK : LIGHT;
}

function getSnapshot() {
  return currentTheme;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === DARK) {
    root.setAttribute("data-theme", DARK);
  } else {
    root.removeAttribute("data-theme");
  }
}

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  useLayoutEffect(() => {
    applyTheme(currentTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = currentTheme === DARK ? LIGHT : DARK;
    currentTheme = next;
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  }, []);

  return { theme, toggleTheme };
}