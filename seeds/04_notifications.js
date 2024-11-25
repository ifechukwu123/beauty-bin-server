/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//expiring when its less than a month from now
const notificationData = [
	{ id: 1, product_id: 3, type: "expired", status: "dismissed", user_id: 2 },
	{ id: 2, product_id: 4, type: "expired", status: "read", user_id: 1 },
	{ id: 3, product_id: 6, type: "aboutToExpire", status: "unread", user_id: 1 },
	{ id: 4, product_id: 7, type: "expired", status: "dismissed", user_id: 1 },
	{ id: 5, product_id: 9, type: "expired", status: "unread", user_id: 2 },
	{
		id: 6,
		product_id: 10,
		type: "aboutToExpire",
		status: "dismissed",
		user_id: 2,
	},
	{ id: 7, product_id: 11, type: "expired", status: "read", user_id: 1 },
	{
		id: 8,
		product_id: 12,
		type: "aboutToExpire",
		status: "unread",
		user_id: 1,
	},
	{ id: 9, product_id: 13, type: "aboutToExpire", status: "read", user_id: 2 },
	{ id: 10, product_id: 15, type: "expired", status: "unread", user_id: 1 },
];
export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("notifications").del();
	await knex("notifications").insert(notificationData);
}
