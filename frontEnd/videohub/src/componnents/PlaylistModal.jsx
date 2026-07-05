import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  createPlaylist,
} from "../features/playlistSlice.js";

export default function PlaylistModal({ videoId = null , onClose }) {
  const dispatch = useDispatch();

  const { playlists } = useSelector((state) => state.playlist);
  const { user } = useSelector((state) => state.auth);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserPlaylists(user._id));
    }
  }, [dispatch, user]);

  const handleToggle = async (playlist) => {


     if (!videoId) {
    toast.error("No video selected.");
    return;
  }
  
    const exists = playlist.videos?.some(
      (video) =>
        (video._id || video).toString() === videoId
    );

    try {
      if (exists) {
        await dispatch(
          removeVideoFromPlaylist({
            playlistId: playlist._id,
            videoId,
          })
        ).unwrap();

        toast.success(
          `Video removed from ${playlist.name}`
        );
      } else {
        await dispatch(
          addVideoToPlaylist({
            playlistId: playlist._id,
            videoId,
          })
        ).unwrap();

        toast.success(
          `Video added to ${playlist.name}`
        );
      }

      dispatch(fetchUserPlaylists(user._id));
    } catch (error) {
      toast.error(error || "Operation failed");
    }
  };

   const handleCreate = async () => {
  if (!newName.trim() || !newDesc.trim()) {
    toast.error(
      "Playlist name and description are required"
    );
    return;
  }

  try {
    const playlist = await dispatch(
      createPlaylist({
        name: newName,
        description: newDesc,
      })
    ).unwrap();

    // Only add video if a valid videoId exists
    if (videoId) {
      await dispatch(
        addVideoToPlaylist({
          playlistId: playlist._id,
          videoId,
        })
      ).unwrap();

      toast.success(
        `Video added to ${playlist.name}`
      );
    } else {
      toast.success("Playlist created successfully");
    }

     await dispatch(fetchUserPlaylists(user._id)).unwrap();

      console.log("Fetched playlists after creating.");

    setNewName("");
    setNewDesc("");
    onClose();
  } catch (error) {
    toast.error(error || "Failed to create playlist");
  }
};

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 w-[450px] rounded-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Save to Playlist
        </h2>

        {/* Existing Playlists */}
        {!showCreateForm && (
          <>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {playlists?.length > 0 ? (
                playlists.map((playlist) => {
                  const checked = playlist.videos?.some(
                    (video) =>
                      (video._id || video).toString() ===
                      videoId
                  );

                  return (
                    <label
                      key={playlist._id}
                      className="flex items-center justify-between bg-zinc-800 p-3 rounded cursor-pointer hover:bg-zinc-700"
                    >
                      <span className="text-white">
                        {playlist.name}
                      </span>

                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          handleToggle(playlist)
                        }
                      />
                    </label>
                  );
                })
              ) : (
                <p className="text-gray-400">
                  No playlists found
                </p>
              )}
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white"
            >
              + Create New Playlist
            </button>
          </>
        )}

        {/* Create Playlist Form */}
        {showCreateForm && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Playlist Name"
              value={newName}
              onChange={(e) =>
                setNewName(e.target.value)
              }
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />

            <textarea
              placeholder="Description"
              value={newDesc}
              onChange={(e) =>
                setNewDesc(e.target.value)
              }
              className="w-full p-2 rounded bg-zinc-800 text-white"
            />

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded"
              >
                Create
              </button>

              <button
                onClick={() =>
                  setShowCreateForm(false)
                }
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}