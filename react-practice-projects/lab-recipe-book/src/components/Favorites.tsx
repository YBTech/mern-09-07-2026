import RecipeCard from "./RecipeCard";

const Favorites: React.FC = () => {
  return (
    <div className="favorites-container">
      {/* TODO: implement favorites list (data-testid="favorites-list") and "No favorites yet!" message (data-testid="no-favorites") */}
      <RecipeCard />
    </div>
  );
};

export default Favorites;
