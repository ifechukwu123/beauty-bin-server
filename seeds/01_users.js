/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import bcrypt from "bcryptjs";

const userData = [
	{
		id: 1,
		email: "ifeonuorah@gmail.com",
		password: bcrypt.hashSync("1234", 10),
	},
	{
		id: 2,
		email: "bunmi@gmail.com",
		password: bcrypt.hashSync("helloworld", 10),
	},
];

export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("users").del();
	await knex("users").insert(userData);
}
