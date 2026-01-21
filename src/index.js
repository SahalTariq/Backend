
// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import connectDB from './db/dbConnect.js';
// import connectDB from "./db/dbConnect.js";


dotenv.config({
    path:'./env'
})



connectDB()






// import { DB_NAME } from "./constants";

// import express from 'express'

// const app = express()

// (async()=>{
//     try{

//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error",(error)=>{
//         console.log('error',error);
//         throw error
//     })

//     app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port ${process.env.PORT}`);
//     })

//     } catch (error){
//         console.error('Error',error)

//         throw error
//     }
// })()