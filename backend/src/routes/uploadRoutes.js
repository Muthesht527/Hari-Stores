import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadProductImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/product-image", protect, adminOnly, upload.single("image"), uploadProductImage);

export default router;
