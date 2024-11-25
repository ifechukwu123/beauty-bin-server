/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const wishlistData = [
	{
		id: 1,
		name: "Flush Balm Cream Blush",
		brand: "MERIT",
		user_id: 1,
	},
	{
		id: 2,
		name: "OneLiner Lip Liner + Eyeliner + Cheek Pencil",
		brand: "Tower 28 Beauty",
		user_id: 1,
	},
	{
		id: 3,
		name: "Mini Orgasm Blush and Lip Duo",
		brand: "NARS",
		user_id: 1,
	},
	{
		id: 4,
		name: "Reveal The Real 12HR Soft Radiant Skin Tint",
		brand: "NARS",
		user_id: 2,
	},
	{
		id: 5,
		name: "Soulmatte Filling Gel Lip Liner",
		brand: "Morphe",
		user_id: 2,
	},
	{
		id: 6,
		name: "Hot Cocoa Lip Sleeping Mask",
		brand: "SEPHORA",
		user_id: 1,
	},
	{
		id: 7,
		name: "Ethereal Eyes Eyeshadow Palette: Moonlight",
		brand: "MAKEUP BY MARIO",
		user_id: 2,
	},
	{
		id: 8,
		name: "Super Serum Skin Tint SPF 40 Foundation",
		brand: "ILIA",
		user_id: 2,
	},
	{
		id: 9,
		name: "Ultra Suede® Sculpting Lip Pencil",
		brand: "MAKEUP BY MARIO",
		user_id: 2,
	},
];

export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("wishlist").del();
	await knex("wishlist").insert(wishlistData);
}
