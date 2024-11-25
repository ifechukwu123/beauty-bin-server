import express from "express";
import cors from "cors";
import productRoutes from "./routes/products-routes.js";
import categoryRoutes from "./routes/categories-routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
