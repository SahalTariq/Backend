
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLikedVideos } from "../features/likeSlice";
import VideoCard from "../componnents/VideoCard";
import Topbar from "../layout/Topbar";
import Sidebar from "../layout/Sidebar";

export default function LikedVideos() {
  const dispatch = useDispatch();
  const { likedVideos, loading, error } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(getLikedVideos());
  }, [dispatch]);

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      
      {/*  TOPBAR (FIXED) */}
      <div className="fixed top-0 left-0 w-full h-14 z-50 bg-gray-900 border-b border-gray-700">
        <Topbar />
      </div>

      <div className="flex pt-14 h-full">
        
        {/* (FIXED + SCROLLABLE) */}
        {/* <div className="hidden md:block fixed top-14 left-0  overflow-y-auto"> */}
          <Sidebar />
        {/* </div> */}

        {/* 📺 MAIN CONTENT (SCROLLABLE) */}
        <div className="flex-1 md:ml-64 h-[calc(100vh-56px)] overflow-y-auto px-4 py-6">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Liked Videos</h1>
            <p className="text-gray-400 mt-1">
              {likedVideos.length}{" "}
              {likedVideos.length === 1 ? "video" : "videos"} you've liked
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <p className="text-lg">Loading liked videos...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex justify-center items-center min-h-[300px]">
              <p className="text-red-400 text-lg">Error: {error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && likedVideos.length === 0 && (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-gray-400 text-lg mb-2">
                No liked videos yet
              </p>
              <p className="text-gray-500 text-sm">
                Videos you like will appear here
              </p>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && likedVideos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {likedVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}