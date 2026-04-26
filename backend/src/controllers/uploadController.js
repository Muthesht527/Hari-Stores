import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Image file is required");
    error.statusCode = 400;
    throw error;
  }

  res.status(201).json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
});
