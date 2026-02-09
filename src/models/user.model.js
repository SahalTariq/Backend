import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username :{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            index: true,

        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique: true
        },
        fullname:{
            type :String,
            required: true,

        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String,

        },
        watchHistory:[
            {
                type : Schema.Types.ObjectId,
                ref : 'Video'
            }
        ],
        password:{
            type : String,
            required:[true,'Password is Required']
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

export const User = mongoose.model('User',userSchema)