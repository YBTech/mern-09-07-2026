import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  cuisine: text('cuisine').notNull(),
  difficulty: text('difficulty').notNull(),
  prepTimeMinutes: integer('prep_time_minutes').notNull(),
  cookTimeMinutes: integer('cook_time_minutes').notNull(),
  servings: integer('servings').notNull(),
  isVegetarian: integer('is_vegetarian', { mode: 'boolean' }).notNull().default(false),
  ingredients: text('ingredients', { mode: 'json' }).notNull().$type<Array<{ name: string; amount: string }>>(),
  instructions: text('instructions').notNull(),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
