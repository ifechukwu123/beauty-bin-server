import initKnex from "knex";
import config from "../knexfile.js";
import bcrypt from "bcryptjs";

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
	const salt = bcrypt.genSaltSync(10);
	const encryptedPassword = bcrypt.hashSync(password, salt);

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

const loginUser = () => {};

export { signUpUser, loginUser };
