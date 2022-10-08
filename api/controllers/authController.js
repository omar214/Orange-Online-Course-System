import Admin from '../../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from '../../utils/createError.js';
import config from '../../config/index.js';

const genToken = (id) => {
	const token = jwt.sign({ id }, config.JWT_PASSWORD, {
		expiresIn: '124h',
	});
	return token;
};

const login = async (req, res, next) => {
	try {
		let { email, password } = req.body;
		if (!email || !password)
			return next(createError(400, 'Email , and password are required'));

		// check if email is found
		const user = await Admin.findOne({ email });
		if (!user) return next(createError(404, 'User not found'));

		// check if valid password
		const isMatch = bcrypt.compareSync(password, user.password);
		if (!isMatch) return next(createError(401, 'Invalid password'));

		const token = genToken(user._id);

		res.status(200).json({
			message: 'Login successful',
			name: user.name,
			email: user.email,
			token,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export { login };
