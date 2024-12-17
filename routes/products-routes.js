import express from "express";
import * as controllers from "../controllers/products-controller.js";

const router = express.Router();

router
	.route("/")
	.get(controllers.getAllProducts)
	.post(controllers.addNewProduct);

router
	.route("/:id")
	.get(controllers.getOneProduct)
	.delete(controllers.deleteProduct)
	.put(controllers.editProduct);

export default router;
