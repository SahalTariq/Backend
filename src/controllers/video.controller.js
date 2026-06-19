// import asyncHandler from "../utils/asyncHandler";
import asyncHandler from "../utils/asyncHandler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import {Video} from "../models/Video.js";
import { Video } from "../models/video.model.js"
import { isValidObjectId } from "mongoose";

const publishVideo = asyncHandler(async(req,res) => {
     const {title,description} = req.body
    // Access uploaded video file from req.file
    const videoFileLocalPath = req.files?.videoFile[0]?.path  //req.files?.avatar[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoFileLocalPath){
        throw new ApiError(400,'Video file is missing')
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400,'Thumbnail file is missing')
    }

   const videoFileCloudinaryPath = await uploadOnCloudinary(videoFileLocalPath)
   const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath)

//    console.log('videoFileCloudinaryPath',videoFileCloudinaryPath)
//    console.log('thumbnailCloudinaryPath',thumbnailCloudinaryPath)

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
    thumbnailPublicId: thumbnailCloudinaryPath?.public_id,
    duration: videoFileCloudinaryPath.duration
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


const getMyVideos = asyncHandler(async (req, res) => {
    console.log("User Controller",req.user)
  const videos = await Video.find({ owner: req.user?._id })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    videos,
  });
});



// const getVideoById = asyncHandler(async(req,res)=>{
//     const {videoId} = req.params

//     if(!videoId?.trim()){
//         throw new ApiError(400,'videoId is missing')
//     }


//     if(!isValidObjectId(videoId)){
//         throw new ApiError(400,'Invalid videoId')
//     }

//     const video = await Video.findById(videoId)
//      .populate('owner','username email profileImage')

//     if(!video){
//         throw new ApiError(404,'Video not found')
//     }

//     res
//     .status(200)
//     .json(
//         new ApiResponse(200,video,'Video fetched successfully')
//     )

// })

// const updateVideo = asyncHandler(async(req,res)=>{

//     const {videoId} = req.params
//     const {title,description} = req.body
//     const thumbnail = req.files?.thumbnail[0]?.path

//     if(!videoId){
//         throw new ApiError(400,'videoId is missing')
//     }

//     const video = await Video.findById(videoId)

//     if(!video){
//         throw new ApiError(404,'Video not found')
//     }

//     let thumbnailUrl = video.thumbnail

//     if(thumbnail){
//         const uploaded = await uploadOnCloudinary(thumbnail)

//         if(!uploaded){
//             throw new ApiError(400,'Error uploading thumbnail')
//         }

//         thumbnailUrl = uploaded.url
//     }

//     const updatedVideo = await Video.findByIdAndUpdate(
//         videoId,
//         {
//             $set:{
//                 title,
//                 description,
//                 thumbnail: thumbnailUrl
//             }
//         },
//         { new:true }
//     )

//     return res.status(200).json(
//         new ApiResponse(200,updatedVideo,'Video updated successfully')
//     )}


//     // const {videoId} = req.params
//     // const {title,description} = req.body
//     // const thumbnail = req.file?.path

//     // if(!videoId?.trim()){
//     //     throw new ApiError(400,'videoId is missing')
//     // }

//     // const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnail)
//     // if(!thumbnailCloudinaryPath){
//     //     throw new ApiError(400,'Error while uploading thumbnail on cloudinary')
//     //  }

//     //  const video = await Video.findById(videoId)

//     //     const oldThumbnailUrl = video.thumbnail

//     //     const updatedVideoDetails = await Video.findByIdAndUpdate(
//     //         videoId,
//     //         {
//     //             $set:{
//     //                 title:title,
//     //                 description:description,
//     //                 thumbnail:thumbnailCloudinaryPath?.url
//     //             }
//     //         },
//     //         {
//     //             new:true
//     //         }
//     //     )

//     //     if(oldThumbnailUrl){
//     //         fs.unlink(oldThumbnailUrl,(err)=>{
//     //             if(err){
//     //                 throw new ApiError(500,'Error while deleting old thumbnail from server')
//     //             }
//     //         })
//     //     }

//     //     return res
//     //     .status(200)
//     //     .json(
//     //         new ApiResponse(200,updatedVideoDetails,'Video Details updated successfully')
//     //     )   

const getVideoById = asyncHandler(async (req, res) => {
  try {
   console.log("Fetching video ID:", req.params.id);
   
    const video = await Video.findById(req.params.id)
      .populate("owner", "username avatar");

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const thumbnailLocalPath = req.file?.path; // ✅ FIXED

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    let updatedThumbnail = video.thumbnail;

    if (thumbnailLocalPath) {

        const uploaded = await uploadOnCloudinary(thumbnailLocalPath);

        console.log("UPLOAD RESULT:", uploaded);

        if (!uploaded) {
            throw new ApiError(400, "Error uploading thumbnail");
        }

        if (video.thumbnail?.public_id) {
            await cloudinary.uploader.destroy(video.thumbnail.public_id);
        }

        updatedThumbnail = {
            url: uploaded.secure_url || uploaded.url,
            public_id: uploaded.public_id
        };
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: updatedThumbnail
            }
        },
        { new: true }
    );

    console.log("UPDATED VIDEO:", updatedVideo);

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});

