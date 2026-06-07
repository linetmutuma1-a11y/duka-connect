import express from "express";

import productRoutes from "./action/products.js";
import orderRoutes from "./action/orders.js";
import aiRoutes from "./action/ai.js";
import paymentRoutes from "./action/payments.js";

import { sendMpesaSTKPush } from "./mpesa.js";

const app = express();

app.use(express.json());

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/ai", aiRoutes);
app.use("/payments", paymentRoutes);

// STK Push route
app.post("/stkpush", async (req, res) => {
  try {
    const result = await sendMpesaSTKPush();

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to initiate payment"
    });
  }
});

// M-PESA callback
app.post("/mpesa/callback", (req, res) => {
  console.log("M-PESA CALLBACK RECEIVED");

  console.log(
    JSON.stringify(req.body, null, 2)
  );

  res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Accepted"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal Server Error"
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});