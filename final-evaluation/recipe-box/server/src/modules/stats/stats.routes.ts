import { Router } from 'express';
import * as statsController from './stats.controller.js';

const router = Router();

router.get('/', statsController.getStats);
router.get('/featured', statsController.getFeatured);

export default router;
