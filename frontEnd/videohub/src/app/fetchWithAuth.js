import { clearUser } from "../features/authSlice.js";
// import {useNavigate} from "react-router-dom";

const API_BASE = "http://localhost:8000/api/v1";

export const fetchWithAuth = async (url, options = {},redirectOnFail = true) => {

  // const navigate = useNavigate();


  // First request
  let response = await fetch(url, {
    ...options,
    credentials: "include",
    cache:"no-store",
    headers: {
      ...(options.headers || {}),
    },
  });

  // Access token expired
  if (response.status === 401 && redirectOnFail) {

    const refreshResponse = await fetch(`${API_BASE}/users/refresh-token`, {
      method: "POST",
      credentials: "include",
      
    });

    if (!refreshResponse.ok) {
    if (redirectOnFail) {
      // dispatch(clearUser());

      // navigate("/login");
        window.location.href = "/login";
    }

    throw new Error("Session expired");
  }

   

    // Retry original request
    response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        
      },
    });
  }

  return response;
};