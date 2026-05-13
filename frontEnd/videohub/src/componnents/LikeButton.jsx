import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleVideoLike, getLikedVideos } from "../features/likeSlice";

export default function LikeButton({ videoId, initialLiked = false }) {
  const dispatch = useDispatch();
  const { likedStatus, loading: globalLoading } = useSelector((state) => state.like);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  // Get like status from Redux store
  useEffect(() => {
    if (likedStatus[videoId]) {
      setIsLiked(likedStatus[videoId].liked);
    }
  }, [likedStatus, videoId]);

  const handleLike = async () => {
    setIsLoading(true);
    const result = await dispatch(toggleVideoLike(videoId));
    if (result.payload) {
      setIsLiked(result.payload.liked);
      // Refresh liked videos list
      dispatch(getLikedVideos());
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 px-3 py-1 rounded transition ${
        isLiked
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      <span className="text-lg">
        {isLiked ? "❤️" : "🤍"}
      </span>
      <span className="text-sm">
        {isLiked ? "Liked" : "Like"}
      </span>
    </button>
  );
}