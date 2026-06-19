import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../features/commentSlice.js";

export default function CommentForm({ videoId }) {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  // Check if user is authenticated by checking token
  const isAuthenticated = !!localStorage.getItem("token");

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
      <div className="bg-zinc-800/50 rounded-lg p-4 text-center border border-zinc-700">
        <p className="text-gray-400">
          🔒 Please{" "}
          <a href="/login" className="text-blue-400 hover:underline font-medium">
            login
          </a>{" "}
          to add a comment
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <p className="text-gray-400 text-sm">Commenting as <span className="text-white font-medium">You</span></p>
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