import initKnex from "knex";
import config from "../knexfile.js";
import fs from "fs";
import ejs from "ejs";
import "dotenv/config";
import sendEmailNotification from "../sendEmailNotification.js";

const knex = initKnex(config);

const sendNotification = async (io) => {
	const users = await knex("users").select("id", "email");

	users.forEach(async (user) => {
		try {
			const notifications = await knex("notifications")
				.where({
					"notifications.user_id": user.id,
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

				let emailSubject;
				let inAppMessage;

				if (expiring.length > 0 && expired.length > 0) {
					emailSubject = "You have new expiring & expired products!";
					inAppMessage = { expired: expired, expiring: expiring };
				} else {
					emailSubject =
						expiring.length > 0
							? "You have new expiring products!"
							: "You have new expired products!";
					inAppMessage =
						expiring.length > 0 ? { expiring: expiring } : { expired: expired };
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
				sendEmailNotification(user.email, emailSubject, html, attachments);

				//Socket.io for in-app notification
				io.emit("notification", {
					message: inAppMessage,
				}); //use io.to(socket.id).emit() to send to specific user

				//update status fields in the table to read
				products.forEach(async (product) => {
					await knex("notifications")
						.where({ user_id: user.id, product_id: product.id })
						.update({ status: "read" });
				});
			}
		} catch (error) {
			console.error(
				`Unable to send notification about expiring & expired products: ${error}`
			);
		}
	});
};

sendNotification();

export default sendNotification;
