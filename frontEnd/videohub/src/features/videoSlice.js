import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiServiceVideos } from "../app/api.js";

// );

// // 🔥 Get all videos
// export const getVideos = createAsyncThunk(
//   "video/getVideos",
//   async (_, thunkAPI) => {
//     try {
//       const res = await apiServiceVideos.getVideos();
//       return res.videos;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );




// // Get all videos using fetch
// export const getVideos = createAsyncThunk(
//   "video/getVideos",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://localhost:8000/api/v1/videos");
//       const data = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(data.message || "Failed to fetch videos");
//       }

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );


// export const { resetVideoState } = videoSlice.actions;
// export default videoSlice.reducer;



// features/videoSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Upload video using fetch
// export const uploadVideo = createAsyncThunk(
//   "video/uploadVideo",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token"); // Get auth token
      
//       const response = await fetch("http://localhost:8000/api/v1/videos/", {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         return rejectWithValue(data.message || "Upload failed");
//       }

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );


// Upload video with authentication
export const uploadVideo = createAsyncThunk(
  "video/uploadVideo",
  async (formData, { rejectWithValue }) => {
    try {
      // Get token from localStorage (wherever you store it after login)
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      console.log("Uploading video with token:", token ? "Token exists" : "No token found");

      const response = await fetch("http://localhost:8000/api/v1/videos", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,  // Add Bearer token
        },
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
      const response = await fetch("http://localhost:8000/api/v1/videos");
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
    const token = localStorage.getItem("authToken");
    // const token = JSON.parse(localStorage.getItem("token"));
    console.log("Token",token)

    const user = localStorage.getItem("user")
    console.log("User*:",user)

    try {
      const res = await fetch("http://localhost:8000/api/v1/videos/profile", {
        method: "GET",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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