// const deleteVideo = asyncHandler(async(req,res)=>{
//    const {videoId} = req.params

//    if(!isValidObjectId(videoId)){
//       throw new ApiError(400,'Invalid videoId')
//    }

//    const video = await Video.findById(videoId)

//    if(!video){
//       throw new ApiError(404,'Video not found')
//    }

//    //  Authorization check
//    if(video.owner.toString() !== req.user._id.toString()){
//       throw new ApiError(403,'Unauthorized')
//    }

//    //  Delete video from Cloudinary
//    if(video.videoPublicId){
//       await deleteFromCloudinary(video.videoPublicId,"video")
//    }

//    //  Delete thumbnail from Cloudinary
//    if(video.thumbnailPublicId){
//       await deleteFromCloudinary(video.thumbnailPublicId,"image")
//    }

//    //  Delete from DB
//    await Video.findByIdAndDelete(videoId)

//    return res.status(200).json(
//       new ApiResponse(200,{},'Video deleted successfully')
//    )
// })

// const deleteThumbnail = asyncHandler(async(req,res)=>{
//     const {videoId} = req.params
    
//     if(!isValidObjectId(videoId)){
//     throw new ApiError(400,'Invalid videoId')
//    }

   
//     const video = await Video.findById(videoId)

//     if(!video){
//         throw new ApiError(404,'Video not found')
//     }

//     // authorization check
//     if(video.owner.toString() !== req.user._id.toString()){
//         throw new ApiError(403,'Unauthorized')
//     }

//     if(video.thumbnail){
//         await deleteFromCloudinary(video.thumbnail)
//     }

//     // remove thumbnail from DB
//     video.thumbnail = ""

//     await video.save()

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200,{},'Thumbnail deleted successfully')
//     )
// })


const getAllVideos = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching videos...");
    
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count of published videos
    const totalVideos = await Video.countDocuments({ isPublished: true });
    // console.log("Total videos:", totalVideos);

    // Simple query without aggregation pagination
    const videos = await Video.find({ isPublished: true })
      .populate("owner", "username avatar email")  // Populate owner details
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();  // Convert to plain JavaScript objects

    // console.log("Fetched videos count:", videos.length);

    // Transform videos for frontend
    const transformedVideos = videos.map((video) => {
      // Format duration (convert seconds to MM:SS)
      let formattedDuration = "0:00";
      if (video.duration) {
        const durationNum = typeof video.duration === 'number' ? video.duration : parseInt(video.duration);
        if (!isNaN(durationNum)) {
          const minutes = Math.floor(durationNum / 60);
          const seconds = durationNum % 60;
          formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      }

      // Calculate time ago
      let createdAtAgo = "just now";
      if (video.createdAt) {
        const now = new Date();
        const createdDate = new Date(video.createdAt);
        const diffSeconds = Math.floor((now - createdDate) / 1000);
        
        if (diffSeconds < 60) createdAtAgo = "just now";
        else if (diffSeconds < 3600) createdAtAgo = `${Math.floor(diffSeconds / 60)} minutes ago`;
        else if (diffSeconds < 86400) createdAtAgo = `${Math.floor(diffSeconds / 3600)} hours ago`;
        else if (diffSeconds < 604800) createdAtAgo = `${Math.floor(diffSeconds / 86400)} days ago`;
        else createdAtAgo = `${Math.floor(diffSeconds / 604800)} weeks ago`;
      }

      // Handle thumbnail (in case it's an object)
      let thumbnailUrl = video.thumbnail;
      if (typeof video.thumbnail === 'object' && video.thumbnail !== null) {
        thumbnailUrl = video.thumbnail.url || video.thumbnail.public_id || "";
      }

      return {
        _id: video._id,
        title: video.title || "Untitled",
        description: video.description || "",
        thumbnail: thumbnailUrl || "https://via.placeholder.com/320x180",
        duration: formattedDuration,
        views: video.views || 0,
        createdAtAgo: createdAtAgo,
        owner: {
          username: video.owner?.username || "Anonymous",
          avatar: video.owner?.avatar || "https://via.placeholder.com/32",
        },
      };
    });

    // Send response
    return res.status(200).json({
      success: true,
      statusCode: 200,
      videos: transformedVideos,
      totalVideos: totalVideos,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalVideos / limitNumber),
      message: "Videos fetched successfully",
    });
    
  } catch (error) {
    console.error("Error in getAllVideos:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});


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
    // deleteVideo,
    togglePublishStatus,
    getAllVideos,
    getMyVideos
}