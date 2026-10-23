import { RecipeCard } from "../../recipes/components/RecipeCard";
import styles from "./FeaturedRecipes.module.css";

export function FeaturedRecipes() {
  return (
    <div className={styles.container}>
      <h2>Featured Recipes</h2>
      <div className={styles.grid}>
        <RecipeCard />
      </div>
    </div>
  );
}
