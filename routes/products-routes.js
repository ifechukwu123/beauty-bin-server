import express from "express";
import * as controllers from "../controllers/products-controller.js";

const router = express.Router();

router.get("/", controllers.getAllProducts);

export default router;
