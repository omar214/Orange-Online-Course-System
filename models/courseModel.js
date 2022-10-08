import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			// unique: [true, 'Course name must be unique'],
		},
		description: {
			type: String,
			required: [true, 'description is required'],
		},
		supplier: {
			type: String,
			required: [true, 'supplier is required'],
		},
		preqSkills: {
			type: [String],
			default: [],
		},
		gainedSkills: {
			type: [String],
			default: [],
		},
		isFinished: {
			type: Boolean,
			default: false,
		},
		attendedDays: {
			type: Number,
			default: 0,
		},
		durationInDays: {
			type: Number,
			required: true,
			validate: {
				validator: (value) => value > 0,
				message: 'price must be > 0',
			},
		},
	},
	{ timestamps: true },
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
