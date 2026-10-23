import { db } from './index.js';
import { recipes } from './schema.js';

const seedRecipes = [
  {
    title: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh mozzarella, tomatoes, and basil',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Pizza dough', amount: '1 lb' },
      { name: 'Fresh mozzarella', amount: '8 oz' },
      { name: 'Tomato sauce', amount: '1 cup' },
      { name: 'Fresh basil', amount: '1/4 cup' },
      { name: 'Olive oil', amount: '2 tbsp' }
    ],
    instructions: 'Preheat oven to 475°F. Roll out dough on a floured surface. Spread tomato sauce evenly, add mozzarella slices. Bake for 12-15 minutes until crust is golden. Top with fresh basil and drizzle with olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002'
  },
  {
    title: 'Kung Pao Chicken',
    description: 'Spicy Sichuan stir-fry with chicken, peanuts, and vegetables',
    cuisine: 'Chinese',
    difficulty: 'Medium',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Chicken breast', amount: '1 lb, cubed' },
      { name: 'Peanuts', amount: '1/2 cup' },
      { name: 'Bell peppers', amount: '2, diced' },
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Dried chilies', amount: '6-8' },
      { name: 'Garlic', amount: '4 cloves, minced' }
    ],
    instructions: 'Marinate chicken in soy sauce for 10 minutes. Heat wok over high heat, stir-fry chicken until cooked. Add peppers, garlic, and chilies. Toss with peanuts and sauce. Serve over rice.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
  },
  {
    title: 'Vegetable Pad Thai',
    description: 'Classic Thai noodle dish with tofu and vegetables',
    cuisine: 'Thai',
    difficulty: 'Medium',
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 3,
    isVegetarian: true,
    ingredients: [
      { name: 'Rice noodles', amount: '8 oz' },
      { name: 'Firm tofu', amount: '8 oz, cubed' },
      { name: 'Bean sprouts', amount: '2 cups' },
      { name: 'Tamarind paste', amount: '2 tbsp' },
      { name: 'Peanuts', amount: '1/4 cup, crushed' },
      { name: 'Lime', amount: '2, cut into wedges' }
    ],
    instructions: 'Soak noodles in warm water for 30 minutes. Stir-fry tofu until golden. Add noodles, tamarind paste, and vegetables. Toss until combined. Garnish with peanuts and lime wedges.',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e'
  },
  {
    title: 'Beef Tacos',
    description: 'Mexican street-style tacos with seasoned ground beef',
    cuisine: 'Mexican',
    difficulty: 'Easy',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Ground beef', amount: '1 lb' },
      { name: 'Taco seasoning', amount: '2 tbsp' },
      { name: 'Corn tortillas', amount: '12' },
      { name: 'Lettuce', amount: '2 cups, shredded' },
      { name: 'Cheddar cheese', amount: '1 cup, shredded' },
      { name: 'Salsa', amount: '1 cup' }
    ],
    instructions: 'Brown ground beef in a skillet. Add taco seasoning and water, simmer for 5 minutes. Warm tortillas. Fill with beef, lettuce, cheese, and salsa. Serve immediately.',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47'
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Creamy Indian curry with tender chicken in tomato sauce',
    cuisine: 'Indian',
    difficulty: 'Hard',
    prepTimeMinutes: 30,
    cookTimeMinutes: 40,
    servings: 6,
    isVegetarian: false,
    ingredients: [
      { name: 'Chicken thighs', amount: '2 lbs, cubed' },
      { name: 'Yogurt', amount: '1 cup' },
      { name: 'Garam masala', amount: '2 tbsp' },
      { name: 'Tomato sauce', amount: '2 cups' },
      { name: 'Heavy cream', amount: '1 cup' },
      { name: 'Ginger-garlic paste', amount: '2 tbsp' }
    ],
    instructions: 'Marinate chicken in yogurt and spices for 2 hours. Grill chicken until charred. Simmer tomato sauce with cream and spices. Add chicken and cook for 20 minutes. Serve with naan or rice.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641'
  },
  {
    title: 'French Onion Soup',
    description: 'Classic French soup with caramelized onions and melted cheese',
    cuisine: 'French',
    difficulty: 'Medium',
    prepTimeMinutes: 15,
    cookTimeMinutes: 60,
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Yellow onions', amount: '4 large, sliced' },
      { name: 'Beef broth', amount: '6 cups' },
      { name: 'Gruyere cheese', amount: '2 cups, grated' },
      { name: 'Baguette', amount: '1, sliced' },
      { name: 'Butter', amount: '4 tbsp' },
      { name: 'Thyme', amount: '2 sprigs' }
    ],
    instructions: 'Caramelize onions in butter for 45 minutes. Add broth and thyme, simmer for 30 minutes. Ladle into bowls, top with bread and cheese. Broil until cheese is bubbly and golden.',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd'
  },
  {
    title: 'Classic Cheeseburger',
    description: 'All-American burger with melted cheese and fresh toppings',
    cuisine: 'American',
    difficulty: 'Easy',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Ground beef', amount: '1.5 lbs' },
      { name: 'Burger buns', amount: '4' },
      { name: 'Cheddar cheese', amount: '4 slices' },
      { name: 'Lettuce', amount: '4 leaves' },
      { name: 'Tomato', amount: '1, sliced' },
      { name: 'Pickles', amount: '8 slices' }
    ],
    instructions: 'Form beef into 4 patties, season with salt and pepper. Grill for 4 minutes per side. Add cheese in last minute. Toast buns. Assemble burgers with lettuce, tomato, pickles, and condiments.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
  },
  {
    title: 'Sushi Rolls',
    description: 'Fresh Japanese sushi with cucumber, avocado, and crab',
    cuisine: 'Japanese',
    difficulty: 'Hard',
    prepTimeMinutes: 45,
    cookTimeMinutes: 0,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Sushi rice', amount: '2 cups, cooked' },
      { name: 'Nori sheets', amount: '8' },
      { name: 'Cucumber', amount: '1, julienned' },
      { name: 'Avocado', amount: '2, sliced' },
      { name: 'Imitation crab', amount: '8 oz' },
      { name: 'Rice vinegar', amount: '3 tbsp' }
    ],
    instructions: 'Season rice with vinegar. Place nori on bamboo mat, spread rice evenly. Add cucumber, avocado, and crab. Roll tightly using mat. Slice into 8 pieces. Serve with soy sauce and wasabi.',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351'
  },
  {
    title: 'Vegetable Curry',
    description: 'Hearty Indian vegetable curry with coconut milk',
    cuisine: 'Indian',
    difficulty: 'Easy',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 5,
    isVegetarian: true,
    ingredients: [
      { name: 'Mixed vegetables', amount: '4 cups, chopped' },
      { name: 'Coconut milk', amount: '1 can' },
      { name: 'Curry powder', amount: '3 tbsp' },
      { name: 'Onion', amount: '1, diced' },
      { name: 'Garlic', amount: '4 cloves, minced' },
      { name: 'Tomatoes', amount: '2, diced' }
    ],
    instructions: 'Sauté onion and garlic until soft. Add curry powder and cook for 1 minute. Add vegetables and tomatoes, cook for 10 minutes. Pour in coconut milk and simmer for 15 minutes. Serve over rice.',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe'
  },
  {
    title: 'Spaghetti Carbonara',
    description: 'Creamy Italian pasta with bacon and parmesan',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Spaghetti', amount: '1 lb' },
      { name: 'Bacon', amount: '8 oz, diced' },
      { name: 'Eggs', amount: '4 large' },
      { name: 'Parmesan cheese', amount: '1 cup, grated' },
      { name: 'Black pepper', amount: '2 tsp' },
      { name: 'Garlic', amount: '2 cloves, minced' }
    ],
    instructions: 'Cook spaghetti according to package. Fry bacon until crispy. Whisk eggs with parmesan. Toss hot pasta with bacon, remove from heat. Add egg mixture quickly, tossing to create creamy sauce. Season with pepper.',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3'
  },
  {
    title: 'Tom Yum Soup',
    description: 'Spicy and sour Thai soup with shrimp',
    cuisine: 'Thai',
    difficulty: 'Medium',
    prepTimeMinutes: 20,
    cookTimeMinutes: 20,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Shrimp', amount: '1 lb, peeled' },
      { name: 'Lemongrass', amount: '3 stalks' },
      { name: 'Galangal', amount: '4 slices' },
      { name: 'Lime juice', amount: '3 tbsp' },
      { name: 'Fish sauce', amount: '2 tbsp' },
      { name: 'Thai chilies', amount: '3-5' }
    ],
    instructions: 'Bring broth to boil with lemongrass and galangal. Add mushrooms and cook for 5 minutes. Add shrimp and cook until pink. Remove from heat, add lime juice and fish sauce. Garnish with cilantro and chilies.',
    imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853'
  },
  {
    title: 'Quesadillas',
    description: 'Cheesy Mexican tortillas with vegetables',
    cuisine: 'Mexican',
    difficulty: 'Easy',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 2,
    isVegetarian: true,
    ingredients: [
      { name: 'Flour tortillas', amount: '4 large' },
      { name: 'Monterey Jack cheese', amount: '2 cups, shredded' },
      { name: 'Bell peppers', amount: '1, diced' },
      { name: 'Onion', amount: '1/2, diced' },
      { name: 'Sour cream', amount: '1/2 cup' }
    ],
    instructions: 'Sauté peppers and onions until soft. Place cheese and vegetables on half of each tortilla, fold over. Cook in skillet for 2-3 minutes per side until golden and cheese melts. Cut into wedges and serve with sour cream.',
    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9'
  },
  {
    title: 'Ramen Bowl',
    description: 'Japanese noodle soup with pork and soft-boiled egg',
    cuisine: 'Japanese',
    difficulty: 'Hard',
    prepTimeMinutes: 30,
    cookTimeMinutes: 120,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Ramen noodles', amount: '4 portions' },
      { name: 'Pork belly', amount: '1 lb' },
      { name: 'Chicken broth', amount: '8 cups' },
      { name: 'Soft-boiled eggs', amount: '4' },
      { name: 'Green onions', amount: '4, sliced' },
      { name: 'Nori sheets', amount: '4' }
    ],
    instructions: 'Simmer pork belly in broth for 2 hours. Slice pork thinly. Cook noodles according to package. Ladle hot broth into bowls, add noodles, pork, halved eggs, green onions, and nori. Serve immediately.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
  },
  {
    title: 'Caprese Salad',
    description: 'Simple Italian salad with tomatoes, mozzarella, and basil',
    cuisine: 'Italian',
    difficulty: 'Easy',
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    servings: 4,
    isVegetarian: true,
    ingredients: [
      { name: 'Tomatoes', amount: '4 large, sliced' },
      { name: 'Fresh mozzarella', amount: '1 lb, sliced' },
      { name: 'Fresh basil', amount: '1 bunch' },
      { name: 'Balsamic glaze', amount: '3 tbsp' },
      { name: 'Olive oil', amount: '2 tbsp' }
    ],
    instructions: 'Arrange alternating slices of tomato and mozzarella on a platter. Tuck basil leaves between slices. Drizzle with olive oil and balsamic glaze. Season with salt and pepper. Serve immediately.',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5'
  },
  {
    title: 'Chicken Fried Rice',
    description: 'Classic Chinese fried rice with chicken and vegetables',
    cuisine: 'Chinese',
    difficulty: 'Easy',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 4,
    isVegetarian: false,
    ingredients: [
      { name: 'Cooked rice', amount: '4 cups, day-old' },
      { name: 'Chicken breast', amount: '1 lb, diced' },
      { name: 'Eggs', amount: '2, beaten' },
      { name: 'Frozen peas and carrots', amount: '1 cup' },
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Green onions', amount: '3, sliced' }
    ],
    instructions: 'Scramble eggs in wok, set aside. Stir-fry chicken until cooked. Add vegetables and rice, breaking up clumps. Add soy sauce and eggs, toss until heated through. Garnish with green onions.',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b'
  }
];

export const seedDatabase = () => {
  const now = Date.now();

  // Stagger createdAt so "sort by newest" has a real order to show
  seedRecipes.forEach((recipe, index) => {
    const createdAt = new Date(now - (seedRecipes.length - index) * 60_000);
    db.insert(recipes)
      .values({ ...recipe, createdAt, updatedAt: createdAt })
      .run();
  });

  console.log(`Seeded ${seedRecipes.length} recipes`);
};
