import express from "express";
import { confirmOrder, createOrder } from "../controllers/order.controller.js";
import { isAuthenticated } from "../middlewares/verifyAuth.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createOrder);
router.route("/success").post(isAuthenticated, confirmOrder);

export default router;
