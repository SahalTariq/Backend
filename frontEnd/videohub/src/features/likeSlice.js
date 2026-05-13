import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Toggle like on video
export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8000/api/v1/likes/toggle/v/${videoId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return { videoId, liked: data.message.includes("liked") };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all liked videos
export const getLikedVideos = createAsyncThunk(
  "like/getLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8000/api/v1/likes/videos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      return data.data || data.videos || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likedVideos: [],
    likedStatus: {}, // Store like status for each video
    loading: false,
    error: null,
  },
  reducers: {
    clearLikeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle like
      .addCase(toggleVideoLike.pending, (state, action) => {
        const videoId = action.meta.arg;
        state.likedStatus[videoId] = { loading: true, liked: false };
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        const { videoId, liked } = action.payload;
        state.likedStatus[videoId] = { loading: false, liked: liked };
        
        // Update likedVideos list
        if (liked) {
          // If liked, we'll refresh the list
          // Don't add here, let getLikedVideos handle it
        } else {
          // If unliked, remove from likedVideos
          state.likedVideos = state.likedVideos.filter(v => v._id !== videoId);
        }
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get liked videos
      .addCase(getLikedVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.likedVideos = action.payload;
        // Update liked status for all videos
        action.payload.forEach(video => {
          state.likedStatus[video._id] = { loading: false, liked: true };
        });
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLikeError } = likeSlice.actions;
export default likeSlice.reducer;