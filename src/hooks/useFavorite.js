import { useCallback, useSyncExternalStore } from "react";

import { isFavorite, toggleFavorite as toggleFavoriteInStore } from "@/lib/favorites";

function subscribeToFavoritesChange(callback) {
  window.addEventListener("favorites:change", callback);
  return () => {
    window.removeEventListener("favorites:change", callback);
  };
}

export default function useFavorite(id) {
  const favored = useSyncExternalStore(
    subscribeToFavoritesChange,
    () => isFavorite(id),
  );

  const toggleFavorite = useCallback(() => {
    toggleFavoriteInStore(id);
  }, [id]);

  return { isFavorite: favored, toggleFavorite };
}