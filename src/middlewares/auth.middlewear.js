
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
  console.log("===== VERIFY JWT START =====");

  const authHeader = req.headers.authorization;

  const token =
    req.cookies?.accessToken ||
    (authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  console.log("TOKEN:", token);

  if (!token) {
    return next(new ApiError(401, "No token found"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("DECODED TOKEN:", decoded);

    // IMPORTANT FIX 👇
    const userId = decoded.id; // MUST match your JWT payload

    const user = await User.findById(userId);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;

    console.log("AUTH USER SET:", req.user._id);

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return next(new ApiError(401, "Invalid token"));
  }
});