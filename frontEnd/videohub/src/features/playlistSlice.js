import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as api from "../app/playlistApi.js"

export const fetchPlaylists = createAsyncThunk(
  "playlist/fetch",
  async ({ userId, token }) => {
    const res = await api.getUserPlaylists(userId, token)
    return res.data
  }
)

export const createPlaylist = createAsyncThunk(
  "playlist/create",
  async ({ data, token }) => {
    const res = await api.createPlaylistApi(data, token)
    return res.data
  }
)

export const toggleVideo = createAsyncThunk(
  "playlist/toggle",
  async ({ playlistId, videoId, exists, token }) => {
    await api.toggleVideoApi(playlistId, videoId, exists, token)
    return { playlistId, videoId, exists }
  }
)

export const fetchPlaylistById = createAsyncThunk(
  "playlist/getOne",
  async (id) => {
    const res = await api.getPlaylistByIdApi(id)
    return res.data
  }
)

const slice = createSlice({
  name: "playlist",
  initialState: {
    playlists: [],
    currentPlaylist: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.playlists = action.payload
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.playlists.push(action.payload)
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload
      })
  }
})

export default slice.reducer