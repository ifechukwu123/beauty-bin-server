/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//expiring when its less than a month from now
const notificationData = [
	{ id: 1, product_id: 5, type: "expired", status: "dismissed", user_id: 2 },
	{ id: 2, product_id: 7, type: "expired", status: "read", user_id: 1 },
	{
		id: 3,
		product_id: 11,
		type: "aboutToExpire",
		status: "unread",
		user_id: 1,
	},
	{ id: 4, product_id: 13, type: "expired", status: "dismissed", user_id: 1 },
	{ id: 5, product_id: 17, type: "expired", status: "unread", user_id: 2 },
	{
		id: 6,
		product_id: 19,
		type: "aboutToExpire",
		status: "dismissed",
		user_id: 2,
	},
	{ id: 7, product_id: 21, type: "expired", status: "read", user_id: 1 },
	{
		id: 8,
		product_id: 23,
		type: "aboutToExpire",
		status: "unread",
		user_id: 1,
	},
	{ id: 9, product_id: 25, type: "aboutToExpire", status: "read", user_id: 2 },
	{ id: 10, product_id: 29, type: "expired", status: "unread", user_id: 1 },
];
export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("notifications").del();
	await knex("notifications").insert(notificationData);
}
