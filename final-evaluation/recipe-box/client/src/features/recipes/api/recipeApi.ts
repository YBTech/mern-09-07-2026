import type { Recipe, RecipeFormData } from "../types/recipe.types";
import type { PaginatedResponse } from "../../../shared/types/api.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const recipeApi = {
  // 🔴 TODO: Implement getAll using axios to GET /api/recipes with query params
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    cuisine?: string;
    difficulty?: string;
    isVegetarian?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedResponse<Recipe>> => {
    throw new Error("TODO: Implement getAll");
  },

  // 🔴 TODO: Implement getById using axios to GET /api/recipes/:id
  getById: async (id: number): Promise<Recipe> => {
    throw new Error("TODO: Implement getById");
  },

  // 🔴 TODO: Implement create using axios to POST /api/recipes
  create: async (data: RecipeFormData): Promise<Recipe> => {
    throw new Error("TODO: Implement create");
  },

  // 🔴 TODO: Implement update using axios to PUT /api/recipes/:id
  update: async (
    id: number,
    data: Partial<RecipeFormData>,
  ): Promise<Recipe> => {
    throw new Error("TODO: Implement update");
  },

  // 🔴 TODO: Implement delete using axios to DELETE /api/recipes/:id
  delete: async (id: number): Promise<void> => {
    throw new Error("TODO: Implement delete");
  },
};
