import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Course from '../../models/courseModel.js';
import Student from '../../models/studentModel.js';
import Supplier from '../../models/supplierModel.js';
import Admin from '../../models/adminModel.js';
import data from '../../data/index.js';
import createError from '../../utils/createError.js';
import config from '../../config/index.js';
import csv from 'csvtojson';

const seed = async (req, res, next) => {
	try {
		// delete all
		await Admin.deleteMany({});
		await Student.deleteMany({});
		await Course.deleteMany({});
		await Supplier.deleteMany({});

		// create admins
		const createdAdmins = await Admin.insertMany(data.admins);
		// create students
		const createdStudents = await Student.insertMany(data.students);
		// create supplier
		const createdSuppliers = await Supplier.insertMany(data.suppliers);
		// create courses
		const createdCourses = await Course.insertMany(data.courses);
		res.json({
			message: 'seed added to DB',
			createdAdmins,
			createdStudents,
			createdCourses,
			createdSuppliers,
		});
	} catch (error) {
		next(error);
	}
};

const seedStudentsFromCsv = async (req, res, next) => {
	try {
		const array = await csv().fromFile(req.file.path);

		// format users from csv
		const users = array.map((el) => ({
			name: el.name,
			email: el.email,
			skills: el.skills.split(',').map((skill) => skill.trim()),
		}));

		const { clearOld } = req.body;
		if (clearOld) {
			await Student.deleteMany({});
		}

		// add to DB
		const createdStudents = await Student.insertMany(users);

		// Response
		res.json({
			users: createdStudents,
		});
	} catch (error) {
		next(error);
	}
};
const seedAdminsFromCsv = async (req, res, next) => {
	try {
		const array = await csv().fromFile(req.file.path);

		// format admins from csv
		const admins = array.map((el) => ({
			name: el.name,
			email: el.email,
			password: bcrypt.hashSync(el.password),
		}));

		const { clearOld } = req.body;
		if (clearOld) {
			await Admin.deleteMany({});
		}

		// add to DB
		const createdAdmins = await Admin.insertMany(admins);

		// Response
		res.json({
			admins: createdAdmins,
		});
	} catch (error) {
		next(error);
		// console.log(error);
	}
};

const seedCoursesFromCsv = async (req, res, next) => {
	try {
		const array = await csv().fromFile(req.file.path);
		console.log(array);

		// format courses from csv
		const courses = array.map((el) => ({
			name: el.name,
			description: el.description,
			durationInDays: el.durationInDays,
			supplier: el.supplierName,
			preqSkills: el.preqSkills.split(',').map((skill) => skill.trim()),
			gainedSkills: el.gainedSkills.split(',').map((skill) => skill.trim()),
		}));

		// clear old data
		const { clearOld } = req.body;
		if (clearOld) {
			await Course.deleteMany({});
		}

		// add to DB
		const createdCourses = await Course.insertMany(courses);

		// Response
		res.json({
			courses: createdCourses,
		});
	} catch (error) {
		next(error);
		// console.log(error);
	}
};

const seedSuppliersFromCsv = async (req, res, next) => {
	try {
		const array = await csv().fromFile(req.file.path);
		console.log(array);

		// format suppliers from csv
		const suppliers = array.map((el) => ({
			name: el.name,
			totalMoney: el.totalMoney,
		}));

		// clear old data
		const { clearOld } = req.body;
		if (clearOld) {
			console.log('clear');
			await Supplier.deleteMany({});
		}

		// add to DB
		const createdSuppliers = await Supplier.insertMany(suppliers);

		// Response
		res.json({
			suppliers: createdSuppliers,
		});
	} catch (error) {
		next(error);
		// console.log(error);
	}
};

export default {
	seed,
	seedCoursesFromCsv,
	seedStudentsFromCsv,
	seedAdminsFromCsv,
	seedSuppliersFromCsv,
};
