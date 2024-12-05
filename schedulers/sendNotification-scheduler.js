import initKnex from "knex";
import config from "../knexfile.js";
import fs from "fs";
import ejs from "ejs";
import "dotenv/config";
import sendEmailNotification from "../sendEmailNotification.js";

const knex = initKnex(config);

const sendNotification = async (io) => {
	//verify user
	const userId = 1;

	try {
		const notifications = await knex("notifications")
			.where({
				"notifications.user_id": userId,
				status: "unread",
			})
			.join("products", "product_id", "products.id")
			.select(
				"products.id",
				"type",
				"products.name",
				"brand",
				"image",
				"expirationDate"
			);

		if (notifications.length !== 0) {
			const expiring = notifications.filter(
				(product) => product.type === "aboutToExpire"
			);
			const expired = notifications.filter(
				(product) => product.type === "expired"
			);

			const user = await knex("users").where({ id: userId }).first();

			let subject;
			let inAppMessage;
			let inAppMessageCount;

			if (expiring.length > 0 && expired.length > 0) {
				subject = "You have new expiring & expired products!";
				inAppMessage = { expired: expired, expiring: expiring };
				inAppMessageCount = expired.length + expiring.length;
			} else {
				subject =
					expiring.length > 0
						? "You have new expiring products!"
						: "You have new expired products!";
				inAppMessage =
					expiring.length > 0 ? { expiring: expiring } : { expired: expired };
				inAppMessageCount =
					expiring.length > 0 ? expiring.length : expired.length;
			}
			const products = [...expiring, ...expired];

			//Sending email
			const htmlTemplate = fs.readFileSync(
				"./emails/email-template.ejs",
				"utf-8"
			);
			const data = {
				expiring: expiring,
				expired: expired,
				appUrl: process.env.CORS_ORIGIN,
				port: process.env.PORT,
			};
			const html = ejs.render(htmlTemplate, data);
			let cidArray = products.map((product) => ({
				filename: product.image,
				path: `./public${product.image}`,
				cid: `${product.type}@${product.id}`,
			}));
			const attachments = [
				...cidArray,
				{
					filename: "support.png",
					path: "./public/images/support.png",
					cid: "unique@nodemailer.com",
				},
			];
			sendEmailNotification(user.email, subject, html, attachments);

			//Socket.io for in-app notification
			io.emit("notification", {
				message: inAppMessage,
				count: inAppMessageCount,
			}); //use io.to(socket.id).emit() to send to specific user

			//update status fields in the table to read
			products.forEach(async (product) => {
				await knex("notifications")
					.where({ user_id: userId, id: product.id })
					.update({ status: "read" });
			});
		}
	} catch (error) {
		console.error(
			`Unable to send notification about expiring & expired products: ${error}`
		);
	}
};

export default sendNotification;
