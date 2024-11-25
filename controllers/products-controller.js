import initKnex from "knex";
import config from "../knexfile.js";

const knex = initKnex(config);

const getAllProducts = async (req, res) => {
	const { id } = req.body;

	try {
		const products = await knex("products")
			.where({ user_id: id })
			.join("categories", "products.category_id", "categories.id")
			.select(
				"products.id",
				"products.name",
				"categories.name as category",
				"brand",
				"batchNumber",
				"dateOpened",
				"expirationDate"
			);
		res.json(products);
	} catch (error) {
		res.status(500).json({
			message: `Unable to retrieve products for user with id ${id}: ${error}`,
		});
	}
};

export { getAllProducts };
