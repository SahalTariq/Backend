import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription} from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const toggleSubscription = asyncHandler(async(req,res)=>{
    const {channelId} = req.user?._id

    if(!channelId?.trim()){
        throw new ApiError(400,'ChannelId is missing')
    }
        if(!isValidObjectId(channelId)){
            throw new ApiError(400,'Invalid ChannelId')
        }

    // check if already subscribed

    const existingSubscription = await Subscription.findOne({
        subscriber : req.user._id,
        channel:channelId
    })

    // if exists → unsubscribe

    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res
        .status(200)
        .json(
            new ApiResponse(200,{},'Unsubscribed successfully')
        )
    }

    // if not exists → subscribe

    const newSubscription = await Subscription.create({
        subscriber : req.user._id,
        channel:channelId
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,newSubscription,'Subscribed successfully')
     )

})
// controller to return subscriber list of a channel
const getChannelSubscribers = asyncHandler(async(req,res)=>{
    const {channelId} = req.user?._id

    if(!channelId?.trim()){
        throw new ApiError(400,'ChannelId is missing')
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400,'Invalid ChannelId')
    }

    if(req.user._id.toString() === channelId){
        throw new ApiError(400,'You cannot subscribe to yourself')
    }

    const subscribers = await Subscription.find({
        channel : channelId
    }).populate('subscriber','username email profileImage').select('subscriber')

    return res
    .status(200)
    .json(
        new ApiResponse(200,subscribers,'Subscribers fetched successfully')
    )
})
 
// controller to return channel list to which user has subscribed

const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.user?._id

    if(!subscriberId?.trim()){
        throw new ApiError(400,'SubscriberId is missing')
    }

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,'Invalid SubscriberId')
    }

    const channels = await Subscription.find({
        subscriber: subscriberId

    }).populate('channel','username email profileImage').select('channel')

    return res
    .status(200)
    .json(
        new ApiResponse(200,channels,'Subscribed channels fetched successfully')
    )
})

export const subscriptionController = {
    toggleSubscription,
    getChannelSubscribers,
    getSubscribedChannels
}