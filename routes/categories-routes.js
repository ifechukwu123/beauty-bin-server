import express from "express";
import * as controllers from "../controllers/categories-controller.js";

const router = express.Router();

router.get("/", controllers.getCategories);

export default router;
