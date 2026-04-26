import express from "express";
import { body } from "express-validator";
import { authenticateWithFirebase, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../utils/validateRequest.js";

const router = express.Router();

router.post(
  "/firebase",
  [body("idToken").notEmpty().withMessage("Firebase ID token is required"), validateRequest],
  authenticateWithFirebase
);
router.get("/me", protect, getProfile);

export default router;

