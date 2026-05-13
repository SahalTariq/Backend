// src/features/commentSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = "http://localhost:8000/api/v1/comments";

// ✅ GET COMMENTS
// export const getComments = createAsyncThunk(
//   "comments/get",
//   async (videoId, { rejectWithValue }) => {
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(`${API}/${videoId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         return rejectWithValue(data);
//       }

//       console.log("GET COMMENTS:", data);

//       return data.data; // { comments: [], totalComments }
//     } catch (err) {
//       console.log("ERROR:", err);
//       return rejectWithValue(err.message);
//     }
//   }
// );

// ✅ ADD COMMENT
export const addComment = createAsyncThunk(
  "comments/add",
  async ({ videoId, content }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/${videoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      console.log("ADD COMMENT:", data);

      return data.data;
    } catch (err) {
      console.log("ERROR:", err);
      return rejectWithValue(err.message);
    }
  }
);

// ✅ DELETE COMMENT
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API}/c/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return commentId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// commentSlice.js

export const getComments = createAsyncThunk(
  "comments/getAll",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    console.log("Tokens",token)

    try {
      const res = await fetch("http://localhost:8000/api/v1/comments/allcomments", {
        method:"GET",
        headers: {
          "Content-Type": "application/json", // Add this
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response status:", res.status);

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }
      console.log("Response chcking")

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)
// export const getAllComments = createAsyncThunk(
//   "comments/getAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         return rejectWithValue(data.message || "Error fetching comments");
//       }

//       return data.data; // IMPORTANT: backend returns ApiResponse
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );
// ✅ SLICE
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    // comments: [],
    groupedComments: [],
    success: false,
    loading: false,
    error: null
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
    //   .addCase(getComments.fulfilled, (state, action) => {
    //     state.comments = action.payload.comments;
    //   })

      // ADD
      .addCase(addComment.fulfilled, (state, action) => {
        state.success = true;
        state.groupedComments.unshift(action.payload);
      })

      // DELETE
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.groupedComments = state.groupedComments.filter(
          (c) => c._id !== action.payload
        );
      })
      // get All Comments
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.groupedComments = action.payload;
        // state.comments = action.payload; 
     })

      .addCase(getComments.pending, (state) => {
      state.loading = true;
      })  

      .addCase(getComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetSuccess } = commentSlice.actions;
export default commentSlice.reducer;