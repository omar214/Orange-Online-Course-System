import express from 'express';
const router = express.Router();

import authRoute from './routes/authRoute.js';
import courseRoute from './routes/courseRoute.js';
import studentRoute from './routes/studentRoute.js';
import seedRoute from './routes/seedRoute.js';
import supplierRoute from './routes/supplierRoute.js';
import recommendRoute from './routes/recommendRoute.js';

router.use('/auth', authRoute);
router.use('/courses', courseRoute);
router.use('/students', studentRoute);
router.use('/recommend', recommendRoute);
router.use('/suppliers', supplierRoute);
router.use('/seed', seedRoute);
router.use('/', (req, res) => {
	res.json('this is api');
});

export default router;
