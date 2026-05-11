// import mongoose from "mongoose";
// // const mongoose = require('mongoose')
// import { Schema } from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// // import aggregatePaginate from "mongoose-aggregate-paginate-v2";
// // const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')

// const videoSchema = new mongoose.Schema ({
//     videoFile:{
//         type:String, // Cloudinary URL
//         required:true,

//     },
//     // thumbnail:{
//     //     type:String, // Cludinary URL
//     //     required:true
//     // },
//     thumbnail: {
//            url: String,
//            public_id: String
//        },
//     owner:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User'
//     },
//     title:{
//         type:String,
//         required:true
//     },
//     description:{
//         type : String,
//         required : true
//     },
//     duration:{
//         type :String,
//         required:true
//     },
//     views:{
//         type:Number,
//         default:0
//     },
//     isPublished:{
//         type:Boolean,
//         default:true
//     }

// },
//     {

//     timestamps:true

//     }
// )

// videoSchema.plugin(mongooseAggregatePaginate)
// // videoSchema.plugin(aggregatePaginate);


// export const Video = mongoose.model('Video',videoSchema)


// video.model.js - USE THIS VERSION (simpler)
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
      type: String,  // Cloudinary URL (make it simple string)
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    duration: {
      type: Number,  // Keep as number, convert in controller
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