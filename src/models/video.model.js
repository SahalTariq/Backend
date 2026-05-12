
import mongoose from "mongoose"

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    videoFile: {
      type: String,  // Cloudinary URL
      required: true
    },
    thumbnail: {
      type: String,  
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    duration: {
      type: Number,  
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

export const Video = mongoose.model("Video", videoSchema)