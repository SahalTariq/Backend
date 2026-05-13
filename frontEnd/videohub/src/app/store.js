import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import videoReducer from "../features/videoSlice.js"
import likeReducer from "../features/likeSlice.js";
import playlistReducer from "../features/playlistSlice.js"
import commentReducer from "../features/commentSlice.js"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    like: likeReducer,
    playlist:playlistReducer,
    comments: commentReducer
  },
});