/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const userData = [
	{ id: 1, username: "Ife", email: "ifeonuorah@gmail.com", password: "1234" },
	{
		id: 2,
		username: "Bunmi",
		email: "bunmi@gmail.com",
		password: "helloworld",
	},
];
export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("users").del();
	await knex("users").insert(userData);
}
