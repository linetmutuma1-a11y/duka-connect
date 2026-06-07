import express from "express";
import { products } from "../data/store.js";

const router = express.Router();

// get all products
router.get("/", (req, res) => {
  res.status(200).json(products);
});

// get a single product by id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  console.log("Requested ID:", id);
  console.log("Products:", products);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  res.json(product);
});

// add a product
router.post("/", (req, res) => {
  const { name, price } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Product name is required",
    });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      error: "Price must be a positive number",
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct,
  });
});

export default router;