import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
