const STORAGE_KEY = "zaytouna.favorites";

function readFavorites() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
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
