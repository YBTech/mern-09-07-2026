import { Link } from "react-router-dom";
import { RecipeCard } from "./RecipeCard";
import { RecipeFilter } from "./RecipeFilter";
import styles from "./RecipeList.module.css";

export function RecipeList() {
  // 🔴 TODO:
  // 1. Use useSearchParams to manage URL query params (search, cuisine, difficulty, isVegetarian, sortBy, sortOrder, page)
  // 2. Implement debounced search using useDebouncedValue hook
  // 3. Fetch recipes using useRecipes custom hook with all filter params
  // 4. Display loading state and handle errors
  // 5. Update URL params when filters change, reset page to 1 on filter change
  // 6. Implement pagination handlers

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Recipes</h1>
        <Link to="/recipes/new" className={styles.createButton}>
          Create Recipe
        </Link>
      </div>

      <RecipeFilter
        search=""
        cuisine=""
        difficulty=""
        isVegetarian=""
        sortBy="createdAt"
        sortOrder="desc"
        onSearchChange={() => {}}
        onCuisineChange={() => {}}
        onDifficultyChange={() => {}}
        onVegetarianChange={() => {}}
        onSortByChange={() => {}}
        onSortOrderChange={() => {}}
      />

      <div className={styles.grid}>
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>

      <div className={styles.pagination}>
        <button disabled className={styles.pageButton}>
          Previous
        </button>
        <span className={styles.pageInfo}>Page 1 of 2</span>
        <button className={styles.pageButton}>Next</button>
      </div>
    </div>
  );
}
