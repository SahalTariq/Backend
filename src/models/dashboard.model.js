import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    totalVideos: {
      type: Number,
      default: 0
    },

    totalViews: {
      type: Number,
      default: 0
    },

    totalLikes: {
      type: Number,
      default: 0
    },

    totalSubscribers: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Dashboard = mongoose.model("Dashboard", dashboardSchema);