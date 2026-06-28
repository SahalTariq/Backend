import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:8000/api/v1/playlists";

/* =========================
   GET USER PLAYLISTS
========================= */
export const fetchUserPlaylists = createAsyncThunk(
  "playlist/fetchUserPlaylists",
  async (userId, thunkAPI) => {
    try {
      console.log("Fetching playlists for user:", userId);
      const token = localStorage.getItem("token");
      console.log("Token in fetchUserPlaylists:", token);
      const res = await fetch(`${BASE_URL}/user/${userId}`, {
        method: "GET",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   CREATE PLAYLIST
========================= */
export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async ({ name, description }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        credentials: "include",
        headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
           },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Update Playlist

export const updatePlaylist = createAsyncThunk(
  "playlist/updatePlaylist",
  async ({ playlistId, name, description }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/${playlistId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message
      );
    }
  }
);

// Delete Playlist

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (playlistId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/${playlistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message);

      return playlistId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message
      );
    }
  }
);

/* =========================
   GET PLAYLIST BY ID
========================= */
export const fetchPlaylistById = createAsyncThunk(
  "playlist/fetchPlaylistById",
  async (playlistId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/${playlistId}`, {
        method: "GET",
        // credentials: "include",
        headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
           },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      console.log("PLAYLIST API RESPONSE:", data);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   ADD VIDEO
========================= */
export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideo",
  async ({ playlistId, videoId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/add/${videoId}/${playlistId}`,
        {
          method: "PATCH",
          // credentials: "include",
          headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "application/json",
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   REMOVE VIDEO
========================= */
export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideo",
  async ({ playlistId, videoId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/remove/${videoId}/${playlistId}`,
        {
          method: "PATCH",
          // credentials: "include",
          headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
           },

        });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);




/* =========================
   SLICE
========================= */
const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    playlists: [],
    currentPlaylist: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* GET USER PLAYLISTS */
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE PLAYLIST */
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.playlists.unshift(action.payload);
      })

      /* GET PLAYLIST BY ID */
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
      })

      /* ADD VIDEO */
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
      })

      /* REMOVE VIDEO */
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
      })


            /* UPDATE PLAYLIST */
      .addCase(updatePlaylist.fulfilled, (state, action) => {

          state.playlists = state.playlists.map(
              (playlist) =>
                  playlist._id === action.payload._id
                      ? action.payload
                      : playlist
          );

          if (
              state.currentPlaylist?._id ===
              action.payload._id
          ) {
              state.currentPlaylist =
                  action.payload;
          }
      })

              /* DELETE PLAYLIST */
        .addCase(deletePlaylist.fulfilled, (state, action) => {

            state.playlists =
                state.playlists.filter(
                    (playlist) =>
                        playlist._id !== action.payload
                );

            if (
                state.currentPlaylist?._id ===
                action.payload
            ) {
                state.currentPlaylist = null;
            }
        })

      

      
  },
});

export default playlistSlice.reducer;