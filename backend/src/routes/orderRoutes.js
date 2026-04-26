import express from "express";
import { body } from "express-validator";
import {
  createRazorpayOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  verifyPaymentAndCreateOrder,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../utils/validateRequest.js";

const router = express.Router();

router.post(
  "/create-razorpay-order",
  protect,
  [body("items").isArray({ min: 1 }).withMessage("Cart items are required"), validateRequest],
  createRazorpayOrder
);
router.post(
  "/verify-payment",
  protect,
  [
    body("items").isArray({ min: 1 }).withMessage("Cart items are required"),
    body("razorpayOrderId").notEmpty().withMessage("Razorpay order id is required"),
    body("razorpayPaymentId").notEmpty().withMessage("Razorpay payment id is required"),
    body("razorpaySignature").notEmpty().withMessage("Razorpay signature is required"),
    validateRequest,
  ],
  verifyPaymentAndCreateOrder
);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.put(
  "/:id/status",
  protect,
  adminOnly,
  [
    body("orderStatus")
      .isIn(["pending", "paid", "shipped", "delivered"])
      .withMessage("Invalid order status"),
    validateRequest,
  ],
  updateOrderStatus
);

export default router;

