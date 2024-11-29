import initKnex from "knex";
import config from "../knexfile.js";
//import Email from "../emails/Email.jsx";
import sendEmailNotification from "../sendEmailNotification.js";

const knex = initKnex(config);

const sendNotification = async (io) => {
	//verify user
	const userId = 1;

	try {
		const notifications = await knex("notifications").where({
			user_id: userId,
			status: "unread",
		});

		if (notifications.length !== 0) {
			const expiring = notifications.filter(
				(product) => product.type === "aboutToExpire"
			);
			const expired = notifications.filter(
				(product) => product.type === "expired"
			);

			const user = await knex("users").where({ id: userId }).first();

			const text1 = expiring.map((product) => product.name).join(" ");
			const text2 = expired.map((product) => product.name).join(" ");
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
			const html = `<div><div><h1>Expired Products</h1><p>${text1}</p></div><div><h1>Expiring Products</h1><p>${text2}</p></div></div>`;

			sendEmailNotification(user.email, subject, html);

			//Socket.io for in-app notification
			io.emit("notification", {
				message: inAppMessage,
				count: inAppMessageCount,
			}); //use io.to(socket.id).emit() to send to user

			//update status fields in the table to read
			const products = [...expiring, ...expired];
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
