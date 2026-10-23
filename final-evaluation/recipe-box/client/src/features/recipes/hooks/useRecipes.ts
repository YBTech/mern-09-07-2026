import type { Recipe } from "../types/recipe.types";
import type { PaginatedResponse } from "../../../shared/types/api.types";

interface UseRecipesParams {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  difficulty?: string;
  isVegetarian?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// 🔴 TODO: Implement custom hook to fetch recipes with state management and useEffect
export function useRecipes(params: UseRecipesParams) {
  return { data: null, loading: false, error: null };
}
