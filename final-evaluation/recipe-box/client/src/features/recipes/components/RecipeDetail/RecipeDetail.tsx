import { Link } from "react-router-dom";
import { FavoriteButton } from "../../../favorites/components/FavoriteButton";
import { CookTimer } from "../CookTimer/CookTimer";
import { formatTime } from "../../../../shared/utils/formatters";
import styles from "./RecipeDetail.module.css";

export function RecipeDetail() {
  // 🔴 TODO:
  // 1. Get recipe ID from URL params using useParams
  // 2. Fetch GET /recipes/:id with axios on component mount, and send DELETE /recipes/:id from the delete handler
  // 3. Display loading state and handle errors
  // 4. Implement delete handler with confirmation dialog

  const recipe = {
    id: 1,
    title: "Classic Margherita Pizza",
    description:
      "Traditional Italian pizza with fresh mozzarella, tomatoes, and basil",
    cuisine: "Italian",
    difficulty: "Medium",
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: "Pizza dough", amount: "1 lb" },
      { name: "Fresh mozzarella", amount: "8 oz" },
      { name: "Tomato sauce", amount: "1 cup" },
    ],
    instructions:
      "Preheat oven to 475°F. Roll out dough on a floured surface. Spread tomato sauce evenly, add mozzarella slices. Bake for 12-15 minutes until crust is golden.",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/recipes" className={styles.back}>
          ← Back to Recipes
        </Link>
        <div className={styles.actions}>
          <FavoriteButton recipeId={recipe.id} />
          <Link to="/recipes/1/edit" className={styles.editButton}>
            Edit
          </Link>
          <button onClick={() => {}} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>

      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className={styles.image}
        />
      )}

      <h1>{recipe.title}</h1>
      <p className={styles.description}>{recipe.description}</p>

      <div className={styles.meta}>
        <span className={styles.badge}>{recipe.cuisine}</span>
        <span className={styles.badge}>{recipe.difficulty}</span>
        {recipe.isVegetarian && (
          <span className={styles.badge}>Vegetarian</span>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <strong>Prep Time:</strong> {formatTime(recipe.prepTimeMinutes)}
        </div>
        <div className={styles.infoItem}>
          <strong>Cook Time:</strong> {formatTime(recipe.cookTimeMinutes)}
        </div>
        <div className={styles.infoItem}>
          <strong>Servings:</strong> {recipe.servings}
        </div>
      </div>

      <CookTimer />

      <section className={styles.section}>
        <h2>Ingredients</h2>
        <ul className={styles.ingredients}>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              <strong>{ingredient.amount}</strong> {ingredient.name}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Instructions</h2>
        <p className={styles.instructions}>{recipe.instructions}</p>
      </section>
    </div>
  );
}
