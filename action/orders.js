import express from "express";
import { products, orders } from "../data/store.js";

const router = express.Router();

// POST /orders
router.post("/", (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({
      error: "productIds must be a non-empty array"
    });
  }

  const orderProducts = [];

  for (const id of productIds) {
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(400).json({
        error: `Product ${id} does not exist`
      });
    }

    orderProducts.push(product);
  }

  const total = orderProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const order = {
    id:
      orders.length > 0
        ? Math.max(...orders.map(o => o.id)) + 1
        : 1,
    productIds,
    total,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  res.status(201).json(order);
});

// GET /orders/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({
      error: "Order not found"
    });
  }

  res.status(200).json(order);
});

export default router;