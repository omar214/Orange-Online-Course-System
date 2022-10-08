import dotenv from 'dotenv';
dotenv.config();

const {
	PORT,
	ENV,
	dbURI,
	SALT,
	PEPPER,
	JWT_PASSWORD,
	SERVER_URL,
	mailer_user,
	mailer_password,
} = process.env;

export default {
	PORT: PORT || 5000,
	ENV,
	dbURI,
	SALT,
	PEPPER,
	JWT_PASSWORD,
	SERVER_URL,
	mailer_user,
	mailer_password,
};
