import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { response } from "express";

const generateAccessAndRefreshTokens = async(userId) => {
    try {

       const user = await User.findById(userId)

       if(!user){
        throw new ApiError(404,'User is not valid')
       }

       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
      await user.save({validateBeforeSave:false})

       return{
        accessToken,
        refreshToken
    }

    } catch (error) {
        console.log(error)
        throw new ApiError(500,'someThing went wrong while generating Access and Refresh Token')
        // console.log("Error :" , error)
    }
   
}

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

    const{fullName,username,email,password} = req.body;

    console.log(req.body);

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

    const existedUser = await User.findOne({
        $or : [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409,'User with this Username and Email already exists')
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) &&  req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,'Avatar file is required!'); // Here is checking that the user uploaded the avatar file or not if not throw error
    }
    // if(!coverImageLocalPath){
    //     throw new ApiError(400,'CoverImage file is required!');
    // }

   const avatar =  await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatarLocalPath){
    throw new ApiError(400,'Avatar file is required!') // Here is checking that the avatar file is uploaded on cloudinary or not if not throw error
   }

//    if(!coverImage){
//     throw new ApiError(400,'CoverImage is required!') // Here is checking that the cover Image file is uploaded on cloudinary or not if not throw error 
//    }
   
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

const loginUser = asyncHandler(async(req,res) => {
    // get the data from  res.body thats user
    // get the email and password from user
    // check that the email is registered in database or not
    // check the password in databse that is correct or not
    // if registered and valid email and password so  logged in 
    // generate acces token and refresh token
    // send to front end in json

    const{username,email,password} =  req.body

    // if(!email || !username){
    //     throw new ApiError(404,"username or email is required")
    // }
    if( !(email || username) ){
        throw new ApiError(404,"username or email is required")
    }

     const user = await User.findOne({
        $or : [{ username },{ email }]
    })

    if(!user){
        throw new ApiError(400,"User doesn't exists")
    }

  const isPasswordValid =  await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401,'Invalid user credentials')
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure   : true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
        200,
        {
            user : loggedInUser,refreshToken,accessToken
        },
        "User logged In Successfully"
    )
  )

})

const logoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user_id,
        {
            $unset:{
                refreshToken:1 //  this removes the field from document
            }
        },
        {
            new :true // return the updated document
        }
    )
    

    const options = {
        httpOnly : true, // Prevents JavaScript from accessing cookies.
        secure : true    // Cookies only travel over: HTTPS
        }    

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(
        new ApiResponse(200,{},"User logged Out")
    )

})

const refreshAccessToken = asyncHandler(async(req,res) => {

  try {
     const incomingRefreshToken = req.cookies.refreshToken || req.body.cookies.refreshToken
  
     if(!incomingRefreshToken){
      throw new ApiError(401,"unauthorized request")
     }
  
     const decodedToken =  jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401,"Invalid Refresh Token")
    }
  
    if(incomingRefreshToken !== user.refreshToken){
      throw new ApiError(401,"Refresh Token is Expired or Used")
    }
  
    const options = {
      httpOnly : true,
      secure : true
    }
  
   const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
  return res
  .status(200)
  .cookie('accessToken',accessToken,options)
  .cookie('refreshToken',newRefreshToken,options)
  .json(
      new ApiResponse(
          200,
          {accessToken,refreshToken : newRefreshToken,options},
          'Access Token Refreshed'
      )
  )
  } catch (error) {
    throw new ApiError(401,error?.message || 
        "Invalid Refresh Token"
    )
  }

   

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}