import { useParams } from "react-router-dom";

const RecipeDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="recipe-details" data-testid="recipe-details">
      {/* TODO: implement recipe details page with name, ingredients, instructions, and a back button */}
    </div>
  );
};

export default RecipeDetails;
