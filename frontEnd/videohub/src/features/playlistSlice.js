import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../app/fetchWithAuth.js";

const BASE_URL = "http://localhost:8000/api/v1/playlists";

/* =========================
   GET USER PLAYLISTS
========================= */
export const fetchUserPlaylists = createAsyncThunk(
  "playlist/fetchUserPlaylists",
  async (userId, thunkAPI) => {
    try {
      const res = await fetchWithAuth(`${BASE_URL}/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();


      if (!res.ok) throw new Error(data.message);

      console.log("User Id in fetchUserPlaylist slice", userId);
      console.log("Fetched Playlists:", data.data);

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
     
      const res = await fetchWithAuth(`${BASE_URL}/`, {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
           },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();
      console.log("Created Playlist:", data.data._id);
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

      const res = await fetchWithAuth(
        `${BASE_URL}/${playlistId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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
      const res = await fetchWithAuth(
        `${BASE_URL}/${playlistId}`,
        {
          method: "DELETE",
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
      const res = await fetchWithAuth(`${BASE_URL}/${playlistId}`, {
        method: "GET",
        headers: {
           "Content-Type": "application/json",
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
      const res = await fetchWithAuth(
        `${BASE_URL}/add/${videoId}/${playlistId}`,
        {
          method: "PATCH",
          headers: {
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
      const res = await fetchWithAuth(
        `${BASE_URL}/remove/${videoId}/${playlistId}`,
        {
          method: "PATCH",
          headers: {
           "Content-Type": "application/json",
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