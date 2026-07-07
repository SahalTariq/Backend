
import VideoCard from "../componnents/VideoCard"
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getVideos } from "../features/videoSlice.js";
import { useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL;



export default function Home({search}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos using fetch() API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/videos/`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        
        const data = await response.json();
        setVideos(data.videos || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array - runs once on mount

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  const filteredVideos = videos.filter((video) =>
  video.title.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div >
      
      <div className="flex gap-2 flex-wrap mb-5">
        {["All", "Music", "Gaming", "Tech", "Education"].map((c, i) => (
          <span
            key={i}
            className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition
              ${i === 0 ? "bg-accent text-white border-accent" : "bg-bg3 text-text2 border-border hover:bg-accent hover:text-white"}`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recommended Videos</h2>
        <span className="text-accent text-sm cursor-pointer">See all →</span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 
      scrollbar-thin
            scrollbar-thumb-zinc-600
            scrollbar-track-transparent

            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-zinc-600
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500
      ">
        {videos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        ) : (
          <p className="text-white col-span-full text-center">No videos found</p>
        )}
      </div>
    </div>
  );
}

