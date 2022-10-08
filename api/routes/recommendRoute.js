import express from 'express';
const router = express.Router();
import recommendController from '../controllers/recommendController.js';
import { verifyAuth } from '../../middlewares/authMiddleware.js';

router.use(verifyAuth);

// CRUD Routes
router.post('/job', recommendController.recommendJob);
router.get('/course', recommendController.recommendCourse);

export default router;
