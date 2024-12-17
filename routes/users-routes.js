import express from "express";
import * as controller from "../controllers/users-controller.js";

const router = express.Router();

router.post("/login", controller.loginUser);

router.post("/signUp", controller.signUpUser);

router.get("/profile", controller.authorizeUser, controller.getUserProfile);

export default router;
