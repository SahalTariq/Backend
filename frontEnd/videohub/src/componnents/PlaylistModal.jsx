import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchPlaylists,
  toggleVideo,
  createPlaylist
} from "../features/playlistSlice.js"

export default function PlaylistModal({ videoId, onClose }) {
  const dispatch = useDispatch()
  const { playlists } = useSelector(s => s.playlist)
  const { user, token } = useSelector(s => s.auth)

  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")

  useEffect(() => {
    dispatch(fetchPlaylists({ userId: user._id, token }))
  }, [])

  const handleToggle = (p) => {
    const exists = p.videos?.includes(videoId)

    dispatch(toggleVideo({
      playlistId: p._id,
      videoId,
      exists,
      token
    }))
  }

  const handleCreate = () => {
    dispatch(createPlaylist({
      data: { name: newName, description: newDesc },
      token
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="bg-gray-900 p-4 w-[400px] rounded">

        <h2 className="mb-3">Save to playlist</h2>

        {/* LIST */}
        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {playlists.map(p => (
            <div
              key={p._id}
              onClick={() => handleToggle(p)}
              className="flex justify-between bg-gray-800 p-2 rounded cursor-pointer"
            >
              <span>{p.name}</span>
              <input type="checkbox" readOnly />
            </div>
          ))}
        </div>

        {/* CREATE */}
        <div className="mt-4">
          <input
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full mb-2 p-1"
          />
          <input
            placeholder="Description"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full mb-2 p-1"
          />

          <button onClick={handleCreate} className="bg-blue-500 px-3 py-1">
            Create
          </button>
        </div>

        <button onClick={onClose} className="mt-3">Close</button>
      </div>
    </div>
  )
}