import { Recipe } from "./types";

export const recipes: Recipe[] = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    image: "/images/spaghetti.jpg",
    description: "A classic Italian pasta dish.",
    ingredients: ["Spaghetti", "Eggs", "Parmesan cheese", "Guanciale", "Black pepper"],
    instructions:
      "Cook spaghetti. In a separate bowl, mix eggs and cheese. Combine with pasta.",
  },
  {
    id: 2,
    name: "Caprese Salad",
    image: "/images/caprese-salad.jpg",
    description: "A fresh salad with tomatoes, mozzarella, and basil.",
    ingredients: ["Tomatoes", "Fresh mozzarella", "Basil leaves", "Olive oil", "Balsamic glaze"],
    instructions:
      "Slice tomatoes and mozzarella. Arrange with basil leaves. Drizzle with olive oil and balsamic glaze.",
  },
  {
    id: 3,
    name: "Chicken Tikka Masala",
    image: "/images/chicken-tikka-masala.jpg",
    description: "A creamy and spicy Indian dish.",
    ingredients: ["Chicken breast", "Yogurt", "Tomato sauce", "Heavy cream", "Garam masala"],
    instructions:
      "Marinate chicken in yogurt and spices. Grill chicken. Simmer in tomato cream sauce until cooked through.",
  },
  {
    id: 4,
    name: "Vegetable Stir Fry",
    image: "/images/vegetable-stir-fry.jpg",
    description: "A quick and healthy vegetable dish.",
    ingredients: ["Broccoli", "Bell peppers", "Carrots", "Soy sauce", "Garlic"],
    instructions:
      "Heat oil in a wok. Add garlic and vegetables. Stir fry until tender-crisp. Add soy sauce and serve.",
  },
  {
    id: 5,
    name: "Beef Tacos",
    image: "/images/beef-tacos.jpg",
    description: "Delicious tacos with seasoned beef.",
    ingredients: ["Ground beef", "Taco seasoning", "Tortillas", "Lettuce", "Shredded cheese"],
    instructions:
      "Cook ground beef with taco seasoning. Warm tortillas. Fill with beef, lettuce, and cheese.",
  },
  {
    id: 6,
    name: "Pancakes",
    image: "/images/pancakes.jpg",
    description: "Fluffy pancakes for breakfast.",
    ingredients: ["Flour", "Milk", "Eggs", "Baking powder", "Butter"],
    instructions:
      "Mix dry ingredients. Whisk in milk and eggs. Cook batter on a greased griddle until golden on both sides.",
  },
  {
    id: 7,
    name: "Margherita Pizza",
    image: "/images/margherita-pizza.jpg",
    description: "A simple yet delicious pizza with mozzarella and basil.",
    ingredients: ["Pizza dough", "Tomato sauce", "Fresh mozzarella", "Basil leaves", "Olive oil"],
    instructions:
      "Spread tomato sauce on dough. Top with mozzarella. Bake until crust is golden. Garnish with basil.",
  },
  {
    id: 8,
    name: "Greek Salad",
    image: "/images/greek-salad.jpg",
    description: "A refreshing salad with cucumbers, olives, and feta cheese.",
    ingredients: ["Cucumbers", "Tomatoes", "Red onion", "Kalamata olives", "Feta cheese"],
    instructions:
      "Chop cucumbers, tomatoes, and onion. Combine with olives and feta. Drizzle with olive oil and oregano.",
  },
];

export default recipes;
