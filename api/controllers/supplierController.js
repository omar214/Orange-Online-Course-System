import mongoose from 'mongoose';
import Supplier from '../../models/supplierModel.js';
import createError from '../../utils/createError.js';
import config from '../../config/index.js';

const getAllSuppliers = async (req, res, next) => {
	try {
		const suppliers = await Supplier.find();
		res.status(200).json({
			success: true,
			count: suppliers.length,
			suppliers,
		});
	} catch (error) {
		next(error);
	}
};
const getSupplier = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		const supplier = await Supplier.findById(id);
		if (!supplier) return next(createError(404, 'supplier is not found '));

		res.status(200).json({ supplier });
	} catch (error) {
		next(error);
	}
};
const addSupplier = async (req, res, next) => {
	try {
		let { name, totalMoney } = req.body;
		if (!name || !totalMoney)
			return next(createError(400, 'totalMoney, name  are required'));

		let supplier = await Supplier.findOne({ name });
		if (supplier)
			return next(createError(409, `supplier ${name} already exists`));

		supplier = new Supplier({ name, totalMoney });
		const savedsupplier = await supplier.save();

		res.status(200).json({
			message: 'supplier added successfully',
			success: true,
			supplier,
		});
	} catch (error) {
		next(error);
	}
};

const updateSupplier = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		let supplier = await Supplier.findById(id);
		if (!supplier) return next(createError(404, 'supplier is not found '));

		for (let key in req.body) {
			supplier[key] = req.body[key];
		}

		supplier = await supplier.save();
		res.status(200).json({
			message: 'user updated successfully',
			supplier,
		});
	} catch (error) {
		next(error);
	}
};
const deleteSupplier = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		let supplier = await Supplier.findById(id);
		if (!supplier) return next(createError(404, 'supplier not found'));

		await Supplier.deleteOne({ _id: id });
		res.status(200).json('supplier deleted');
	} catch (error) {
		next(error);
	}
};
const pay = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id || !mongoose.isValidObjectId(id))
			return next(createError(401, 'valid id is required'));

		let supplier = await Supplier.findById(id);
		if (!supplier) return next(createError(404, 'supplier is not found '));

		const { amount } = req.body;
		if (amount <= 0) return next(createError(400, 'valid amount is required'));

		supplier.paid += amount;
		supplier = await supplier.save();
		res.status(200).json({
			message: `supplier paid ${amount} successfully total paid = ${supplier.paid}`,
			supplier,
		});
	} catch (error) {
		next(error);
	}
};

export default {
	getAllSuppliers,
	getSupplier,
	addSupplier,
	updateSupplier,
	deleteSupplier,
	pay,
};
