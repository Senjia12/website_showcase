import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL,
}));

// routes import


// routes declaration

export default app;