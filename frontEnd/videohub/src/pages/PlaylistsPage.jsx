import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserPlaylists,
  deletePlaylist,
  updatePlaylist,
} from "../features/playlistSlice.js";
import { useNavigate } from "react-router-dom";
// import CreatePlaylistModal from "../componnents/CreatePlaylistModal";
import PlaylistModal from "../componnents/PlaylistModal";
import Topbar from "../layout/Topbar.jsx";
import Sidebar from "../layout/Sidebar.jsx";

const PlaylistsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { playlists, loading } = useSelector(
    (state) => state.playlist
  );

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] =
    useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserPlaylists(user._id));
    }
  }, [user, dispatch]);

  /* ================= DELETE ================= */

  const handleDelete = (id) => {
    if (!window.confirm("Delete this playlist?"))
      return;

    dispatch(deletePlaylist(id));
  };

  /* ================= EDIT ================= */

  const handleEdit = (playlist) => {
    setEditing(playlist._id);
    setEditName(playlist.name);
    setEditDescription(playlist.description);
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    dispatch(
      updatePlaylist({
        playlistId: editing,
        name: editName,
        description: editDescription,
      })
    );

    setEditing(null);
  };

  /* ======================================================
      USER NOT LOGGED IN
  ====================================================== */

 if (!user) {
  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">

      <div className="fixed top-0 left-0 md:left-56 right-0 h-14 z-30 bg-bg2 border-b border-border">
        <Topbar />
      </div>

      <div className="flex pt-14 h-full">

        <Sidebar />

        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center">

            <h1 className="text-3xl font-bold">
              Click here to{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-400 underline hover:text-blue-300"
              >
                Login
              </button>
            </h1>

            <p className="text-gray-400 mt-4">
              Login to Create and View Playlists
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}

  /* ======================================================
      USER LOGGED IN
  ====================================================== */

 return (
  <div className="h-screen bg-gray-900 text-white overflow-hidden">

    {/* TOPBAR */}
    <div className="fixed top-0 left-0 md:left-56 right-0 h-14 z-30 bg-bg2 border-b border-border">
      <Topbar />
    </div>

    <div className="flex pt-14 h-full">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div
        className="
          flex-1
          md:ml-60
          h-[calc(100vh-56px)]
          overflow-y-auto
          px-4
          py-6

          scrollbar-thin
          scrollbar-thumb-zinc-600
          scrollbar-track-transparent

          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-zinc-600
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500
        "
      >

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">
            Your Playlists
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            + Create Playlist
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-lg">
              Loading playlists...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && playlists.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              No Playlists Yet
            </h2>

            <p className="text-gray-400 mt-2">
              Create your first playlist and save videos.
            </p>
          </div>
        )}

        {/* Playlist Grid */}
        {!loading && playlists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {playlists.map((pl) => (
              <div
                key={pl._id}
                className="bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition"
              >

                {/* Thumbnail */}
                <img
                  src={
                    pl.videos?.[0]?.thumbnail ||
                    "https://via.placeholder.com/400x225?text=Playlist"
                  }
                  alt={pl.name}
                  className="w-full aspect-video object-cover cursor-pointer"
                  onClick={() =>
                    navigate(`/playlists/${pl._id}`)
                  }
                />

                <div className="p-4">

                  {editing === pl._id ? (
                    <>
                      <input
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                        className="w-full bg-zinc-800 rounded-lg p-2 mb-3 outline-none"
                      />

                      <textarea
                        rows={3}
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(e.target.value)
                        }
                        className="w-full bg-zinc-800 rounded-lg p-2 outline-none"
                      />

                      <div className="flex gap-2 mt-4">

                        <button
                          onClick={handleSave}
                          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditing(null)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
                        >
                          Cancel
                        </button>

                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold truncate">
                        {pl.name}
                      </h2>

                      <p className="text-gray-400 text-sm mt-2 line-clamp-2 min-h-[40px]">
                        {pl.description}
                      </p>

                      <p className="text-xs text-gray-500 mt-3">
                        {pl.videos?.length || 0} Videos
                      </p>

                      <div className="flex gap-2 mt-5">

                        <button
                          onClick={() => handleEdit(pl)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(pl._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </div>
                    </>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>

    {open && (
      <PlaylistModal
        onClose={() => setOpen(false)}
      />
    )}

  </div>
);
};

export default PlaylistsPage;