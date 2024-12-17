import express from "express";
import "dotenv/config";
import cors from "cors";
import cron from "node-cron";
import { Server } from "socket.io";
import { createServer } from "node:http";
import productRoutes from "./routes/products-routes.js";
import categoryRoutes from "./routes/categories-routes.js";
import wishlistRoutes from "./routes/wishlist-routes.js";
import usersRoutes from "./routes/users-routes.js";
import updateNotificationsTable from "./schedulers/updateNotificationsTable-scheduler.js";
import sendNotification from "./schedulers/sendNotification-scheduler.js";
import { authorizeUser } from "./controllers/users-controller.js";

const PORT = process.env.PORT || 8080;
const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.CORS_ORIGIN,
	},
});

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.static("./public"));

app.use("/users", usersRoutes);
app.use("/products", authorizeUser, productRoutes);
app.use("/categories", categoryRoutes);
app.use("/wishlist", authorizeUser, wishlistRoutes);

//Scheduled task
cron.schedule(
	"0 0 * * *",
	async () => {
		try {
			await updateNotificationsTable();
			await sendNotification(io);
		} catch (error) {
			console.error(error);
		}
	},
	{ timezone: "America/Halifax" }
);

io.on("connection", (socket) => {
	//console.log("Socket id is", socket.id);
});

server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
