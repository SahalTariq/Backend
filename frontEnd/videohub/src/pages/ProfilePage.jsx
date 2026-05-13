import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyVideos } from "../features/videoSlice.js";
import Topbar from "../layout/Topbar.jsx";
import Sidebar from "../layout/Sidebar.jsx";


export default function ProfilePage() {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.auth); // assuming auth slice
  console.log("User",user)

  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    dispatch(getMyVideos());
  }, [dispatch]);

  return (
  <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

    {/* TOPBAR */}
    <div className="fixed top-0 left-0 md:left-56 right-0 z-30 bg-gray-950">
      <Topbar />
    </div>

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full md:ml-56 pt-20">

        <div className="w-full max-w-full px-3 sm:px-4 md:px-6">

          {/* PROFILE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">

            <img
              src={user?.avatar}
              alt="avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0"
            />

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                {user?.username}
              </h2>

              <p className="text-gray-400 text-sm sm:text-base break-all">
                {user?.email}
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-6 border-b border-gray-700 mb-6 overflow-x-auto no-scrollbar">

            <button
              onClick={() => setActiveTab("videos")}
              className={`pb-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === "videos"
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-gray-400"
              }`}
            >
              Videos
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`pb-2 whitespace-nowrap text-sm sm:text-base ${
                activeTab === "about"
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-gray-400"
              }`}
            >
              About
            </button>

          </div>

          {/* VIDEOS TAB */}
          {activeTab === "videos" && (
            <div>
              {loading ? (
                <p className="text-center text-gray-400">
                  Loading...
                </p>
              ) : videos.length === 0 ? (
                <p className="text-center text-gray-400">
                  No videos uploaded
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

                  {videos.map((video) => (
                    <div
                      key={video._id}
                      className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition duration-300"
                    >

                      <img
                        src={video.thumbnail}
                        alt="thumb"
                        className="w-full aspect-video object-cover"
                      />

                      <div className="p-3">

                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                          {video.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">
                          {video.description}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              )}
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="bg-gray-900 rounded-xl p-4">

              <h3 className="text-lg font-semibold mb-4">
                About
              </h3>

              <div className="space-y-2 text-sm sm:text-base">

                <p className="break-all">
                  <strong>Username:</strong> {user?.username}
                </p>

                <p className="break-all">
                  <strong>Email:</strong> {user?.email}
                </p>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  </div>
);
}