import safeStorage from "./storage";

const STORAGE_KEY = "zaytouna.favorites";

function readFavorites() {
  return safeStorage.getJSON(STORAGE_KEY, []);
}

function saveFavorites(ids) {
  safeStorage.setJSON(STORAGE_KEY, ids);
}

export function getFavorites() {
  return readFavorites();
}

export function isFavorite(id) {
  return readFavorites().includes(String(id));
}

export function toggleFavorite(id) {
  const favoriteId = String(id);
  const favorites = readFavorites();

  const nextFavorites = favorites.includes(favoriteId)
    ? favorites.filter((item) => item !== favoriteId)
    : [...favorites, favoriteId];

  saveFavorites(nextFavorites);

  window.dispatchEvent(new Event("favorites:change"));

  return nextFavorites.includes(favoriteId);
}
