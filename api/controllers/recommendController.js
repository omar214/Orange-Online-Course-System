import mongoose from 'mongoose';
import Student from '../../models/studentModel.js';
import Course from '../../models/courseModel.js';
import createError from '../../utils/createError.js';

const recommendJob = async (req, res, next) => {
	try {
		const { skills } = req.body;
		if (!skills || skills.length === 0)
			return next(createError(400, 'skills is required'));

		let students = await Student.aggregate([
			{
				$match: { skills: { $all: skills } },
			},
			{ $unwind: '$enrolled' },
			{
				$group: {
					_id: '$email',
					total_Points: { $sum: '$enrolled.quizPoints' },
					days_attended: { $sum: '$enrolled.attendedDays' },
				},
			},
			{
				$sort: { total_Points: -1, days_attended: -1 },
			},
		]).limit(10);
		res.status(200).json({
			count: students.length,
			students,
		});
	} catch (error) {
		next(error);
	}
};
const recommendCourse = async (req, res, next) => {
	try {
		const { skills } = req.body;
		if (!skills || skills.length === 0)
			return next(createError(400, 'skills is required'));

		let students = await Student.aggregate([
			{
				$match: { skills: { $all: skills } },
			},
			{ $unwind: '$enrolled' },
			{
				$group: {
					_id: '$email',
					total_Points: { $sum: '$enrolled.quizPoints' },
					days_attended: { $sum: '$enrolled.attendedDays' },
				},
			},
			{
				$sort: { total_Points: -1, days_attended: -1 },
			},
		]).limit(10);
		res.status(200).json({
			count: students.length,
			students,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	recommendJob,
	recommendCourse,
};
