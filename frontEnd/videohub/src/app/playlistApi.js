const BASE = "http://localhost:8000/api/v1/playlists"

export const getUserPlaylists = async (userId, token) => {
  const res = await fetch(`${BASE}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export const createPlaylistApi = async (data, token) => {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const toggleVideoApi = async (playlistId, videoId, exists, token) => {
  const url = exists
    ? `${BASE}/${playlistId}/remove/${videoId}`
    : `${BASE}/${playlistId}/add/${videoId}`

  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  })

  return res.json()
}

export const getPlaylistByIdApi = async (id) => {
  const res = await fetch(`${BASE}/${id}`)
  return res.json()
}