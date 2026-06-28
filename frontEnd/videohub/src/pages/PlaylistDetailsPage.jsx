import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylistById,
  removeVideoFromPlaylist,
} from "../features/playlistSlice.js";

import { useParams } from "react-router-dom";

const PlaylistDetailsPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();

  const { currentPlaylist } = useSelector((state) => state.playlist);

  

  useEffect(() => {
    dispatch(fetchPlaylistById(playlistId));
  }, [playlistId, dispatch]);

  if (!currentPlaylist) {
    return <p className="text-white p-4">Loading...</p>;
  }

   console.log("my current Playlist is" , currentPlaylist);
console.log("my current Playlist videos is ",currentPlaylist.videos);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">
            {currentPlaylist.name}
        </h1>

        <p className="text-gray-400 mb-4">
            {currentPlaylist.description}
        </p>

        <div className="space-y-3">
            {currentPlaylist.videos?.map((video) => (
    <div
        key={video?._id || video}
        className="flex items-center gap-4 bg-zinc-900 p-3 rounded"
    >
        <img
        src={video.thumbnail}
        alt={video.title}
        className="w-40 h-24 object-cover rounded"
        />

        <div className="flex-1">
        <h3 className="font-semibold">
            {video.title}
        </h3>

        <p className="text-sm text-gray-400">
            {video.views} views
        </p>
        </div>

        <button
        onClick={() =>
            dispatch(
            removeVideoFromPlaylist({
                playlistId,
                videoId: video._id,
            })
            )
        }
        className="text-red-500"
        >
        Remove
        </button>
    </div>
    ))}
      </div>
    </div>
  );
};

export default PlaylistDetailsPage;