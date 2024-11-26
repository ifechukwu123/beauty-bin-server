import express from "express";
import cors from "cors";
import productRoutes from "./routes/products-routes.js";
import categoryRoutes from "./routes/categories-routes.js";
import wishlistRoutes from "./routes/wishlist-routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.static("./public"));

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/wishlist", wishlistRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
