import express from "express";
import Order from "../models/order.model.js";
import crypto from "crypto";

const router = express.Router();

router.route("/order").post(async (req, res) => {
  try {
    const body = req.body;
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        error: "Invalid signature",
      });
    }

    const event = JSON.parse(req.body);
    console.log("razorpay event", event);
    // const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = event;
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      //   const order = await Order.findOne({ payment_id: payment.id });
      //   order.status = "Completed";
      //   await order.save();

      const order = await Order.findByIdAndUpdate(
        { payment_id: payment.id },
        {
          payment_id: payment.id,
          status: "Completed",
        },
        {
          new: true,
        }
      ).populate(
        {
          path: "course_id",
          select: "courseTitle",
        },
        {
          path: "user_id",
          select: "name email",
        }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      // send email to user
      // send email to admin
      return res.status(200).json({
        success: true,
        message: "Payment captured successfully",
        received: true,
      });
    }
  } catch (error) {
    console.log("webhook error", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

export default router;
