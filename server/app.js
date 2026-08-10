import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
}));

// routes import
import productRouter from './routes/product.routes.js';

// routes declaration
app.use("/view", productRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// central error handler
app.use((err, req, res, next) => { // 4 params = error handler (for express)
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;