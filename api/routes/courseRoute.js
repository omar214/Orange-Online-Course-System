import express from 'express';
const router = express.Router();
import courseController from '../controllers/courseController.js';
import { verifyAdmin, verifyAuth } from '../../middlewares/authMiddleware.js';
import upload from '../../utils/upload.js';

router.use(verifyAuth);

// CRUD Routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.addCourse);
router.put('/:id', courseController.editCourse);
router.delete('/:id', courseController.deleteCourse);

// Logic & CSV Routes
router.post(
	'/:id/enroll',
	upload.single('file'),
	courseController.enrollFromCSv,
);

router.post(
	'/:id/attend',
	upload.single('file'),
	courseController.attendFromCsv,
);

router.post('/:id/quiz', upload.single('file'), courseController.quizFromCsv);

export default router;
