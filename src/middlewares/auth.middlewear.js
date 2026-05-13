// import { User } from "../models/user.model";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

// export const verifyJWT = asyncHandler(async(req,res,next)=>{
     
//  console.log("HEADERS:", req.headers.authorization);
// try {

//     console.log("🔐 verifyJWT middleware running");

//     const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ',"")
//     console.log("Token in Middle wear",token)
    
//     if(!token){
//         throw new ApiError(401,"Unauthorized request")
//     }
//      const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

//      console.log("DecodedToken in Middlewear",decodedToken)
    
//      const user =  await User.findById(decodedToken?.id).select('-password -refreshToken')

//      console.log("User in MiddleWear",user)
   
//      if(!user){
//         throw new ApiError(401,"Invalid Access Token")
//      }
//      console.log("Before req User",user)
//      req.user = user

//      console.log("After req User",user)
//      next()

// } catch (error) {
//     console.log("Error : ", error)
//     throw new ApiError(401,error?.message || 'Invalid Access Token')
// }

// })


export const verifyJWT = asyncHandler(async (req, res, next) => {
  console.log("===== VERIFY JWT START =====");

  console.log("AUTH HEADER:", req.headers.authorization);
  console.log("COOKIES:", req.cookies);

  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.accessToken ||
    (authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  console.log("EXTRACTED TOKEN:", token);

  if (!token) {
    console.log("❌ NO TOKEN FOUND");
    throw new ApiError(401, "No token found");
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log("DECODED:", decodedToken);

    const user = await User.findById(decodedToken?.id);

    console.log("USER FOUND:", user);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("❌ JWT VERIFY ERROR:", error.message);
    throw new ApiError(401, error.message);
  }
});