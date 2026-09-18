import { Recipe } from "../types";
import RecipeCard from "./RecipeCard";

const RecipeList: React.FC = () => {
  return (
    <div className="recipe-list-container">
      {/* TODO: implement search bar (filter recipes by name, case insensitive) */}
      <input
        type="text"
        placeholder="Search recipes..."
        className="search-input"
        data-testid="search-input"
      />

      {/* TODO: render a RecipeCard for each recipe that matches the search query */}
      <div className="recipe-list" data-testid="recipe-list">
        <RecipeCard />
      </div>

      {/* TODO: display "No recipes match your search." (data-testid="no-recipes-message") when the search query matches nothing */}
    </div>
  );
};

export default RecipeList;
