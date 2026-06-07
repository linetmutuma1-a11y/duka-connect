import express from "express";
import { querySTKStatus } from "../mpesa.js";
import { generateThankYou } from "./ai.js";

const router = express.Router();

router.get(
  "/payment-status/:checkoutRequestId",
  async (req, res) => {
    try {
      const result = await querySTKStatus(
        req.params.checkoutRequestId
      );

      if (result.ResultCode === 0) {
        const thankYouMessage =
          await generateThankYou(
            "Customer",
            "your payment"
          );

        return res.json({
          paymentStatus: "SUCCESS",
          thankYouMessage,
          mpesa: result
        });
      }

      res.json(result);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to query payment status"
      });
    }
  }
);

export default router;