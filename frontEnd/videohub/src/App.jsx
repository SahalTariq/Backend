
import Layout from "./layout/Layout"
import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { uploadVideo } from "./features/videoSlice";
import UploadVideo from "./pages/uploadVideo";
import LikedVideos from "./pages/LikedVideos";
import PlaylistPage from "./pages/PlaylistPage";
import CommentsPage from "./pages/CommentsPage";
import ProfilePage from "./pages/ProfilePage"
import PrivateRoute from "./componnents/PrivateRoute";




function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Pages (NO Sidebar) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

         <Route path="/*" element={<Layout />} />

        <Route path="/profile"
           element={
           <PrivateRoute>
               <ProfilePage />
           </PrivateRoute>
  }
         />
        <Route path="/allcomments" element={<CommentsPage />} />

        {/* Dashboard Layout */}
       
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

        <Route path="/playlist/:playlistId" element={<PlaylistPage />} />

        
        

        
        
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
