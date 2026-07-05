const API_BASE_URL = "http://localhost:8000/api/v1/users";
import { fetchWithAuth } from "./fetchWithAuth.js";

export const apiService = {
  register: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      body: formData,
    });

    //  Debug first
    const text = await response.text();
    // console.log("RAW RESPONSE:", text);

    if (!response.ok) {
      throw new Error("User already Rigistered!");
    }

    // convert manually after debug
    return JSON.parse(text);
  },

  login: async (userData) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    credentials: "include",
     headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
},



};


const API_BASE_URL_Videos = "http://localhost:8000/api/v1/videos";
const authVideosAPi = "/videos";

export const apiServiceVideos = {
  uploadVideo: async (formData) => {
    const response = await fetchWithAuth(`${authVideosAPi}/`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  },

  getVideos: async () => {
  const response = await fetch(`${API_BASE_URL_Videos}/`,{
    method:"GET"

  });
 
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    return data;
}
};