const API_BASE_URL = "http://localhost:8000/api/v1/users";

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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  // const text =  await response.text()
  // console.log("Texted",text)

  const data = await response.json();

   if (response.ok) {
      // Store the token - adjust according to your API response structure
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("token", data.data.accessToken); // Store both formats
      localStorage.setItem("user", JSON.stringify(data.data.user));
      
    }

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
},



};


const API_BASE_URL_Videos = "http://localhost:8000/api/v1/videos";

export const apiServiceVideos = {
  uploadVideo: async (formData) => {
    const response = await fetch(`${API_BASE_URL_Videos}/`, {
      method: "POST",
      body: formData,
      credentials: "include", //  important for JWT cookies
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
 // ❗ handle HTML error (your previous issue)
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    return data;
}
};