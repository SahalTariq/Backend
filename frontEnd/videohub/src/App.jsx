
import Layout from "./layout/Layout"
import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadVideo from "./pages/uploadVideo";
import LikedVideos from "./pages/LikedVideos";
import PlaylistsPage from "./pages/PlaylistsPage"
import PlaylistDetailsPage from "./pages/PlaylistDetailsPage"
import ProfilePage from "./pages/ProfilePage"
import PrivateRoute from "./componnents/PrivateRoute";
import WatchVideo from "./pages/WatchVideo";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./features/authSlice.js";




function App() {

  const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getCurrentUser());
    }, [dispatch]);

  return (
      
    <BrowserRouter>

     <Toaster position="top-right" />
     
      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

         <Route path="/*" element={<Layout />} />

          <Route path="/watch/:id" element={<WatchVideo />} />

        <Route path="/profile"
           element={
           <PrivateRoute>
               <ProfilePage />
           </PrivateRoute>
  }
         />
        
       
        <Route path="/upload" 
        element={
          <PrivateRoute>
            <UploadVideo/>
          </PrivateRoute>
        }
        />

        <Route path="/liked-videos"
        element={
          <PrivateRoute>
            <LikedVideos/>
          </PrivateRoute>
        }
        />


        <Route path="/playlists" element={<PlaylistsPage />} />
          <Route
            path="/playlists/:playlistId"
            element={<PlaylistDetailsPage />}
          />     

      </Routes>
    </BrowserRouter>

    
  );
}

export default App;
