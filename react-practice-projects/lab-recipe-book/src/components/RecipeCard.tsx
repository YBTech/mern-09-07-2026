import { Link } from "react-router-dom";
import { Recipe } from "../types";

const RecipeCard: React.FC = () => {
  return (
    <div className="recipe-card" data-testid="recipe-card">
      <h3>Caprese Salad</h3>
      <p>A fresh salad with tomatoes, mozzarella, and basil.</p>
      <div className="card-actions">
        <button>"Add to Favorites"</button>
        <Link to={`/recipe/1`}>View Details</Link>
      </div>
    </div>
  );
};

export default RecipeCard;
