import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'supplier Name is required'],
			unique: [true, 'supplier name is already in use'],
		},
		totalMoney: {
			type: Number,
			required: [true, 'total money is required'],
		},
		paid: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
