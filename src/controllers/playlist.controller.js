
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import {Playlist} from '../models/playlist.model.js'
import { Video } from "../models/video.model.js";


const createPlaylist = asyncHandler(async(req,res)=>{
    const {name,description} = req.body


      if(!name?.trim() || !description?.trim()){
        throw new ApiError(400,'Name and description are required')
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner:req.user?._id
    })

    if(!newPlaylist){
        throw new ApiError(500,'Failed to create playlist')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,newPlaylist,'Playlist created successfully')
    )
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,'Invalid userId')
    }
    const playlists = await Playlist.find({owner:userId}).populate('videos')

    return res
    .status(200)
    .json(
        new ApiResponse(200,playlists,'User playlists fetched successfully')
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate({
      path: "videos",
      select:
        "title thumbnail views owner duration createdAt",
    });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  console.log(
  JSON.stringify(playlist, null, 2)
);


console.log(JSON.stringify(playlist, null, 2))
  return res.status(200).json(
    new ApiResponse(
      200,
      playlist,
      "Playlist fetched successfully"
    )
  );
});

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
  const {playlistId,videoId} = req.params

  if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
    throw new ApiError(400,'Invalid playlistId or videoId')
  }

  const playlist = await Playlist.findById(playlistId)
  if(!playlist){
    throw new ApiError(404,'Playlist not found')
  }

  if(playlist.videos.some(v => v.toString() === videoId)){
    throw new ApiError(400,'Video already exists in playlist')
  }


    playlist.videos.push(videoId)
    await playlist.save()
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,'Video added to playlist successfully')
    )   


})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,'Invalid playlistId or videoId')
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,'Playlist not found')
    }

    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId)
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,'Video removed from playlist successfully')
    )
})

const updatePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params
    const {name,description} = req.body

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,'Invalid playlistId')
    }
    if(!name?.trim() && !description?.trim()){
        throw new ApiError(400,'At least one field is required')
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,'Playlist not found')
    }
    // playlist.name = name
    // playlist.description = description 
    // await playlist.save()

    const updatePlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        {
            new : true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatePlaylist,'Playlist updated successfully')
    )

})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,'Invalid playlistId')
    }
   const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)
    if(!deletedPlaylist){
        throw new ApiError(404,'Playlist not found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},'Playlist deleted successfully')
    )
})



export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
}