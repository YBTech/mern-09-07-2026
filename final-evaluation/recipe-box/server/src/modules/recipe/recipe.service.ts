import * as recipeRepository from './recipe.repository.js';
import { RecipeFilters, RecipeInput } from './recipe.types.js';
import { NotFoundError } from '../../shared/errors.js';
import { PaginatedResponse } from '../../shared/types.js';
import { Recipe } from '../../db/schema.js';

// 🔴 TODO (bonus): add totalTimeMinutes (prepTimeMinutes + cookTimeMinutes) to every recipe in `data`
export const getAllRecipes = async (filters: RecipeFilters): Promise<PaginatedResponse<Recipe>> => {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(50, Math.max(1, filters.limit || 10));

  const sanitizedFilters = {
    ...filters,
    page,
    limit,
  };

  const { data, totalCount } = await recipeRepository.findAll(sanitizedFilters);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    page,
    limit,
    totalPages,
    totalCount,
  };
};

// 🔴 TODO (bonus): return the recipe with totalTimeMinutes (prepTimeMinutes + cookTimeMinutes) added
export const getRecipeById = async (id: number): Promise<Recipe> => {
  const recipe = await recipeRepository.findById(id);
  if (!recipe) {
    throw new NotFoundError(`Recipe with id ${id} not found`);
  }
  return recipe;
};

// 🔴 TODO: Fill in imageUrl (empty -> null) and the timestamps, then create via the repository
export const createRecipe = async (data: RecipeInput): Promise<Recipe> => {
  throw new Error('TODO: Implement createRecipe');
};

// 🔴 TODO: Check the recipe exists (reuse getRecipeById), turn an empty imageUrl into null, set updatedAt, update via the repository
export const updateRecipe = async (id: number, data: Partial<RecipeInput>): Promise<Recipe> => {
  throw new Error('TODO: Implement updateRecipe');
};

// 🔴 TODO: Check the recipe exists (reuse getRecipeById), then delete via the repository
export const deleteRecipe = async (id: number): Promise<void> => {
  throw new Error('TODO: Implement deleteRecipe');
};
