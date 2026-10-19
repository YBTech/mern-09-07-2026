import express from "express";
import { chatRoute } from "./chat";
import { products } from "./products";

const app = express();
app.use(express.json());

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/chat", chatRoute);

app.listen(3002, () => console.log("Shop API on http://localhost:3002"));
