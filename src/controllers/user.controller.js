import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import fs from 'fs'
import mongoose from "mongoose";
import { decode } from "punycode";
// import { response } from "express";
// import { upload } from "../middlewares/multer.middleware.js";


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

// const registerUser = asyncHandler(async (req, res) => {

//   const { fullName, username, email, password } = req.body;

//   // ✅ validation
//   if ([fullName, username, email, password].some((f) => !f || f.trim() === "")) {
//     throw new ApiError(400, "All fields are required!");
//   }

//   if (!email.includes("@")) {
//     throw new ApiError(400, "@ symbol is required in email");
//   }

//   // ✅ check existing user
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }]
//   });

//   if (existedUser) {
//     throw new ApiError(409, "User already exists");
//   }

//   // ✅ safe file access
//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is required!");
//   }

//   // ✅ upload avatar
//   const avatar = await uploadOnCloudinary(avatarLocalPath);

//   if (!avatar) {
//     throw new ApiError(500, "Avatar upload failed");
//   }

//   // ✅ upload cover image only if exists
//   let coverImage = null;

//   if (coverImageLocalPath) {
//     coverImage = await uploadOnCloudinary(coverImageLocalPath);
//   }

//   // ✅ create user
//   const user = await User.create({
//     fullName,
//     username: username.toLowerCase(),
//     email,
//     password,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || ""
//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiError(500, "User creation failed");
//   }

//   return res.status(201).json(
//     new ApiResponse(201, createdUser, "User registered successfully")
//   );
// });



const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { fullName, username, email, password } = req.body;

    // ✅ SAFE validation
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // ✅ Check existing user
    const existedUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // ✅ SAFE file handling
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required"
      });
    }

    // ✅ Upload avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      return res.status(500).json({
        success: false,
        message: "Avatar upload failed"
      });
    }

    // ✅ Upload cover only if exists
    let coverImage = null;

    if (coverImageLocalPath) {
      coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    // ✅ Create user
    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage?.url || ""
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res.status(201).json({
      success: true,
      user: createdUser
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
});


const loginUser = asyncHandler(async(req,res) => {
    // get the data from  res.body thats user
    // get the email and password from user
    // check that the email is registered in database or not
    // check the password in databse that is correct or not
    // if registered and valid email and password so  logged in 
    // generate acces token and refresh token
    // send to front end in json

    const{username,email,password} =  req.body;

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
    // secure   : true
    secure: false, //  FIX
    sameSite: "lax", //  IMPORTANT for local dev

    // In production Required for HTTPS + different domains
    secure: true,
    sameSite: "none"
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
        req.user._id,
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
    //  const incomingRefreshToken = req.cookies.refreshToken || req.body.cookies.refreshToken
    // This looks in the body first, then fallback to cookies if you add them later
    const incomingRefreshToken = req.body.refreshToken || req.body.token || req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json("Refresh Token not found!");
    }


    //  console.log("req.body",req.body.refreshToken)
    //  console.log("req.cookies",req.cookies?.refreshToken)
    //  console.log("body",req.body.token )
  
     if(!incomingRefreshToken){
      throw new ApiError(401,"unauthorized request")
     }
  
     const decodedToken =  jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

    //  console.log("decodedToken",decodedToken)

    const user = await User.findById(decodedToken.id)
    // console.log("user",user)
  
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

const changeCurrentPassword = asyncHandler(async (req,res) => {
    const {oldPassword,newPassword,confirmPassword} = req.body
    const user =  await User.findById(req.user?._id)
    const  isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,'Old Password is Incorrect!')
    }


     if(newPassword !== confirmPassword){
        throw new ApiError(400,'New Password and Confirm Password does not match!')
    }

    user.password = newPassword
    // user.newPassword = confirmPassword

   await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},'Password Changed Successfully')
    )

    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $unset : {
    //             refreshToken : 1
    //         }
    //     } 
    //  )
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,'Current User fetched Successfully')
    )
})


const updateAccountDetails = asyncHandler (async(req,res) => {
  
    const {fullName , email} = req.body
   const user =  await User.findByIdAndUpdate(
        req.user?._id,
        {
            fullName,
            email
        },
        {
            new:true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,'User Updated Successfully')
    )

})

const updateUserAvatar = asyncHandler(async(req,res)=>{
  
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,'Avatar file is required')
    }
    

 const avatar = await uploadOnCloudinary(avatarLocalPath)
//  console.log("avatar",avatar)

 if(!avatar.url){
    throw new ApiError(400,'Error while uploading avatar on Cloudinary')
 }

 const user = await User.findById(req.user?._id)
//  console.log("user",user)
 const oldAvatarUrl = user.avatar.url 
//  console.log("oldAvatarUrl",oldAvatarUrl)

 const uploadNewAvatar = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            avatar : avatar.url
        }
    },
    {
        new : true
    }
 ).select('-password')
//  console.log("uploadNewAvatar",uploadNewAvatar)

 if(oldAvatarUrl){
    fs.unlink(oldAvatarUrl,(err)=>{
        if(err) {
            throw new ApiError(500,'Error while deleting old avatar from server')
        }
    })
 }



//  const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//         $set :{
//             avatar : avatar.url
//         }
//     },

//     {
//         new : true
//     }
//  ).select('-password')

//  if(user.avatar){
//     fs.unlink(user.avatar,(err)=>{
//         if(err){
//             throw new ApiError(500,'Error while deleting old avatar from server')
//         }
//     })
//   }

 return res
 .status(200)
 .json(
   new ApiResponse(200,user,'Avatar Updated Successfully')
 )


})



const updateUserCoverImage = asyncHandler(async(req,res)=>{

  const coverImageLocalPath =  req.file?.path
  if(!coverImageLocalPath){
    throw new ApiError(400,'Cover Image file is required')
  }


 
const coverImage =  await uploadOnCloudinary(coverImageLocalPath)
if(!coverImage.url){
    throw new ApiError(400,'Error while uploading CoverImage on cloudinary')
}

const user = await User.findById(req.user?._id)

const oldCoverImageUrl = user.coverImage.url

const uploadNewCoverImage = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            coverImage : coverImage.url
        }
    },
    {
        new : true
    }
).select('-password')

 if(oldCoverImageUrl){
    fs.unlink(oldCoverImageUrl,(err)=>{
        if(err){
            throw new ApiError(500,'Error while deleting old coverImage from server')
        }
    })
}


return res
.status(200)
.json(
    new ApiResponse(200,user,'Cover Image Updated Successfully')
)


})


const getUserChannelProfile =asyncHandler(async(req,res)=>{
  
    const {username} =  req.params
   if(!username?.trim()){
    throw new ApiError(400,'username is missing')
   }
   console.log("username",username)

   const channel = User.aggregate([
    {
        $match:{
            username:username?.toLowerCase()
        },
    },
        {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"channel",
                    as:"subscribers"

                }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
                
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                email:1,
                avatar:1,
                coverImage:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1

            }
        }
    
   ])

   console.log("channel",channel)
   if(!channel?.length){
    throw new ApiError(404,"Channel doesn't exists")
   }
   console.log("channel",channel.length)

   return res
   .status(200)
   .json(
    new ApiResponse(200,channel[0],"User Channel Fetched Successfully")
   )

})


const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"owner",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        avata:1
                                    }
                                },

                                {
                                    $addFields:{
                                        owner:{
                                            $first:"$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]

            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200,user[0].watchHistory,'User Watch History Fetched Successfully')
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}