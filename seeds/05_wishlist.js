/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const wishlistData = [
	{
		id: 1,
		name: "Precious Gemstones Mid-Size Eyeshadow Palette",
		brand: "SEPHORA",
		image: "images/wish1.png",
		user_id: 1,
	},
	{
		id: 2,
		name: "Hollywood Contour Wand",
		brand: "Charlotte Tilbury",
		image: "images/wish2.png",
		user_id: 1,
	},
	{
		id: 3,
		name: "Balm Dotcom Lip Balm and Skin Salve",
		brand: "Glossier",
		image: "images/wish3.png",
		user_id: 1,
	},
	{
		id: 4,
		name: "Sephora Colorful Waterproof Eyeshadow & Eyeliner Multi-Stick",
		brand: "SEPHORA",
		image: "images/wish4.png",
		user_id: 2,
	},
	{
		id: 5,
		name: "Glow and Sculpt Face Serum Primer with Niacinamide",
		brand: "REFY",
		image: "images/wish5.png",
		user_id: 2,
	},
	{
		id: 6,
		name: "Matte Revolution Hydrating Lipstick",
		brand: "Charlotte Tilbury",
		image: "images/wish6.png",
		user_id: 1,
	},
	{
		id: 7,
		name: "Mixed Signals Dual-Ended Cream & Liquid Shadow Stick",
		brand: "Morphe",
		image: "images/wish7.png",
		user_id: 2,
	},
	{
		id: 8,
		name: "Hydro Grip Dewy Long-Lasting Setting Spray With Hyaluronic Acid + Niacinamide",
		brand: "MILK MAKEUP",
		image: "images/wish8.png",
		user_id: 2,
	},
	{
		id: 9,
		name: "Mini PhD Hybrid Hydrating Tinted Lip Oil",
		brand: "HAUS LABS BY LADY GAGA",
		image: "images/wish9.png",
		user_id: 2,
	},
];

export async function seed(knex) {
	// Deletes ALL existing entries
	await knex("wishlist").del();
	await knex("wishlist").insert(wishlistData);
}
