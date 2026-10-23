import { RecipeCard } from '../../recipes/components/RecipeCard';
import styles from './FavoritesPage.module.css';

export function FavoritesPage() {
  // 🔴 TODO: Get favorites from context, fetch recipe details for each favorite ID, handle loading/error states
  
  return (
    <div className={styles.container}>
      <h1>Favorite Recipes</h1>
      
      <div className={styles.empty}>
        <p>No favorite recipes yet</p>
        <p>Click the star icon on any recipe to add it to your favorites!</p>
      </div>
    </div>
  );
}
