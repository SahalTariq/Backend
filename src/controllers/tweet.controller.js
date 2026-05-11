import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body

    if(!content?.trim()){
        throw new ApiError(400,'Content is required')
    }
    const newTweet = await Tweet.create({
        content,
        owner:req.user?._id
    })
    if(!newTweet){
        throw new ApiError(500,'Error while creating tweet')
    }
    return res.status(201).json(
        new ApiResponse(201, newTweet, 'Tweet created successfully')
    )
})

const updateTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params
    const {content} = req.body

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,'Invalid tweetId')
    }

    if(!content?.trim()){
        throw new ApiError(400,'Content is required')
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        },
        {
            new:true
        }
        
    )

    if(!updatedTweet){
        throw new ApiError(500,'Error while updating tweet')
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, 'Tweet updated successfully')
    )
})

const deleteTweet = asyncHandler(async(req,res)=>{
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,'Invalid tweetId')
    }
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(500,'Error while deleting tweet')
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, 'Tweet deleted successfully')
    )
})

const getUserTweets = asyncHandler(async(req,res)=>{
    const userTweets = await Tweet.find({owner:req.user?._id}).sort({createdAt:-1})

    return res
    .status(200)
    .json(
        new ApiResponse(200, userTweets, 'User tweets fetched successfully')
    )
})

export{
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets
}
