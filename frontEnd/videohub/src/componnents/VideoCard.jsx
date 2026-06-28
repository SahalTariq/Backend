

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import PlaylistModal from "../componnents/CreatePlaylistModal";
import { useNavigate } from "react-router-dom";

// VideoCard.jsx
export default function VideoCard({ video }) {

  const navigate = useNavigate();


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
              e.target.src = "https://via.placeholder.com/32"; 
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

      </div>
    </div>
  );
}