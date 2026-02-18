import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = ({
    videoFile:{
        type:String, // Cloudinary URL
        required:true,

    },
    thumbnail:{
        type:String, // Cludinary URL
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type : String,
        required : true
    },
    duration:{
        type :String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }

},
    {

    timestamps:true

    }
)

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model('Video',videoSchema)