import express from 'express';
import upload from '../../utils/upload.js';
import seedController from '../controllers/seedController.js';

const seedRouter = express.Router();

seedRouter.get('/', seedController.seed);

// add users from csv file
seedRouter.post(
	'/users/csv',
	upload.single('file'),
	seedController.seedStudentsFromCsv,
);

// add admins from csv file
seedRouter.post(
	'/admins/csv',
	upload.single('file'),
	seedController.seedAdminsFromCsv,
);

// add courses from csv file
seedRouter.post(
	'/courses/csv',
	upload.single('file'),
	seedController.seedCoursesFromCsv,
);

// add suppliers from csv file
seedRouter.post(
	'/suppliers/csv',
	upload.single('file'),
	seedController.seedSuppliersFromCsv,
);

export default seedRouter;
