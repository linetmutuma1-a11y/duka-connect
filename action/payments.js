import express from "express";
import { querySTKStatus } from "../mpesa.js";
import { generateThankYou } from "./ai.js";

const router = express.Router();

router.get(
  "/payment-status/:checkoutRequestId",
  async (req, res) => {
    try {
      const result =
        await querySTKStatus(
          req.params.checkoutRequestId
        );

      if (
        result.ResultCode === "0" ||
        result.ResultCode === 0
      ) {
        const thankYouMessage =
          await generateThankYou(
            "Customer",
            1000
          );

        return res.status(200).json({
          paymentStatus: "SUCCESS",
          thankYouMessage,
          mpesa: result,
        });
      }

      return res.status(200).json({
        paymentStatus: "FAILED",
        message: result.ResultDesc,
        mpesa: result,
      });

    } catch (error) {
      console.error(
        "PAYMENT STATUS ERROR:",
        error
      );

      res.status(500).json({
        error:
          "Failed to query payment status",
      });
    }
  }
);

export default router;