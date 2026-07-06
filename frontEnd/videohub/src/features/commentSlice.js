import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../app/fetchWithAuth.js";

const backendUrl = import.meta.env.VITE_API_URL;

// const API = "http://localhost:8000/api/v1/comments";
 const API = `${backendUrl}/comments`;


// ======================
// GET COMMENTS
// ======================

export const getComments = createAsyncThunk(
  "comments/getComments",
  async (Id, { rejectWithValue }) => {
    console.log("getComments Thunk Hit with Id:", Id);
    try {
      const res = await fetch(`${API}/${Id}`);

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ======================
// ADD COMMENT
// ======================

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
    
      console.log("VideoId in addComment:", videoId);
      const res = await fetchWithAuth(`${API}/${videoId}`, {
        method: "POST",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ======================
// UPDATE COMMENT
// ======================

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {

      const res = await fetchWithAuth(`${API}/${commentId}`, {
        method: "PATCH",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ======================
// DELETE COMMENT
// ======================

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {

      const res = await fetchWithAuth(`${API}/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.message);
      }

      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ======================
// SLICE
// ======================

const commentSlice = createSlice({
  name: "comments",

  initialState: {
    comments: [],
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET COMMENTS
      .addCase(getComments.pending, (state) => {
        state.loading = true;
      })

      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })

      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD COMMENT
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        state.success = true;
      })

      // UPDATE COMMENT
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );

        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })

      // DELETE COMMENT
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      });
  },
});

export const { resetSuccess } = commentSlice.actions;

export default commentSlice.reducer;