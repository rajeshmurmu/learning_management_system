import Razorpay from "razorpay";
import { Course } from "../models/course.model.js";
import Order from "../models/order.model.js";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { course_id } = req.body;
    const user = req.user?._id;

    // create razorpay order
    const course = await Course.findById(course_id);

    const order = await razorpay.orders.create({
      amount: Number(course.coursePrice * 100),
      currency: "INR",
      receipt: `receipt#1${Date.now()}`,
      payment_capture: 1,
      notes: {
        course_id: course_id,
        user_id: user,
      },
    });

    // console.log(order);

    const newOrder = await Order.create({
      course_id: course_id,
      user_id: user,
      amount: course.coursePrice,
      status: "Pending",
      payment_id: order.id,
    });
    // console.log("newOrder", newOrder);

    return res.status(200).json({
      success: true,
      order: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        db_order_id: newOrder._id,
      },
    });
  } catch (error) {
    console.log("Error create order", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    // getting the details back from our font-end
    const { order_id, payment_id, payment_signature, db_order_id } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const generatedSignature = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    );

    generatedSignature.update(`${order_id}|${payment_id}`);

    const digest = generatedSignature.digest("hex");

    // comparing our digest with the actual signature
    if (digest !== payment_signature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // SAVE THE DETAILS IN YOUR DATABASE

    const order = await Order.findById(db_order_id);
    // console.log("orderDetails", order);
    if (!order) {
      return res.status(404).json({
        success: false,
        error:
          "Order not found, contact us if your money has been debited from your account",
      });
    }

    const course = await Course.findOneAndUpdate(
      { _id: order.course_id },
      {
        $push: {
          enrolledStudents: order.user_id,
        },
      }
    );
    console.log("course", course);
    if (!course) {
      return res.status(404).json({
        success: false,
        error:
          "Unable to assign course, contact us if your money has been debited from your account",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: order.user_id },
      {
        $push: {
          coursesEnrolled: order.course_id,
        },
      }
    );

    console.log("user", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        error:
          "Unable to assign course, contact us if your money has been debited from your account",
      });
    }

    order.status = "Completed";
    await order.save();

    return res.json({
      success: true,
      message: "Payment Success",
      order_id: order._id,
      payment_id: order.payment_id,
    });
  } catch (error) {
    console.log("Error confirm order", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
