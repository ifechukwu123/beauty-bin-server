import initKnex from "knex";
import config from "../knexfile.js";

const knex = initKnex(config);

const getAllProducts = async (req, res) => {
	//verify user

	const { userId } = req.body;

	try {
		const products = await knex("products")
			.where({ user_id: userId })
			.join("categories", "products.category_id", "categories.id")
			.select(
				"products.id",
				"products.name",
				"categories.name as category",
				"brand",
				"batchNumber",
				"image",
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

const getProductsExpiring = async (req, res) => {
	//verify user

	const { userId } = req.body;

	try {
		const expiringProducts = await knex("notifications")
			.where({
				"notifications.user_id": userId,
				type: "aboutToExpire",
			})
			.join("products", "products.id", "product_id")
			.join("categories", "categories.id", "products.category_id")
			.select(
				"products.id",
				"products.name",
				"brand",
				"batchNumber",
				"categories.name as category",
				"dateOpened",
				"image",
				"expirationDate",
				"status as notification_status"
			);
		res.json(expiringProducts);
	} catch (error) {
		res
			.status(500)
			.json({ message: `Unable to retrieve expiring products: ${error}` });
	}
};

const getProductsExpired = async (req, res) => {
	//verify user

	const { userId } = req.body;

	try {
		const expiredProducts = await knex("notifications")
			.where({
				"notifications.user_id": userId,
				type: "expired",
			})
			.join("products", "products.id", "product_id")
			.join("categories", "categories.id", "products.category_id")
			.select(
				"products.id",
				"products.name",
				"brand",
				"batchNumber",
				"categories.name as category",
				"dateOpened",
				"image",
				"expirationDate",
				"status as notification_status"
			);
		res.json(expiredProducts);
	} catch (error) {
		res
			.status(500)
			.json({ message: `Unable to retrieve expired products: ${error}` });
	}
};

const getOneProduct = async (req, res) => {
	//verify user

	const { userId } = req.body;
	const { id } = req.params;

	try {
		const product = await knex("products")
			.where({
				user_id: userId,
				"products.id": id,
			})
			.join("categories", "categories.id", "products.category_id")
			.select(
				"products.id",
				"products.name",
				"brand",
				"batchNumber",
				"image",
				"categories.name as category",
				"dateOpened",
				"expirationDate"
			);

		if (product.length === 0) {
			return res
				.status(404)
				.json({ message: `Cannot find makeup product with id ${id}` });
		}

		res.json(product[0]);
	} catch (error) {
		res
			.status(500)
			.json({ message: `Unable to retrieve product with id ${id}: ${error}` });
	}
};

const addNewProduct = async (req, res) => {
	//verify user

	const {
		userId,
		name,
		brand,
		batchNumber,
		category,
		dateOpened,
		expirationDate,
	} = req.body;

	//add validation for request body

	let image;

	switch (category) {
		case "face":
			image = "/images/face.png";
			break;

		case "eye":
			image = "/images/eye.png";
			break;

		case "lip":
			image = "/images/lip.png";
			break;

		default:
			image = "/images/other.png";
			break;
	}

	try {
		//Get category id
		const categoryID = await knex("categories").where({ name: category });

		const newProduct = await knex("products").insert({
			name: name,
			brand: brand,
			batchNumber: batchNumber,
			category_id: categoryID[0].id,
			user_id: userId,
			dateOpened: dateOpened,
			image: image,
			expirationDate: expirationDate,
		});

		const product = await knex("products")
			.where({ "products.id": newProduct[0] })
			.join("categories", "categories.id", "products.category_id")
			.select(
				"products.id",
				"products.name",
				"brand",
				"batchNumber",
				"categories.name as category",
				"dateOpened",
				"image",
				"expirationDate"
			);
		res.status(201).json(product);
	} catch (error) {
		res
			.status(500)
			.json({ message: `Unable to add new makeup product ${id}: ${error}` });
	}
};

const deleteProduct = async (req, res) => {
	//verify user

	const { userId } = req.body;
	const { id } = req.params;

	try {
		const deletedProduct = await knex("products")
			.where({
				user_id: userId,
				id: id,
			})
			.del();

		if (deletedProduct === 0) {
			return res
				.status(404)
				.json({ message: `Unable to find makeup product with id ${id}` });
		}

		res.sendStatus(204);
	} catch (error) {
		res
			.status(500)
			.json({ message: `Unable to retrieve product with id ${id}: ${error}` });
	}
};

const editProduct = async (req, res) => {
	//verify user

	const {
		userId,
		name,
		brand,
		batchNumber,
		category,
		dateOpened,
		expirationDate,
	} = req.body;
	const { id } = req.params;

	//verify request body

	try {
		//Get category id
		const categoryID = await knex("categories").where({ name: category });

		const editedProduct = await knex("products")
			.where({
				user_id: userId,
				id: id,
			})
			.update({
				user_id: userId,
				name: name,
				batchNumber: batchNumber,
				brand: brand,
				category_id: categoryID[0].id,
				dateOpened: dateOpened,
				expirationDate: expirationDate,
			});

		if (editedProduct === 0) {
			return res
				.status(404)
				.json({ message: `Unable to find makeup product with id ${id}` });
		}

		const product = await knex("products")
			.where({ "products.id": id })
			.join("categories", "categories.id", "products.category_id")
			.select(
				"products.id",
				"products.name",
				"brand",
				"batchNumber",
				"categories.name as category",
				"image",
				"dateOpened",
				"expirationDate"
			);

		res.json(product);
	} catch (error) {
		res
			.status(500)
			.json({ message: `Unable to retrieve product with id ${id}: ${error}` });
	}
};

export {
	getAllProducts,
	getOneProduct,
	addNewProduct,
	deleteProduct,
	editProduct,
	getProductsExpiring,
	getProductsExpired,
};
