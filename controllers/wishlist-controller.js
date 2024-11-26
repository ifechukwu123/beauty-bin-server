import initKnex from "knex";
import config from "../knexfile.js";

const knex = initKnex(config);

const getWishlist = async (req, res) => {
	//verify user
	const { userId } = req.body;

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
	//verify user?

	const { userId, name, brand, image } = req.body;

	//validate request body

	try {
		const [newId] = await knex("wishlist").insert({
			user_id: userId,
			name: name,
			brand: brand,
			image: image,
		});

		const newItem = await knex("wishlist")
			.where({ id: newId })
			.select("id", "name", "brand");

		res.status(201).json(newItem[0]);
	} catch (error) {
		res.status(500).json({ message: `Unable to add to wishlist: ${error}` });
	}
};

const deleteWishlistItem = async (req, res) => {
	//verify user?

	const { userId } = req.body;
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
