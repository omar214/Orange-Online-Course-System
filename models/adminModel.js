import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Admin Name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: [true, 'Email is already in use'],
		},
		password: {
			type: String,
			minlength: [6, 'Password must be at least 6 characters'],
			required: [true, 'Password is required'],
		},
	},
	{ timestamps: true },
);

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
