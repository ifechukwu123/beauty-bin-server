import initKnex from "knex";
import config from "../knexfile.js";

const knex = initKnex(config);

const findExpiringProducts = async (user) => {
	const today = new Date();
	const monthFromToday = new Date(today);
	monthFromToday.setMonth(today.getMonth() + 1);

	const todayFormatted = today.toISOString().split("T")[0];
	const monthFromTodayFormatted = monthFromToday.toISOString().split("T")[0];

	try {
		const expiringProducts = await knex("products")
			.where({ user_id: user.id })
			.andWhere("expirationDate", ">", todayFormatted)
			.andWhere("expirationDate", "<=", monthFromTodayFormatted);

		return expiringProducts;
	} catch (error) {
		console.error(`Unable to retrieve products that are expiring: ${error}`);
	}
};

const findExpiredProducts = async (user) => {
	const today = new Date().toISOString().split("T")[0];

	try {
		const expiredProducts = await knex("products")
			.where({ user_id: user.id })
			.andWhere("expirationDate", "<=", today);

		return expiredProducts;
	} catch (error) {
		console.error(`Unable to retrieve products that have expired: ${error}`);
	}
};

const updateNotificationsTable = async () => {
	const users = await knex("users").select("id", "email");

	users.forEach(async (user) => {
		try {
			const expiring = await findExpiringProducts(user);
			const expired = await findExpiredProducts(user);

			expiring.forEach(async (product) => {
				const notification = await knex("notifications").where({
					user_id: user.id,
					product_id: product.id,
				});

				if (notification.length === 0) {
					await knex("notifications").insert({
						user_id: product.user_id,
						product_id: product.id,
						type: "aboutToExpire",
						status: "unread",
					});
				}
			});

			expired.forEach(async (product) => {
				const notification = await knex("notifications").where({
					user_id: userId,
					product_id: product.id,
				});

				if (notification.length === 0) {
					await knex("notifications").insert({
						user_id: product.user_id,
						product_id: product.id,
						type: "expired",
						status: "unread",
					});
				} else {
					const notificationProduct = notification[0];

					if (notificationProduct.type === "aboutToExpire") {
						await knex("notifications")
							.where({ user_id: user.id, product_id: product.id })
							.update({ type: "expired", status: "unread" });
					}
				}
			});

			console.log("Update done!");
		} catch (error) {
			console.error(`Unable to update notifications table: ${error}`);
		}
	});
};

export default updateNotificationsTable;
