import { isValidObjectId } from "mongoose"
// import {asyncHandler} from "../utils/asyncHandler.js"
import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import mongoose from "mongoose"

const getChannelVideos = asyncHandler(async (req, res) => {
  const  channelId  = req.user._id

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId")
  }

  const videos = await Video.find({
    owner: channelId,
    isPublished: true
  })
    .sort({ createdAt: -1 })

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      videos,
      "Channel videos fetched successfully"
    )
  )
})

const getChannelStats = asyncHandler(async (req, res) => {
  const  channelId  = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  // 1. Total Videos
  const totalVideos = await Video.countDocuments({
    owner: channelId
  });

  // 2. Total Views
  const viewsResult = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId)
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" }
      }
    }
  ]);

  const totalViews = viewsResult[0]?.totalViews || 0;

  // 3. Total Subscribers
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId
  });

  // 4. Total Likes (on channel videos)
  const likesResult = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoData"
      }
    },
    {
      $unwind: "$videoData"
    },
    {
      $match: {
        "videoData.owner": new mongoose.Types.ObjectId(channelId)
      }
    },
    {
      $count: "totalLikes"
    }
  ]);

  const totalLikes = likesResult[0]?.totalLikes || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
      },
      "Channel stats fetched successfully"
    )
  );
});

export{
    getChannelVideos,
    getChannelStats
}