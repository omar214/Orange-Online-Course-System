import mongoose from 'mongoose';
import Student from '../../models/studentModel.js';
import Course from '../../models/courseModel.js';
import createError from '../../utils/createError.js';
import sendEmail from '../../utils/sendEmail.js';
import config from '../../config/index.js';

const getAllStudents = async (req, res, next) => {
	try {
		const students = await Student.find();
		res.status(200).json({
			success: true,
			count: students.length,
			students,
		});
	} catch (error) {
		next(error);
	}
};
const getStudent = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		const student = await Student.findOne({ _id: id });
		if (!student) return next(createError(404, 'student is not found '));

		res.status(200).json({ student });
	} catch (error) {
		next(error);
	}
};
const addStudent = async (req, res, next) => {
	try {
		let { email, name, skills } = req.body;
		if (!email || !name)
			return next(createError(400, 'Email, name  are required'));

		let student = await Student.findOne({ email });
		if (student) return next(createError(409, 'student already exists'));

		student = new Student({ ...req.body });
		const savedstudent = await student.save();

		res.status(200).json({
			message: 'student added successfully',
			success: true,
			student,
		});
	} catch (error) {
		next(error);
	}
};

const updateUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		let student = await Student.findById(id);
		if (!student) return next(createError(404, 'student is not found '));

		for (let key in req.body) {
			student[key] = req.body[key];
		}

		student = await student.save();
		res.status(200).json({
			message: 'user updates successfully',
			student,
		});
	} catch (error) {
		next(error);
	}
};
const deleteUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		let student = await Student.findById(id);
		if (!student) return next(createError(404, 'student not found'));

		await student.deleteOne({ _id: id });
		res.status(200).json('student deleted');
	} catch (error) {
		next(error);
	}
};
const addSkill = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		const { skills } = req.body;
		if (!skills) return next(createError(400, 'skills is required '));

		let student = await Student.findById(id);
		if (!student) return next(createError(404, 'student is not found '));

		if (skills instanceof Array) {
			for (const skill of skills) {
				if (!student.skills.includes(skill)) student.skills.push(skill);
			}
		} else {
			student.skills.push(skills);
		}

		student = await student.save();
		res.status(200).json({
			message: 'skills added successfully',
			student,
		});
	} catch (error) {
		next(error);
	}
};
const removeSkill = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		const { skills } = req.body;
		if (!skills) return next(createError(400, 'skills is required '));

		let student = await Student.findById(id);
		if (!student) return next(createError(404, 'student is not found '));

		if (skills instanceof Array) {
			for (const skill of skills) {
				student.skills = student.skills.filter((ele) => ele != skill);
			}
		} else {
			student.skills = student.skills.filter((ele) => ele != skills);
		}

		student = await student.save();
		res.status(200).json({
			message: 'skills removed successfully',
			student,
		});
	} catch (error) {
		next(error);
	}
};
const enroll = async (req, res, next) => {
	try {
		const studentId = req.params.id;
		if (!studentId || !mongoose.isValidObjectId(studentId))
			return next(createError(401, 'valid id is required'));

		const { courseId } = req.body;
		if (!courseId) return next(createError(400, 'courseId is required '));

		// get student
		let student = await Student.findById(studentId);
		if (!student) return next(createError(404, 'student is not found '));

		// get course
		let course = await Course.findById(courseId);
		if (!course) return next(createError(404, 'course is not found '));

		let missingSkills = [];
		for (const skill of course.preqSkills) {
			if (!student.skills.includes(skill)) {
				missingSkills.push(skill);
			}
		}
		if (missingSkills.length > 0)
			return next(
				createError(400, `missing skill ${missingSkills.join(' , ')}`),
			);

		// check if already enrolled
		const idx = student.enrolled.findIndex((ele) =>
			ele.course.equals(courseId),
		);
		console.log(idx);
		if (idx !== -1)
			return next(
				createError(
					400,
					`student is already enrolled in course ${course.name}`,
				),
			);

		student.enrolled.push({
			course: courseId,
			attendedDays: 0,
			quizPoints: 0,
			isFinished: false,
		});
		student = await student.save();

		res.status(200).json({
			message: 'enroll done successfully',
			student,
		});
	} catch (error) {
		next(error);
	}
};
const attend = async (req, res, next) => {
	try {
		// check valid student id
		const studentId = req.params.id;
		if (!studentId || !mongoose.isValidObjectId(studentId))
			return next(createError(401, 'valid id is required'));

		// check is courseId is found
		const { courseId } = req.body;
		if (!courseId) return next(createError(400, 'courseId is required '));

		// get student
		let student = await Student.findById(studentId);
		if (!student) return next(createError(404, 'student is not found '));

		// get course
		let course = await Course.findById(courseId);
		if (!course) return next(createError(404, 'course is not found '));

		// validate if student is not enrolled
		const idx = student.enrolled.findIndex((ele) =>
			ele.course.equals(courseId),
		);
		if (idx === -1)
			return next(
				createError(404, `student is not enrolled in course ${course.name}`),
			);

		student.enrolled[idx].attendedDays += 1;

		if (student.enrolled[idx].attendedDays >= course.durationInDays) {
			student.enrolled[idx].isFinished = true;
			student.enrolled[idx].attendedDays = course.durationInDays;
		}

		student = await student.save();
		res.status(200).json({
			message: 'attendance done',
			student,
		});
	} catch (error) {
		next(error);
	}
};
const quiz = async (req, res, next) => {
	try {
		const studentId = req.params.id;
		if (!studentId || !mongoose.isValidObjectId(studentId))
			return next(createError(401, 'valid id is required'));

		// check if parameter wasn't sent
		const { courseId, skills } = req.body;
		if (!courseId || !skills || skills.length === 0)
			return next(createError(400, 'courseId & skills is required '));

		// get student
		let student = await Student.findById(studentId);
		if (!student) return next(createError(404, 'student is not found '));

		// get course
		let course = await Course.findById(courseId);
		if (!course) return next(createError(404, 'course is not found '));

		// check if not enrolled
		const idx = student.enrolled.findIndex((ele) =>
			ele.course.equals(courseId),
		);
		if (idx === -1)
			return next(
				createError(404, `student is not enrolled in course ${course.name}`),
			);

		for (const skill of skills) {
			if (!student.skills.includes(skill)) {
				student.skills.push(skill);
				student.enrolled[idx].quizPoints += 10;
			}
		}
		// student.enrolled[idx].quizPoints += 10 * skills.length;
		student = await student.save();
		res.status(200).json({
			message: 'quiz passed successfully',
			student,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	getAllStudents,
	getStudent,
	addStudent,
	updateUser,
	deleteUser,
	addSkill,
	removeSkill,
	enroll,
	attend,
	quiz,
};
