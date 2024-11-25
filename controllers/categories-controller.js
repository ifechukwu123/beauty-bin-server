import initKnex from "knex";
import config from "../knexfile.js";

const knex = initKnex(config);

const getCategories = async (req, res) => {
	try {
		const categories = await knex("categories");
		res.json(categories);
	} catch (error) {
		res
			.status(500)
			.json({ message: `Unable to retrieve categories: ${error}` });
	}
};

export { getCategories };
