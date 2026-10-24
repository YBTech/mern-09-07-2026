export const CUISINES = ['Chinese', 'Japanese', 'Italian', 'Mexican', 'American', 'Indian', 'French', 'Thai', 'Other'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export interface Ingredient {
  name: string;
  amount: string;
}

// The body of POST /recipes (PUT /recipes/:id accepts any subset of these)
export interface RecipeInput {
  title: string;
  description: string;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  isVegetarian?: boolean;
  ingredients: Ingredient[];
  instructions: string;
  imageUrl?: string;
}

export interface RecipeFilters {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  difficulty?: string;
  isVegetarian?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
