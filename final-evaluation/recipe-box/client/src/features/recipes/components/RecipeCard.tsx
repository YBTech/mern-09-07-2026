import { Link } from "react-router-dom";
import { FavoriteButton } from "../../favorites/components/FavoriteButton";
import { formatTime } from "../../../shared/utils/formatters";
import styles from "./RecipeCard.module.css";

// 🔴 TODO: Accept recipe prop and use all its properties dynamically
export function RecipeCard() {
  return (
    <div className={styles.card}>
      <img
        src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002"
        alt="Classic Margherita Pizza"
        className={styles.image}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Link to="/recipes/1">Classic Margherita Pizza</Link>
          </h3>
          <FavoriteButton recipeId={1} />
        </div>
        <p className={styles.description}>
          Traditional Italian pizza with fresh mozzarella, tomatoes, and basil
        </p>
        <div className={styles.meta}>
          <span className={styles.badge}>Italian</span>
          <span className={styles.badge}>Medium</span>
          <span className={styles.badge}>Vegetarian</span>
        </div>
        <div className={styles.time}>
          <span>Prep: {formatTime(20)}</span>
          <span>Cook: {formatTime(15)}</span>
          <span>Servings: 4</span>
        </div>
      </div>
    </div>
  );
}
