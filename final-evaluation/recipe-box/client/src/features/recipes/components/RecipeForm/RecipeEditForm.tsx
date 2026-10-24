import { useState, useEffect, type SubmitEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Recipe, RecipeFormData, Ingredient } from "../../types/recipe.types";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import styles from "./RecipeForm.module.css";

const API_URL = "http://localhost:4000/api";

export function RecipeEditForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    cuisine: "Other",
    difficulty: "Medium",
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    isVegetarian: false,
    ingredients: [{ name: "", amount: "" }],
    instructions: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get<Recipe>(`${API_URL}/recipes/${id}`);
        const recipe = response.data;
        setFormData({
          title: recipe.title,
          description: recipe.description,
          cuisine: recipe.cuisine,
          difficulty: recipe.difficulty,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          servings: recipe.servings,
          isVegetarian: recipe.isVegetarian,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          imageUrl: recipe.imageUrl || "",
        });
      } catch {
        alert("Failed to load recipe");
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }
    if (formData.prepTimeMinutes <= 0) {
      newErrors.prepTimeMinutes = "Prep time must be positive";
    }
    if (formData.cookTimeMinutes < 0) {
      newErrors.cookTimeMinutes = "Cook time must be non-negative";
    }
    if (formData.servings <= 0) {
      newErrors.servings = "Servings must be positive";
    }
    if (
      formData.ingredients.length === 0 ||
      formData.ingredients.every((i) => !i.name)
    ) {
      newErrors.ingredients = "At least one ingredient is required";
    }
    if (!formData.instructions) {
      newErrors.instructions = "Instructions are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    setSubmitting(true);
    try {
      const filteredIngredients = formData.ingredients.filter(
        (i) => i.name && i.amount,
      );
      const dataToSubmit = {
        ...formData,
        ingredients: filteredIngredients,
      };

      await axios.put(`${API_URL}/recipes/${id}`, dataToSubmit);
      navigate(`/recipes/${id}`);
    } catch {
      alert("Failed to save recipe");
    } finally {
      setSubmitting(false);
    }
  };
  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: "", amount: "" }],
    });
  };
  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };
  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };
  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <h1>Edit Recipe</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className={errors.title ? styles.inputError : ""}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className={errors.description ? styles.inputError : ""}
          />
          {errors.description && (
            <span className={styles.error}>{errors.description}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="cuisine">Cuisine *</label>
            <select
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) =>
                setFormData({ ...formData, cuisine: e.target.value })
              }
            >
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
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
            >
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
              value={formData.prepTimeMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prepTimeMinutes: Number(e.target.value),
                })
              }
              className={errors.prepTimeMinutes ? styles.inputError : ""}
            />
            {errors.prepTimeMinutes && (
              <span className={styles.error}>{errors.prepTimeMinutes}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="cookTime">Cook Time (minutes) *</label>
            <input
              id="cookTime"
              type="number"
              min="0"
              value={formData.cookTimeMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cookTimeMinutes: Number(e.target.value),
                })
              }
              className={errors.cookTimeMinutes ? styles.inputError : ""}
            />
            {errors.cookTimeMinutes && (
              <span className={styles.error}>{errors.cookTimeMinutes}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="servings">Servings *</label>
            <input
              id="servings"
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) =>
                setFormData({ ...formData, servings: Number(e.target.value) })
              }
              className={errors.servings ? styles.inputError : ""}
            />
            {errors.servings && (
              <span className={styles.error}>{errors.servings}</span>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>
            <input
              type="checkbox"
              checked={formData.isVegetarian}
              onChange={(e) =>
                setFormData({ ...formData, isVegetarian: e.target.checked })
              }
            />{" "}
            Vegetarian
          </label>
        </div>

        <div className={styles.field}>
          <label>Ingredients *</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
              <input
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) =>
                  updateIngredient(index, "amount", e.target.value)
                }
                className={styles.ingredientInput}
              />
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
                className={styles.ingredientInput}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className={styles.addButton}
          >
            Add Ingredient
          </button>
          {errors.ingredients && (
            <span className={styles.error}>{errors.ingredients}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="instructions">Instructions *</label>
          <textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            rows={6}
            className={errors.instructions ? styles.inputError : ""}
          />
          {errors.instructions && (
            <span className={styles.error}>{errors.instructions}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            id="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? "Saving..." : "Update Recipe"}
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
