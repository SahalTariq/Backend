// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadVideo, resetVideoState } from "../features/videoSlice.js";

// export default function UploadVideo() {
//   const dispatch = useDispatch();
//   const { loading, error, success } = useSelector((state) => state.video);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     videoFile: null,
//     thumbnail: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (files) {
//       setForm({ ...form, [name]: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", form.title);
//     formData.append("description", form.description);
//     formData.append("videoFile", form.videoFile);
//     formData.append("thumbnail", form.thumbnail);

//     dispatch(uploadVideo(formData));
//   };

//   // reset after success
//   useEffect(() => {
//     if (success) {
//       setForm({
//         title: "",
//         description: "",
//         videoFile: null,
//         thumbnail: null,
//       });

//       dispatch(resetVideoState());
//       dispatch(getVideos()); // ✅ refresh videos
//     }
//   }, [success]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">

//       <div className="w-full max-w-lg bg-gray-900/80 border border-gray-700 rounded-2xl p-8 shadow-xl">

//         <h2 className="text-2xl font-bold text-white mb-6 text-center">
//           Upload Video
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* Title */}
//           <input
//             name="title"
//             value={form.title}
//             required
//             onChange={handleChange}
//             placeholder="Video Title"
//             className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
//           />

//           {/* Description */}
//           <textarea
//             name="description"
//             required
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Description"
//             className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
//           />

//           {/* Video file */}
//           {/* <input
//             type="file"
//             name="videoFile"
//             onChange={handleChange}
//             className="w-full text-gray-300"
//           /> */}

//           <div className="flex flex-col gap-2">
//             <label htmlFor="video-upload" className="text-sm font-medium text-gray-300">
//                 Upload Video
//             </label>
//             <input
//                 type="file"
//                 name="videoFile"
//                 required
//                 accept="video/mp4,video/x-m4v,video/*"
//                 onChange={handleChange}
//                 className="block w-full text-sm text-gray-400
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-md file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-indigo-600 file:text-white
//                 hover:file:bg-indigo-700
//                 cursor:pointer"
//             />
//             </div>

//           {/* Thumbnail */}
//           {/* <input
//             type="file"
//             name="thumbnail"
//             onChange={handleChange}
//             className="w-full text-gray-300"
//           /> */}


//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-semibold text-gray-300">
//                 Upload Thumbnail
//             </label>
//             <input
//                 type="file"
//                 required
//                 name="thumbnail"
//                 accept="image/png, image/jpeg, image/webp" 
//                 onChange={handleChange}
//                 className="w-full text-sm text-gray-400
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-lg file:border-0
//                 file:text-sm file:font-medium
//                 file:bg-blue-600 file:text-white
//                 hover:file:bg-blue-700
//                 cursor-pointer"
//             />
//             <p className="text-xs text-gray-500">Recommended: 1280x720 (PNG or JPG)</p>
//             </div>

          

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
//           >
//             {loading ? "Uploading..." : "Upload Video"}
//           </button>

//           {/* Messages */}
//           {error && <p className="text-red-400 text-sm">{error}</p>}
//           {success && (
//             <p className="text-green-400 text-sm">
//               Video uploaded successfully 🎉
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadVideo,
  resetVideoState,
} from "../features/videoSlice.js";
import { useNavigate } from "react-router-dom";

export default function UploadVideo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.video
  );

  const videoRef = useRef(null);
  const thumbnailRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    dispatch(uploadVideo(formData));
  };

  useEffect(() => {
    if (!success) return;

    setForm({
      title: "",
      description: "",
      videoFile: null,
      thumbnail: null,
    });

    if (videoRef.current) {
      videoRef.current.value = "";
    }

    if (thumbnailRef.current) {
      thumbnailRef.current.value = "";
    }

    dispatch(resetVideoState());

    navigate("/");
  }, [success, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-lg bg-gray-900/80 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Upload Video
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            required
            onChange={handleChange}
            placeholder="Video Title"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />

          <textarea
            name="description"
            value={form.description}
            required
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Upload Video
            </label>

            <input
              ref={videoRef}
              type="file"
              name="videoFile"
              required
              accept="video/mp4,video/x-m4v,video/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700
              cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Upload Thumbnail
            </label>

            <input
              ref={thumbnailRef}
              type="file"
              name="thumbnail"
              required
              accept="image/png,image/jpeg,image/webp"
              onChange={handleChange}
              className="w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer"
            />

            <p className="text-xs text-gray-500">
              Recommended: 1280×720 (PNG or JPG)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-sm">
              Video uploaded successfully 🎉
            </p>
          )}
        </form>
      </div>
    </div>
  );
}