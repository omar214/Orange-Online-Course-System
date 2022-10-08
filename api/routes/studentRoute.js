import express from 'express';
const router = express.Router();
import studentController from '../controllers/studentController.js';
import { verifyAuth } from '../../middlewares/authMiddleware.js';

router.use(verifyAuth);

// CRUD Routes
router.post('/', studentController.addStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudent);
router.delete('/:id', studentController.deleteUser);
router.put('/:id', studentController.updateUser);

// Logic Routes
router.post('/:id/skills', studentController.addSkill);
router.patch('/:id/skills', studentController.removeSkill);
router.post('/:id/enroll', studentController.enroll);
router.post('/:id/quiz', studentController.quiz);
router.post('/:id/attend', studentController.attend);

export default router;
