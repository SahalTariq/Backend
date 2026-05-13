import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../app/api.js";

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
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8000/api/v1/users/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  return data;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {

  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("authToken") || null,
  loading: false,
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
      state.success = false;
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
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

        // Save to localStorage so user stays logged in on refresh
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
        if (action.payload.data.accessToken) {
          localStorage.setItem("authToken", action.payload.data.accessToken);
        }

        
      })

      .addCase(loginUser.rejected,(state,action)=>{
        state.loading = false,
        state.error = action.payload
      })
  },
});


export const { clearAuthState, clearUser } = authSlice.actions;
export default authSlice.reducer;