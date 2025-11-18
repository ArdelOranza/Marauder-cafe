
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface FavoritesContextType {
  favoriteItems: string[]; // Store names of favorite items
  addFavorite: (itemName: string) => void;
  removeFavorite: (itemName: string) => void;
  isFavorite: (itemName: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
    children: ReactNode;
}

const getInitialFavorites = (): string[] => {
    try {
        const item = window.localStorage.getItem('marauders-horcruxes');
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Could not parse favorites from localStorage", error);
        return [];
    }
};

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<string[]>(getInitialFavorites);

  useEffect(() => {
      try {
          window.localStorage.setItem('marauders-horcruxes', JSON.stringify(favoriteItems));
      } catch (error) {
          console.error("Could not save favorites to localStorage", error);
      }
  }, [favoriteItems]);

  const addFavorite = (itemName: string) => {
    setFavoriteItems(prev => [...new Set([...prev, itemName])]);
  };

  const removeFavorite = (itemName: string) => {
    setFavoriteItems(prev => prev.filter(name => name !== itemName));
  };

  const isFavorite = (itemName: string) => {
    return favoriteItems.includes(itemName);
  };

  const favoritesCount = favoriteItems.length;

  const value = {
    favoriteItems,
    addFavorite,
    removeFavorite,
    isFavorite,
    favoritesCount
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
