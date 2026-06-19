

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LikeButton from "../componnents/LikeButton";
// import AddToPlaylistButton from "./AddToPlaylistButton";
import { useNavigate } from "react-router-dom";

// VideoCard.jsx
export default function VideoCard({ video }) {

  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate();


  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const isLoggedIn = !!user._id;
  
  // Check if video is liked (you can get from like slice or video data)
  const [isLiked, setIsLiked] = useState(false);
  
  // You can check if current video is in likedVideos list
  const { likedVideos } = useSelector((state) => state.like);
  
  useEffect(() => {
    if (likedVideos && likedVideos.length > 0) {
      const found = likedVideos.find(v => v._id === video._id);
      setIsLiked(!!found);
    }
  }, [likedVideos, video._id]);

  return (
    <div className=" bg-bg2 border border-border rounded-lg overflow-hidden cursor-pointer transition hover:scale-[1.02] hover:border-text3">
      {/* Thumbnail */}
      <div className="aspect-video bg-bg4 relative cursor-pointer"
      onClick={() => navigate(`/watch/${video._id}`)}
      >
        <img
          src={video.thumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover"
        />
        {/* duration */}
        <div className="absolute bottom-2 right-2 text-[10px] bg-black/80 px-1 rounded text-white">
          {video.duration}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex gap-2">
          {/* channel avatar */}
          <img
            src={video.owner?.avatar}
            className="w-8 h-8 rounded-full bg-bg4 object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/32"; // Fallback avatar
            }}
          />
          <div>
            <h3 className="text-sm font-medium leading-tight text-white">
              {video.title}
            </h3>
            <p className="text-xs text-text2">
              {video.owner?.username || "Unknown"} · {video.views || 0} views · {video.createdAtAgo || "just now"}
            </p>
          </div>
        </div>

            {/* Action Buttons */}

             <div className="flex gap-2 mt-3">
            <LikeButton videoId={video._id} initialLiked={isLiked} />
            {/* <AddToPlaylistButton videoId={video._id} /> */}
          </div>

        {/* {isLoggedIn && (
          <div className="flex gap-2 mt-3">
            <LikeButton videoId={video._id} initialLiked={isLiked} />
            
          </div>
        )} */}

        {/* <button onClick={() => setShowModal(true)}>
          Save
        </button> */}

        {/* {showModal && (
          <PlaylistModal
            videoId={video._id}
            onClose={() => setShowModal(false)}
          />
        )} */}

      </div>
    </div>
  );
}