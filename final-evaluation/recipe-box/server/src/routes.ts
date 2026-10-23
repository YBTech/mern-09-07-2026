import { Router } from 'express';
import recipeRoutes from './modules/recipe/recipe.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';

const router = Router();

router.use('/recipes', recipeRoutes);
router.use('/stats', statsRoutes);

export default router;
