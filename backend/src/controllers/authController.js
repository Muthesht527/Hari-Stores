import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticateWithFirebase = asyncHandler(async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      const error = new Error("Firebase ID token is required");
      error.statusCode = 400;
      throw error;
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = decoded.email || "";
    const phoneNumber = decoded.phone_number || "";
    const name = decoded.name || email.split("@")[0] || phoneNumber || "Hari User";

    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name,
        email,
        phoneNumber,
      });
    } else {
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    throw error;
  }
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});
