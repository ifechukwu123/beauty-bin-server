/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const categoryData = [
	{ id: 1, name: "face" },
	{ id: 2, name: "eye" },
	{ id: 3, name: "lips" },
	{ id: 4, name: "other" },
];
export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("categories").del();
	await knex("categories").insert(categoryData);
}
