import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addComment = asyncHandler(async (req, res) => {

  const { videoId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment is required");
  }

    if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate("owner", "username avatar");

  return res.status(201).json(
    new ApiResponse(
      201,
      populatedComment,
      "Comment added successfully"
    )
  );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (
    comment.owner.toString() !==
    req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You can only edit your own comment."
    );
  }

  comment.content = content;

  await comment.save();

  const updatedComment = await Comment.findById(
    comment._id
  ).populate("owner", "username avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedComment,
      "Comment updated successfully"
    )
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (
    comment.owner.toString() !==
    req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You can only delete your own comment."
    );
  }

  await comment.deleteOne();

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Comment deleted"
    )
  );
});

const getVideoComments = asyncHandler(async (req, res) => {
  console.log("✅ GET VIDEO COMMENTS HIT");
  
  const { Id } = req.params;

  // No authentication check needed - public access
  const comments = await Comment.find({
    video: Id,
  })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      comments,
      "Comments fetched successfully"
    )
  );
});
// controllers/comment.controller.js

// const getAllComments = asyncHandler(async (req, res) => {
//   const comments = await Comment.find()
//     .populate("owner", "name profilePic")
//     .populate("video", "title") // 👈 IMPORTANT (gets video title)
//     .sort({ createdAt: -1 });

//   return res.status(200).json(
//     new ApiResponse(200, comments, "All comments fetched successfully")
//   );
// });

// controllers/comment.controller.js

const getComments = asyncHandler(async (req, res) => {
  console.log("Controller Hits");

  const comments = await Comment.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: {
        path: "$videoDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: {
        path: "$ownerDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$video",
        videoTitle: {
          $first: { $ifNull: ["$videoDetails.title", "Unknown Video"] },
        },
        comments: {
          $push: {
            _id: "$_id",
            content: "$content",
            owner: {
              $ifNull: ["$ownerDetails.username", "Unknown User"],
            },
          },
        },
        totalComments: { $sum: 1 },
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    data: comments,
  });
});
export{
    addComment,
    updateComment,
    deleteComment,
    getVideoComments,
    getComments
}