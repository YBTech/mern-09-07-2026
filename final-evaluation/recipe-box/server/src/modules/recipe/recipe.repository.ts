import { db } from '../../db/index.js';
import { recipes, Recipe, NewRecipe } from '../../db/schema.js';
import { eq, like, and, sql, desc, asc } from 'drizzle-orm';
import { RecipeFilters } from './recipe.types.js';

export const findAll = async (filters: RecipeFilters) => {
  const {
    page = 1,
    limit = 10,
    search,
    cuisine,
    difficulty,
    isVegetarian,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const offset = (page - 1) * limit;
  const conditions = [];

  if (search) {
    conditions.push(like(recipes.title, `%${search}%`));
  }
  if (cuisine) {
    conditions.push(eq(recipes.cuisine, cuisine));
  }
  if (difficulty) {
    conditions.push(eq(recipes.difficulty, difficulty));
  }
  if (isVegetarian !== undefined) {
    conditions.push(eq(recipes.isVegetarian, isVegetarian));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const sortColumn = sortBy === 'prepTimeMinutes' ? recipes.prepTimeMinutes :
                     sortBy === 'title' ? recipes.title :
                     recipes.createdAt;
  const orderClause = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

  const [data, countResult] = await Promise.all([
    db.select().from(recipes).where(whereClause).orderBy(orderClause).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(recipes).where(whereClause),
  ]);

  return {
    data,
    totalCount: Number(countResult[0]?.count || 0),
  };
};

export const findById = async (id: number): Promise<Recipe | undefined> => {
  const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  return result[0];
};

export const create = async (data: NewRecipe): Promise<Recipe> => {
  const result = await db.insert(recipes).values(data).returning();
  return result[0];
};

export const update = async (id: number, data: Partial<NewRecipe>): Promise<Recipe> => {
  const result = await db.update(recipes).set(data).where(eq(recipes.id, id)).returning();
  return result[0];
};

export const deleteById = async (id: number): Promise<void> => {
  await db.delete(recipes).where(eq(recipes.id, id));
};
