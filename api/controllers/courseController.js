import mongoose from 'mongoose';
import Course from '../../models/courseModel.js';
import Supplier from '../../models/supplierModel.js';
import createError from '../../utils/createError.js';
import csv from 'csvtojson';
import config from '../../config/index.js';
import Student from '../../models/studentModel.js';

const addCourse = async (req, res, next) => {
	try {
		const { supplierName } = req.body;
		if (!supplierName)
			return next(createError(400, 'supplierName is required '));

		const supplier = await Supplier.findOne({ name: supplierName });
		if (!supplier)
			return next(createError(404, `no supplier with name ${supplierName} `));

		let course = new Course({ ...req.body, supplier: supplierName });
		const savedcourse = await course.save();

		res.status(200).json({
			message: 'course added',
			course: savedcourse,
		});
	} catch (error) {
		next(error);
		// console.log(error);
	}
};

const getAllCourses = async (req, res, next) => {
	try {
		const courses = await Course.find();
		res.status(200).json({
			success: true,
			count: courses.length,
			courses,
		});
	} catch (error) {
		next(error);
	}
};

const getCourseById = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		const course = await Course.findById(id);

		if (!course) return next(createError(404, 'course is not found '));

		res.status(200).json({ course });
	} catch (error) {
		next(error);
	}
};

const editCourse = async (req, res, next) => {
	try {
		// check valid id
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		// check if course is found
		let course = await Course.findOne({ _id: id });
		if (!course) return next(createError(404, 'course is not found '));

		// edit values
		for (let key in req.body) {
			course[key] = req.body[key];
		}
		course = await course.save();
		res.status(200).json({ course });
	} catch (error) {
		next(error);
	}
};

const deleteCourse = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		let course = await Course.findById(id);
		if (!course) return next(createError(404, 'course not found'));

		await Course.deleteOne({ _id: id });
		res.status(200).json('course deleted');
	} catch (error) {
		next(error);
	}
};
const enrollFromCSv = async (req, res, next) => {
	try {
		// format emails from csv
		const array = await csv().fromFile(req.file.path);
		const emails = array.map((el) => el.email);

		// check valid id
		const courseId = req.params.id;
		if (!courseId || !mongoose.isValidObjectId(courseId))
			return next(createError(401, 'valid id is required'));

		// check if course is not found
		let course = await Course.findById(courseId);
		if (!course) return next(createError(404, 'course not found'));

		// enroll logic
		let notFoundEmails = [];
		let alreadyEnrolled = [];
		let passedStudents = [];
		for (const email of emails) {
			let student = await Student.findOne({ email });
			if (!student) {
				notFoundEmails.push(email);
				continue;
			}

			// check if already enrolled
			const idx = student.enrolled.findIndex((ele) =>
				ele.course.equals(courseId),
			);
			if (idx !== -1) {
				alreadyEnrolled.push(email);
				continue;
			}

			// enroll
			student.enrolled.push({
				course: courseId,
				attendedDays: 0,
				quizPoints: 0,
				isFinished: false,
			});

			student = await student.save();
			passedStudents.push(student);
		}
		let message = `${passedStudents.length} enrolled successfully , `;
		message = message.concat(`${notFoundEmails.length} email was not found , `);
		message = message.concat(`  ${alreadyEnrolled.length} already enrolled`);

		// // Response
		res.json({
			message,
			enrolled: passedStudents,
		});
	} catch (error) {
		next(error);
		// console.log(error);
	}
};
const attendFromCsv = async (req, res, next) => {
	try {
		// format emails from csv
		const array = await csv().fromFile(req.file.path);
		const emails = array.map((el) => el.email);

		// check valid id
		const courseId = req.params.id;
		if (!courseId || !mongoose.isValidObjectId(courseId))
			return next(createError(401, 'valid id is required'));

		// check if course is not found
		let course = await Course.findById(courseId);
		if (!course) return next(createError(404, 'course not found'));

		// enroll logic
		let notFoundEmails = [];
		let notEnrolled = [];
		let passedStudents = [];
		for (const email of emails) {
			let student = await Student.findOne({ email });
			if (!student) {
				notFoundEmails.push(email);
				continue;
			}

			// check if not enrolled
			const idx = student.enrolled.findIndex((ele) =>
				ele.course.equals(courseId),
			);
			if (idx === -1) {
				notEnrolled.push(email);
				continue;
			}

			// attend
			student.enrolled[idx].attendedDays += 1;

			if (student.enrolled[idx].attendedDays >= course.durationInDays) {
				student.enrolled[idx].isFinished = true;
				student.enrolled[idx].attendedDays = course.durationInDays;
			}

			student = await student.save();
			passedStudents.push(student);
		}
		let message = `${passedStudents.length} attented successfully , `;
		if (notFoundEmails.length > 0)
			message = message.concat(
				`${notFoundEmails.length} email was not found , `,
			);
		if (notEnrolled.length > 0)
			message = message.concat(`${notEnrolled.length} is not enrolled`);

		course.attendedDays += 1;
		if (course.attendedDays >= course.durationInDays) {
			course.isFinished = true;
			course.attendedDays = course.durationInDays;
		}
		await course.save();

		// // Response
		res.json({
			message,
			attended: passedStudents,
		});
	} catch (error) {
		next(error);
		// console.log(error);
	}
};
const quizFromCsv = async (req, res, next) => {
	try {
		// format emails from csv
		const array = await csv().fromFile(req.file.path);
		const emails = array.map((el) => el.email);

		// check valid id
		const courseId = req.params.id;
		if (!courseId || !mongoose.isValidObjectId(courseId))
			return next(createError(401, 'valid id is required'));

		// check if course is not found
		let course = await Course.findById(courseId);
		if (!course) return next(createError(404, 'course not found'));

		// validate skills was sent
		let { skills } = req.body;
		if (!skills || skills.length === 0)
			return next(createError(400, 'skills is required'));

		skills = skills.split(',').map((el) => el.trim());
		// enroll logic
		let notFoundEmails = [];
		let notEnrolled = [];
		let passedStudents = [];
		for (const email of emails) {
			let student = await Student.findOne({ email });
			if (!student) {
				notFoundEmails.push(email);
				continue;
			}

			// check if not enrolled
			const idx = student.enrolled.findIndex((ele) =>
				ele.course.equals(courseId),
			);
			if (idx === -1) {
				notEnrolled.push(email);
				continue;
			}

			// quiz
			for (const skill of skills) {
				if (!student.skills.includes(skill)) {
					student.skills.push(skill);
				}
				student.enrolled[idx].quizPoints += 10;
			}

			student = await student.save();
			passedStudents.push(student);
		}
		let message = `${passedStudents.length} passed quiz successfully , `;
		message = message.concat(`${notFoundEmails.length} email was not found , `);
		message = message.concat(`  ${notEnrolled.length} is not enrolled`);

		// // Response
		res.json({
			message,
			passedQuiz: passedStudents,
		});
	} catch (error) {
		next(error);
		// console.log(error);
	}
};

export default {
	getAllCourses,
	getCourseById,
	addCourse,
	editCourse,
	deleteCourse,
	enrollFromCSv,
	attendFromCsv,
	quizFromCsv,
};
