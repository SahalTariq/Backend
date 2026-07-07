import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import CommentSection from "../componnents/CommentSection";
import PlaylistModal from "../componnents/PlaylistModal";
import { useSelector } from "react-redux";
import LikeButton from "../componnents/LikeButton";
import { useNavigate } from "react-router-dom";


const backendUrl = import.meta.env.VITE_API_URL;

export default function WatchVideo() {

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

   const [isLiked, setIsLiked] = useState(false);
   const { likedVideos } = useSelector((state) => state.like);
   const navigate = useNavigate();

   const { id } = useParams();

   console.log("Video ID:", id);

   useEffect(() => {
    if (likedVideos && likedVideos.length > 0) {
      const found = likedVideos.find(v => v._id === id);
      setIsLiked(!!found);
    }
  }, [likedVideos, id]);

  const { user } = useSelector((state) => state.auth);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/videos/${id}`
        );

        if (!res.ok) {
          throw new Error("Video not found");
        }

        const data = await res.json();
        setVideo(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <h1>Loading...</h1>;
  if (!video) return <h1>Video not found</h1>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <video
        src={video.videoFile}
        controls
        autoPlay
        className="w-full rounded-lg"
      />

      <h1 className="text-2xl font-bold text-white mt-4">
        {video.title}
      </h1>

      <div className="flex items-center gap-3 mt-4">
       {user ? (
         <button
          onClick={() =>
            setShowPlaylistModal(true)
          }
          className="bg-zinc-800 px-4 py-2 rounded text-white hover:bg-zinc-700"
        >
          Save
        </button>
       ) : ( <p className="text-gray-400">
          🔒 Please{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 hover:underline font-medium"
          >
            login
          </button>{" "}
          to Create and Save to Playlist
        </p> )}
      </div>


      <div className="flex gap-2 mt-3">
            <LikeButton videoId={id} initialLiked={isLiked} />
      </div>


      <p className="text-gray-400 mt-2">
        {video.description}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        {video.views} views
      </p>

      <CommentSection videoId={id} />


          {showPlaylistModal && (
              <PlaylistModal
                videoId={video._id}
                onClose={() =>
                  setShowPlaylistModal(false)
                }
              />
            )}
      
    </div>
  );
}