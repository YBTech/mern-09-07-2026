import { useFavorites } from '../context/FavoritesContext';
import styles from './FavoriteButton.module.css';

interface FavoriteButtonProps {
  recipeId: number;
}

export function FavoriteButton({ recipeId }: FavoriteButtonProps) {
  // 🔴 TODO: Use useFavorites hook, check if favorited, handle toggle click
  
  return (
    <button
      onClick={() => {}}
      className={styles.button}
      aria-label="Add to favorites"
    >
      ☆
    </button>
  );
}
