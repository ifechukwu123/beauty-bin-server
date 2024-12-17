import initKnex from "knex";
import config from "../knexfile.js";

const knex = initKnex(config);

const getWishlist = async (req, res) => {
	const userId = req.user.id;

	try {
		const wishlist = await knex("wishlist")
			.where({ user_id: userId })
			.select("id", "name", "brand", "image");

		res.json(wishlist);
	} catch (error) {
		res.status(500).json({ message: `Unable to retrieve wishlist: ${error}` });
	}
};

const addWishlistItem = async (req, res) => {
	const userId = req.user.id;
	const { name, brand, image, id } = req.body;

	//validate request body

	try {
		//check if the item is already in the wishlist
		const wishItem = await knex("wishlist").where({ product_id: id });

		if (wishItem.length === 0) {
			const [newId] = await knex("wishlist").insert({
				user_id: userId,
				name: name,
				brand: brand,
				product_id: id,
				image: image,
			});

			const newItem = await knex("wishlist")
				.where({ id: newId })
				.select("id", "name", "product_id", "brand", "image");

			res.status(201).json(newItem[0]);
		} else {
			res.status(200).json(wishItem[0]);
		}
	} catch (error) {
		res.status(500).json({ message: `Unable to add to wishlist: ${error}` });
	}
};

const deleteWishlistItem = async (req, res) => {
	const userId = req.user.id;
	const { id } = req.params;

	try {
		const deletedItem = await knex("wishlist")
			.where({ user_id: userId, id: id })
			.del();

		if (deletedItem === 0) {
			return res
				.status(404)
				.json({ message: `Unable to find wishlist item with id ${id}` });
		}

		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({
			message: `Unable to delete item with id ${id} from them wishlist: ${error}`,
		});
	}
};

export { getWishlist, addWishlistItem, deleteWishlistItem };
