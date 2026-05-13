

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, resetSuccess,getComments} from "../features/commentSlice.js";

export default function CommentBox({ videoId }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { success } = useSelector((state) => state.comments);
  // console.log("Success",success)

  const handleSubmit = () => {
    if (!text.trim()) return;

    dispatch(addComment({ videoId, content: text }))
    .unwrap()
    .then(() => {
    dispatch(getComments()); // 🔥 REFRESH FROM DB
  })
    
    //  dispatch(getAllComments()); // ✅ REFRESH COMMENTS
    setText("");
  };

 

  useEffect(() => {
  if (success) {
    const timer = setTimeout(() => {
      dispatch(resetSuccess());
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [success, dispatch]);

  return (
    <div className="mt-2">
      <textarea
        className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-1 bg-blue-500 rounded"
      >
        Post
      </button>

      {success && (
        <p className="text-green-400 text-sm mt-1">
          Comment added successfully
        </p>
      )}
    </div>
  );
}