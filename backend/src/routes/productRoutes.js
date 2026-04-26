import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../utils/validateRequest.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  adminOnly,
  [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("stock").isInt({ min: 0 }).withMessage("Valid stock is required"),
    validateRequest,
  ],
  createProduct
);
router.put(
  "/:id",
  protect,
  adminOnly,
  [
    body("name").optional().trim().notEmpty(),
    body("price").optional().isFloat({ min: 0 }),
    body("description").optional().trim().notEmpty(),
    body("stock").optional().isInt({ min: 0 }),
    validateRequest,
  ],
  updateProduct
);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;

