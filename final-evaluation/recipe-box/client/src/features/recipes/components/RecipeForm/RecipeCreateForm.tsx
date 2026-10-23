import { useNavigate } from "react-router-dom";
import styles from "./RecipeForm.module.css";

export function RecipeCreateForm() {
  const navigate = useNavigate();

  // 🔴 TODO:
  // 1. Create form state for all recipe fields using useState (the inputs below should become controlled inputs)
  // 2. Implement form validation (title, description, times, servings, at least one ingredient, instructions)
  // 3. Handle form submission: POST /recipes with axios (base URL http://localhost:4000/api),
  //    then navigate to the new recipe's detail page
  // 4. Implement dynamic ingredient list (add/remove)

  return (
    <div className={styles.container}>
      <h1>Create Recipe</h1>

      <form onSubmit={() => {}} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input id="title" type="text" value="" onChange={() => {}} />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea id="description" value="" onChange={() => {}} rows={3} />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="cuisine">Cuisine *</label>
            <select id="cuisine" value="Other" onChange={() => {}}>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="American">American</option>
              <option value="Indian">Indian</option>
              <option value="French">French</option>
              <option value="Thai">Thai</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="difficulty">Difficulty *</label>
            <select id="difficulty" value="Medium" onChange={() => {}}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="prepTime">Prep Time (minutes) *</label>
            <input
              id="prepTime"
              type="number"
              min="1"
              value={0}
              onChange={() => {}}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="cookTime">Cook Time (minutes) *</label>
            <input
              id="cookTime"
              type="number"
              min="0"
              value={0}
              onChange={() => {}}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="servings">Servings *</label>
            <input
              id="servings"
              type="number"
              min="1"
              value={1}
              onChange={() => {}}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>
            <input type="checkbox" checked={false} onChange={() => {}} />{" "}
            Vegetarian
          </label>
        </div>

        <div className={styles.field}>
          <label>Ingredients *</label>
          <div className={styles.ingredientRow}>
            <input
              type="text"
              placeholder="Amount"
              value=""
              onChange={() => {}}
              className={styles.ingredientInput}
            />
            <input
              type="text"
              placeholder="Ingredient name"
              value=""
              onChange={() => {}}
              className={styles.ingredientInput}
            />
          </div>
          <button type="button" onClick={() => {}} className={styles.addButton}>
            Add Ingredient
          </button>
        </div>

        <div className={styles.field}>
          <label htmlFor="instructions">Instructions *</label>
          <textarea id="instructions" value="" onChange={() => {}} rows={6} />
        </div>

        <div className={styles.field}>
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input id="imageUrl" type="text" value="" onChange={() => {}} />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Create Recipe
          </button>
          <button
            type="button"
            onClick={() => navigate("/recipes")}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
