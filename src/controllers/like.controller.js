import { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Like } from "../models/like.model";


const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoId')
    }

    // Has this user already liked this video
    const existingLike = await Like.findOne(
        {
            video : videoId,
            likedBy : req.user._id
        }
    )

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},'Video unliked successfully')
        )
    }
    else{
        await Like.create({
            video:videoId,
            likedBy:req.user._id
        })
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},'Video liked successfully')
        )
    }

    
})

const toggleCommentLike = asyncHandler(async(req,res)=>{
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,'Invalid commentId')
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,'Comment not found')
    }

    // Has this user already liked this comment
    const existingLike = await Like.findOne(
        {
            comment : commentId,
            likedBy : req.user._id
        }
    )   

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res
        .status(200)
        .json(
             new ApiResponse(200,{},'Comment unliked successfully')
        )
    }
    else{
        await Like.create({
            comment: commentId,
            likedBy:req.user._id
        })
        return res
        .status(200)
        .json(
             new ApiResponse(200,{},'Comment liked successfully')
        )
    }

    
})

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId")
  }

  const tweet = await Tweet.findById(tweetId)
  if (!tweet) {
    throw new ApiError(404, "Tweet not found")
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id
  })

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id)

    return res.status(200).json(
      new ApiResponse(200, {}, "Tweet unliked")
    )
  }

  await Like.create({
    tweet: tweetId,
    likedBy: req.user._id
  })

  return res.status(200).json(
    new ApiResponse(200, {}, "Tweet liked")
  )
})

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const likes = await Like.find({
    likedBy: userId,
    video: { $ne: null }
  }).populate("video")

  const videos = likes.map(like => like.video)

  return res.status(200).json(
    new ApiResponse(200, videos, "Liked videos fetched successfully")
  )
})

export{
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}