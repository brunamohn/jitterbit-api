import dotenv from "dotenv";
import express from "express";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", orderRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "API funcionando" });
});

export default app;