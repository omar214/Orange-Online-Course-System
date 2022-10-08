import nodemailer from 'nodemailer';
import config from '../config/index.js';

const sendEmail = async (toEmail, isAccepted, course) => {
	let testAccount = await nodemailer.createTestAccount();
	return new Promise((resolve, reject) => {
		const accptedMsg = `we are happy to tell you that your accepted at our course ${course}`;
		const rejectedMsg = `we are sad to tell you that your rejected at our course ${course}`;

		// let transporter = nodemailer.createTransport({
		// 	service: 'gmail',
		// 	auth: {
		// 		user: config.mailer_user,
		// 		pass: config.mailer_password,
		// 	},
		// });
		let transporter = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: testAccount.user, // generated ethereal user
				pass: testAccount.pass, // generated ethereal password
			},
		});
		let mailOptions = {
			from: config.mailer_user,
			to: toEmail,
			subject: isAccepted ? 'ODC course accepted' : 'ODC course Rejected',
			text: isAccepted ? accptedMsg : rejectedMsg,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject('error', error);
			} else {
				console.log('Email sent: ' + info.response);
				reject('Email sent: ' + info.response);
			}
		});
	});
};

export default sendEmail;
