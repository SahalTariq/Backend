// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";

// import {
//   createPlaylist,
//   addVideoToPlaylist,
// } from "../features/playlistSlice";

// const PlaylistModal = ({ videoId, onClose }) => {
//   const dispatch = useDispatch();

//   const { playlists } = useSelector(
//     (state) => state.playlist
//   );

//   const [showCreateForm, setShowCreateForm] =
//     useState(false);

//   const [name, setName] = useState("");
//   const [description, setDescription] =
//     useState("");

//   const handlePlaylistSelect = async (
//     playlistId,
//     playlistName
//   ) => {
//     const result = await dispatch(
//       addVideoToPlaylist({
//         playlistId,
//         videoId,
//       })
//     );

//     if (
//       addVideoToPlaylist.fulfilled.match(result)
//     ) {
//       toast.success(
//         `Video added to ${playlistName}`
//       );
//       onClose();
//     }
//   };

//   const handleCreatePlaylist = async (e) => {
//     e.preventDefault();

//     const playlistResult = await dispatch(
//       createPlaylist({
//         name,
//         description,
//       })
//     );

//     if (
//       createPlaylist.fulfilled.match(
//         playlistResult
//       )
//     ) {
//       const playlist =
//         playlistResult.payload;

//       await dispatch(
//         addVideoToPlaylist({
//           playlistId: playlist._id,
//           videoId,
//         })
//       );

//       toast.success(
//         `Video added to ${playlist.name}`
//       );

//       onClose();
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      
//     >
//       <div
//         className="bg-zinc-900 w-[450px] rounded-lg p-5"
//         onClick={(e) =>
//           e.stopPropagation()
//         }
//       >
//         <h2 className="text-xl text-white font-bold mb-4">
//           Save To Playlist
//         </h2>

//         {/* Existing Playlists */}

//         {!showCreateForm && (
//           <>
//             <div className="space-y-2 max-h-60 overflow-y-auto">
//               {playlists?.map((playlist) => (
//                 <label
//                   key={playlist._id}
//                   className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     onChange={() =>
//                       handlePlaylistSelect(
//                         playlist._id,
//                         playlist.name
//                       )
//                     }
//                   />

//                   <span className="text-white">
//                     {playlist.name}
//                   </span>
//                 </label>
//               ))}
//             </div>

//             <button
//               onClick={() =>
//                 setShowCreateForm(true)
//               }
//               className="mt-4 w-full bg-red-600 py-2 rounded text-white"
//             >
//               + Create New Playlist
//             </button>

//              {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="mt-2 w-full bg-zinc-700 hover:bg-zinc-600 py-2 rounded text-white"
//           >
//             Close
//           </button>
            
//           </>
//         )}

//         {/* Create Playlist Form */}

//         {showCreateForm && (
//           <form
//             onSubmit={
//               handleCreatePlaylist
//             }
//             className="space-y-3"
//           >
//             <input
//               type="text"
//               placeholder="Playlist Name"
//               value={name}
//               onChange={(e) =>
//                 setName(e.target.value)
//               }
//               className="w-full p-2 rounded bg-zinc-800 text-white"
//             />

//             <textarea
//               placeholder="Description"
//               value={description}
//               onChange={(e) =>
//                 setDescription(
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 rounded bg-zinc-800 text-white"
//             />

//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className="flex-1 bg-green-600 py-2 rounded"
//               >
//                 Create
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowCreateForm(
//                     false
//                   )
//                 }
//                 className="flex-1 bg-gray-600 py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlaylistModal;