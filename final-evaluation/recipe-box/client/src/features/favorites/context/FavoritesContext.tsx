import { createContext, useContext, type ReactNode } from "react";
import type { FavoritesContextType } from "../types/favorites.types";

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // 🔴 TODO: Create favorites state, toggleFavorite and isFavorite functions, wrap children in Provider

  return (
    <FavoritesContext.Provider
      value={{
        favorites: [],
        toggleFavorite: () => {},
        isFavorite: () => false,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
