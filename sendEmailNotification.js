import nodemailer from "nodemailer";
import "dotenv/config";

//Create nodemailer transporter
const transporter = nodemailer.createTransport({
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.SENDER_EMAIL,
		pass: process.env.EMAIL_PASS,
	},
});

const sendEmailNotification = async (to, subject, html, attachments) => {
	try {
		await transporter.sendMail({
			from: { name: "Beauty Bin ", address: process.env.SENDER_EMAIL },
			to: to,
			subject: subject,
			html: html,
			attachments: [
				{
					filename: "support.png",
					path: "./public/images/support.png",
					cid: "unique@nodemailer.com",
				},
			],
		});
		console.log(`Email to ${to} has been sent successfully`);
	} catch (error) {
		console.error(`Unable to send email to ${to}: ${error}`);
	}
};

export default sendEmailNotification;
