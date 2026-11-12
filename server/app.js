import express from "express";
import cors from "cors";

const app = express();

// app.use("/api/v1/webhook", express.raw({ type: "application/json" }), webhookRouter); // webhook verif needs raw body
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
}));

// routes import
import brickRouter from './routes/brick.routes.js';
import cartRouter from './routes/cart.routes.js';
import checkoutRouter from './routes/checkout.routes.js';

// routes declaration
app.use("/bricks", brickRouter);
app.use("/shop", cartRouter);
app.use('/checkout', checkoutRouter);

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