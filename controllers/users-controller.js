import initKnex from "knex";
import config from "../knexfile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const knex = initKnex(config);

const signUpUser = async (req, res) => {
	let { email, password } = req.body;

	if (!email?.trim() || !password?.trim()) {
		return res.status(400).json({
			message:
				"Missing data in request body. Please input both an email & password",
		});
	}

	//add function to verify email format here!!!!!!!

	email = email.trim();
	password = password.trim();

	//create unique hash for password
	const encryptedPassword = bcrypt.hashSync(password, 10);

	try {
		const user = await knex("users").insert({
			email: email,
			password: encryptedPassword,
		});

		res.status(201).json({ message: "User successfully created!" });
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(400).send("User with this email already exists!");
		}
		res.status(500).send(`Unable to sign up user: ${error}`);
	}
};

const loginUser = async (req, res) => {
	let { email, password } = req.body;

	if (!email?.trim() || !password?.trim()) {
		return res.status(400).json({
			message:
				"Missing data in request body. Please input both an email & password",
		});
	}

	email = email.trim();
	password = password.trim();

	try {
		const user = await knex("users").where({ email: email });

		if (!user.length) {
			return res
				.status(404)
				.json({ message: `No user with that email exists` });
		}

		//check if password matches
		const match = bcrypt.compareSync(password, user[0].password);
		if (!match) {
			return res
				.status(401)
				.json({ message: `The password you entered is invalid` });
		}

		const jwtToken = jwt.sign({ id: user[0].id }, process.env.TOKEN_SECRET, {
			expiresIn: "1d",
		});

		res.json({ jwtToken: jwtToken });
	} catch (error) {
		res.status(500).send(`Unable to log in user: ${error}`);
	}
};

const getUserProfile = async (req, res) => {
	const userId = req.user.id;

	try {
		const user = await knex("users")
			.where({ id: userId })
			.select("id", "email");

		if (!user.length) {
			return res
				.status(404)
				.json({ message: `Cannot find user with id ${userId}` });
		}
		res.json(user[0]);
	} catch (error) {
		res
			.status(500)
			.send(`Unable to retrieve profile for user with id ${userId}: ${error}`);
	}
};

const authorizeUser = async (req, res, next) => {
	if (!req.headers.authorization) {
		return res
			.status(403)
			.json({ message: "Please provide an authorization token" });
	}

	const { authorization } = req.headers;
	const jwtToken = authorization.split(" ")[1];

	try {
		const payload = jwt.verify(jwtToken, process.env.TOKEN_SECRET);
		const { id } = payload;

		const user = await knex("users").where({ id: id }).select("id", "email");

		req.user = user[0];
		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(400).send("Token is invalid");
		}
		if (error.name === "TokenExpiredError") {
			return res.status(401).send("Token is expired");
		}
		res.status(500).send(`Unable to authorize user: ${error}`);
	}
};

export { signUpUser, loginUser, getUserProfile, authorizeUser };
