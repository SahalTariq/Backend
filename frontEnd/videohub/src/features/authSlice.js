import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../app/api.js";
import { fetchWithAuth } from "../app/fetchWithAuth.js";

const backendUrl = import.meta.env.VITE_API_URL;

//  Async thunk RegisterUser
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const response = await apiService.register(formData);
      return response;
    } catch (error) {
      
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//  Async thunk LoginUser

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async(formData,thunkAPI) => {
    try {
      const response = await apiService.login(formData)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)


export const logoutUserApi = async () => {

  const res = await fetchWithAuth(`${backendUrl}/users/logout`, {
    method: "POST",
  });

 if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
}

return await res.json();
};


export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await fetchWithAuth(
        `${backendUrl}/users/current-user`,
        {
          method: "GET",
        },
         false // ← Don't redirect to login
      );

      if (res.status === 401) {
        return null;
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
  user: null,
  loading: true,
  error: null,
  success: false,
},
  
  reducers: {
     clearAuthState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;
      state.loading = false;

    }
   
  },
  extraReducers: (builder) => {
    // Register
    builder
      //  Pending
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //  Success
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.user = action.payload.user;
      })

      //  Error
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Login

      .addCase(loginUser.pending,(state)=>{
        state.loading = true,
        state.error = null
      })

      .addCase(loginUser.fulfilled,(state,action)=>{
        state.loading = false;
        state.success = true;
        state.user = action.payload.data.user;
        
      })

      .addCase(loginUser.rejected,(state,action)=>{
        state.loading = false,
        state.error = action.payload,
        state.user = null;
        state.success = false;
      })

            .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || null;
      })

      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
  },
});


export const { clearAuthState, clearUser } = authSlice.actions;
export default authSlice.reducer;