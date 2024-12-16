import express from "express";
import * as controller from "../controllers/users-controller.js";

const router = express.Router();

router.post("/login", controller.loginUser);

router.post("/signUp", controller.signUpUser);

export function authorizeUser(req, res, next) {}

export default router;
