import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {

    // get user detials  from frontend
    // validation - not empty
    // check  if user already exists - username , email
    // check for images and avatar
    // upload them to cloudinary - avatar
    // craete user object- create entry in db
    // remove the password and refresh token field from response 
    // check for user creation
    // return response

    const[fullName,username,email,password] = res.body;

    if(
        [fullName,username,email,password].some((field) => field?.trim() === '' )
    ){
        throw ApiError(400,'All fields are required!')
    }
    if(!email.includes('@')){
        throw ApiError(300,'@ symbol is required in email')
    }

    // if(fullName === ''){
    //     throw ApiError(400,"fullName field are required!")
    // }
    // if(username ===''){
    //     throw ApiError(400,'username filed are required!')
    // }
    // if(email === ''){
    //     throw ApiError(400,'email field are required!')
    // }
    // if(password){
    //     throw ApiError(400,'password field are required!')
    // }

    const existedUser = User.findOne({
        $or : [{ username },{ email }]
    })

    if(existedUser){
        throw ApiError(409,'User with this Username and Email already exists')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,'Avatar file is required!'); // Here is checking that the user uploaded the avatar file or not if not throw error
    }
    if(!coverImageLocalPath){
        throw new ApiError(400,'CoverImage file is required!');
    }

   const avatar =  await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatarLocalPath){
    throw new ApiError(400,'Avatar file is required!') // Here is checking that the avatar file is uploaded on cloudinary or not if not throw error
   }

   if(!coverImage){
    throw new ApiError(400,'CoverImage is required!') // Here is checking that the cover Image file is uploaded on cloudinary or not if not throw error 
   }
   
  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || '',
    username:username.toLowerCase(),
    email,
    password
   })
   
   const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
   )

   if(!createdUser){
    throw new ApiError(500,'Something went wrong while registering the user')
   }
    
   return res.status(201).json(
    new ApiResponse(200,createdUser,'User registered Successfully')
   )



})

export {registerUser}