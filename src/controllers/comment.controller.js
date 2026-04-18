import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addComment = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    const {content} = req.body
    const newComment = await Comment.create({
        content:content,
        video:videoId,
        owner:req.user?._id
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,newComment,'Comment added successfully')
    )
})

const updateComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {content} = req.body

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,'Comment updated successfully')
    )
})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if(!deletedComment){
        throw new ApiError(400,"Didn't found comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},'Comment deleted successfully')
    )
})

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    const { page = 1, limit = 10 } = req.query

    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    const comments = await Comment.find({ video: videoId })
        .populate('owner', 'name profilePic')
        .sort({ createdAt: -1 }) // newest first
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)

    const totalComments = await Comment.countDocuments({ video: videoId })

    return res.status(200).json(
        new ApiResponse(200, {
            comments,
            totalComments,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalComments / limitNumber)
        }, 'Comments fetched successfully')
    )
})

export{
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}