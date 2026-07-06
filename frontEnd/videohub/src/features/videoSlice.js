import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiServiceVideos } from "../app/api.js";
import { fetchWithAuth } from "../app/fetchWithAuth.js";

const backendUrl = import.meta.env.VITE_API_URL;

// Upload video with authentication
export const uploadVideo = createAsyncThunk(
  "video/uploadVideo",
  async (formData, { rejectWithValue }) => {
    try {
      
      const response = await fetchWithAuth(`${backendUrl}/videos/`, {
        method: "POST",
        body: formData,
        
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Upload failed");
      }

      return data;
    } catch (error) {
      console.error("Upload error:", error);
      return rejectWithValue(error.message);
    }
  }
);


// Get all videos using fetch
export const getVideos = createAsyncThunk(
  "video/getVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendUrl}/videos`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch videos");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// const API = "http://localhost:8000/api/v1/videos/my-videos";

export const getMyVideos = createAsyncThunk(
  "videos/getMyVideos",
  async (_, { rejectWithValue }) => {

    try {
      const res = await fetchWithAuth(`${backendUrl}/videos/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Error details:", data);

      if (!res.ok) return rejectWithValue(data);

      return data.videos;
    } catch (err) {
      console.log("Fetch error:", err);
      return rejectWithValue(err.message);
    }
  }
);


const videoSlice = createSlice({
  name: "video",  
  initialState: {
    videos: [], 
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetVideoState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload video cases
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadVideo.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Get videos cases
      .addCase(getVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.videos || [];
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(getMyVideos.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetVideoState } = videoSlice.actions;
export default videoSlice.reducer;