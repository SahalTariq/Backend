import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchPlaylistById } from "../features/playlistSlice.js"

export default function PlaylistPage() {
  const { playlistId } = useParams()
  const dispatch = useDispatch()
  const { currentPlaylist } = useSelector(s => s.playlist)

  const [currentVideo, setCurrentVideo] = useState(null)

  useEffect(() => {
    dispatch(fetchPlaylistById(playlistId))
  }, [])

  useEffect(() => {
    if (currentPlaylist?.videos?.length) {
      setCurrentVideo(currentPlaylist.videos[0])
    }
  }, [currentPlaylist])

  return (
    <div className="flex gap-6 p-4">

      {/* LEFT */}
      <div className="w-1/3">
        {currentVideo && (
          <video src={currentVideo.videoUrl} controls />
        )}

        <h2>{currentPlaylist?.name}</h2>
        <p>{currentPlaylist?.description}</p>
      </div>

      {/* RIGHT */}
      <div className="w-2/3 overflow-y-auto max-h-screen">

        {currentPlaylist?.videos?.map(v => (
          <div
            key={v._id}
            onClick={() => setCurrentVideo(v)}
            className="flex gap-3 p-2 hover:bg-gray-800 cursor-pointer"
          >
            <img src={v.thumbnail} className="w-40" />
            <div>
              <h4>{v.title}</h4>
              <p>{v.owner?.username}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}