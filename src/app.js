import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/error.middleware.js'

// routes import

import commentRouter from "./routes/comment.routes.js"
import videoRouter from './routes/video.routes.js'
import userRouter from './routes/user.routes.js'
// import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import tweetRouter from './routes/tweet.routes.js'

const app = express();


const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));



app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())



app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/tweets",tweetRouter)

// Global Error Handler (always last)
app.use(errorHandler);

export default app