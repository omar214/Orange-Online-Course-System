import mongoose from 'mongoose';

var subCourse = mongoose.Schema(
	{
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
		},
		attendedDays: {
			type: Number,
			default: 0,
		},
		quizPoints: {
			type: Number,
			default: 0,
		},
		isFinished: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false },
);

const studentSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		email: {
			type: String,
			required: [true, 'description is required'],
			unique: [true, 'Email is already in use'],
		},
		skills: {
			type: [String],
			default: [],
		},
		enrolled: {
			type: [subCourse],
			default: [],
		},
	},
	{ timestamps: true },
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
