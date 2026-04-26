import crypto from "crypto";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { razorpay } from "../config/razorpay.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildOrderItems = async (items) => {
  const normalizedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      const error = new Error("One or more products no longer exist");
      error.statusCode = 400;
      throw error;
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      const error = new Error("Invalid quantity in cart");
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error(`Insufficient stock for ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    normalizedItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });

    totalAmount += product.price * quantity;
  }

  return { normalizedItems, totalAmount };
};

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || !items.length) {
    const error = new Error("Cart items are required");
    error.statusCode = 400;
    throw error;
  }

  const { totalAmount } = await buildOrderItems(items);

  const order = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

export const verifyPaymentAndCreateOrder = asyncHandler(async (req, res) => {
  const { items, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!items?.length || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    const error = new Error("Incomplete payment verification payload");
    error.statusCode = 400;
    throw error;
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    const error = new Error("Payment signature verification failed");
    error.statusCode = 400;
    throw error;
  }

  const existingOrder = await Order.findOne({ paymentId: razorpayPaymentId });

  if (existingOrder) {
    return res.json({ message: "Order already processed", order: existingOrder });
  }

  const { normalizedItems, totalAmount } = await buildOrderItems(items);

  for (const item of normalizedItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    userId: req.user._id,
    items: normalizedItems,
    totalAmount,
    razorpayOrderId,
    paymentId: razorpayPaymentId,
    orderStatus: "paid",
  });

  res.status(201).json({
    message: "Payment verified and order created",
    order,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    return next(error);
  }

  order.orderStatus = req.body.orderStatus;
  await order.save();
  res.json(order);
});
