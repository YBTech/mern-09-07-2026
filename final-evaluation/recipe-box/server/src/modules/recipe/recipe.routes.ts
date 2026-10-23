import { Router } from 'express';
import * as recipeController from './recipe.controller.js';

const router = Router();

router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/', recipeController.createRecipe);
router.put('/:id', recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

export default router;
