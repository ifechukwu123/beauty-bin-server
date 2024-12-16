import express from "express";
import * as controllers from "../controllers/wishlist-controller.js";
import { authorizeUser } from "../controllers/users-controller.js";

const router = express.Router();

router
	.route("/")
	.get(controllers.getWishlist)
	.post(controllers.addWishlistItem);

router.delete("/:id", controllers.deleteWishlistItem);

export default router;
