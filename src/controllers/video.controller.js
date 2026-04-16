import asyncHandler from "../utils/asyncHandler";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from "../models/Video.js";
import { isValidObjectId } from "mongoose";

const publishVideo = asyncHandler(async(req,res) => {
     const {title,description} = req.body
    // Access uploaded video file from req.file
    const videoFileLocalPath = req.file?.videoFile
    const thumbnailLocalPath = req.file?.thumbnail

    if(!videoFileLocalPath){
        throw new ApiError(400,'Video file is missing')
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400,'Thumbnail file is missing')
    }

   const videoFileCloudinaryPath = await uploadOnCloudinary(videoFileLocalPath)
   const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath)

   if(!videoFileCloudinaryPath){
    throw new ApiError(400,'Error while uploading video on cloudinary')
   }
   if(!thumbnailCloudinaryPath){
    throw new ApiError(400,'Error while uploading thumbnail on cloudinary')
   }

   const uploadedVideo = await Video.create({
    title:title,
    description:description,
    videoFile:videoFileCloudinaryPath?.url,
    videoPublicId: videoFileCloudinaryPath?.public_id,
    owner:req.user?._id,
    thumbnail:thumbnailCloudinaryPath?.url,
    thumbnailPublicId: thumbnailCloudinaryPath?.public_id
   })

   if(!uploadedVideo){
    throw new ApiError(500,'Error while creating video in database')
   }


   res
   .status(200)
   .json(
    new ApiResponse(200,uploadedVideo,'Video published successfully')
   )

})

const getVideoById = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId?.trim()){
        throw new ApiError(400,'videoId is missing')
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid videoId')
    }

    const video = await Video.findById(videoId)
     .populate('owner','username email profileImage')

    if(!video){
        throw new ApiError(404,'Video not found')
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,video,'Video fetched successfully')
    )

})

const updateVideo = asyncHandler(async(req,res)=>{

    const {videoId} = req.params
    const {title,description} = req.body
    const thumbnail = req.file?.path

    if(!videoId){
        throw new ApiError(400,'videoId is missing')
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,'Video not found')
    }

    let thumbnailUrl = video.thumbnail

    if(thumbnail){
        const uploaded = await uploadOnCloudinary(thumbnail)

        if(!uploaded){
            throw new ApiError(400,'Error uploading thumbnail')
        }

        thumbnailUrl = uploaded.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail: thumbnailUrl
            }
        },
        { new:true }
    )

    return res.status(200).json(
        new ApiResponse(200,updatedVideo,'Video updated successfully')
    )


    // const {videoId} = req.params
    // const {title,description} = req.body
    // const thumbnail = req.file?.path

    // if(!videoId?.trim()){
    //     throw new ApiError(400,'videoId is missing')
    // }

    // const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnail)
    // if(!thumbnailCloudinaryPath){
    //     throw new ApiError(400,'Error while uploading thumbnail on cloudinary')
    //  }

    //  const video = await Video.findById(videoId)

    //     const oldThumbnailUrl = video.thumbnail

    //     const updatedVideoDetails = await Video.findByIdAndUpdate(
    //         videoId,
    //         {
    //             $set:{
    //                 title:title,
    //                 description:description,
    //                 thumbnail:thumbnailCloudinaryPath?.url
    //             }
    //         },
    //         {
    //             new:true
    //         }
    //     )

    //     if(oldThumbnailUrl){
    //         fs.unlink(oldThumbnailUrl,(err)=>{
    //             if(err){
    //                 throw new ApiError(500,'Error while deleting old thumbnail from server')
    //             }
    //         })
    //     }

    //     return res
    //     .status(200)
    //     .json(
    //         new ApiResponse(200,updatedVideoDetails,'Video Details updated successfully')
    //     )   




    // const {videoIdLocalPath} = req.file?.path

    // if(!videoIdLocalPath){
    //     throw new ApiError(400,'videoId is missing')
    // }

    // const video = await uploadOnCloudinary(videoIdLocalPath)

    // if(!video){
    //     throw new ApiError(400,'Error while uploading video on cloudinary')
    // }

    // const user = await Video.findById(req.user?._id)

    // const oldVideoUrl = user.videoFile?.url
    // const updatedVideo = await Video.findByIdAndUpdate(
    //     req.user?._id,

    //     {
    //         $set:{
    //             videoFile:video?.url
    //         }
    //     },

    //     {
    //         new:true
    //     }

    // )

    // if(oldVideoUrl){
    //     fs.unlink(oldVideoUrl,(err)=>{
    //         if(err){
    //             throw new ApiError(500,'Error while deleting old video from server')
    //         }
    //     })
    // }

    // return res
    // .status(200)
    // .json(
    //     new ApiResponse(200,updatedVideo,'Video updated successfully')
    // )


})

const deleteVideo = asyncHandler(async(req,res)=>{
   const {videoId} = req.params

   if(!isValidObjectId(videoId)){
      throw new ApiError(400,'Invalid videoId')
   }

   const video = await Video.findById(videoId)

   if(!video){
      throw new ApiError(404,'Video not found')
   }

   //  Authorization check
   if(video.owner.toString() !== req.user._id.toString()){
      throw new ApiError(403,'Unauthorized')
   }

   //  Delete video from Cloudinary
   if(video.videoPublicId){
      await deleteFromCloudinary(video.videoPublicId,"video")
   }

   //  Delete thumbnail from Cloudinary
   if(video.thumbnailPublicId){
      await deleteFromCloudinary(video.thumbnailPublicId,"image")
   }

   //  Delete from DB
   await Video.findByIdAndDelete(videoId)

   return res.status(200).json(
      new ApiResponse(200,{},'Video deleted successfully')
   )
})

const deleteThumbnail = asyncHandler(async(req,res)=>{
    const {videoId} = req.params
    
    if(!isValidObjectId(videoId)){
    throw new ApiError(400,'Invalid videoId')
   }

   
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,'Video not found')
    }

    // authorization check
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,'Unauthorized')
    }

    if(video.thumbnail){
        await deleteFromCloudinary(video.thumbnail)
    }

    // remove thumbnail from DB
    video.thumbnail = ""

    await video.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},'Thumbnail deleted successfully')
    )
})



const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query

  const pageNumber = parseInt(page)
  const limitNumber = parseInt(limit)

  // aggregation pipeline
  const aggregate = await Video.aggregate([
    {
      $sort: { createdAt: -1 } // latest videos first
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails"
      }
    },
    {
      $unwind: "$ownerDetails"
    },
    {
      $project: {
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        createdAt: 1,
        "ownerDetails.username": 1,
        "ownerDetails.email": 1,
        "ownerDetails.profileImage": 1
      }
    }
  ])

  // pagination using plugin
  const options = {
    page: pageNumber,
    limit: limitNumber
  }

  const videos = await Video.aggregatePaginate(aggregate, options)

  return res.status(200).json(
    new ApiResponse(200, videos, "Videos fetched successfully")
  )
})



const togglePublishStatus = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400,'videoId is missing')
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,'Video not found')
    }

    // authorization check
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,'Unauthorized')
    }

    // toggle logic
    video.isPublished = !video.isPublished

    await video.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video ${video.isPublished ? 'published' : 'unpublished'} successfully`
        )
    )
})

export{
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideos,
}