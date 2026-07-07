import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../features/commentSlice.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CommentForm({ videoId }) {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const isAuthenticated = !!user;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      await dispatch(
        addComment({
          videoId,
          content,
        })
      );

      setContent("");
    } catch (error) {
      console.log(error);
    }
  };

  // If user is not logged in, show a login prompt
  if (!isAuthenticated) {
    return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5 text-center">

        <p className="text-gray-300">

            Join the conversation.

        </p>

        <p className="text-gray-500 text-sm mt-1">

            Sign in to post comments.

        </p>

        <button
            onClick={()=>navigate("/login")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
            Login
        </button>

    </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
       <p className="text-gray-400 text-sm">
        Commenting as{" "}
        <span className="text-white font-medium">
          @{user?.username}
        </span>
      </p>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="w-full bg-zinc-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      />

      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!content.trim()}
      >
        Comment
      </button>
    </form>
  );
}