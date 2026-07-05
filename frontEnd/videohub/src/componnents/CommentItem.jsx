import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  deleteComment,
  updateComment,
} from "../features/commentSlice.js";

export default function CommentItem({
  comment,
}) {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const { user } = useSelector((state) => state.auth);

  const isOwner = user && comment.owner && user._id === comment.owner._id;

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteComment(comment._id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await dispatch(
        updateComment({
          commentId: comment._id,
          content,
        })
      );

      setEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-3">
      <img
        src={
          comment.owner?.avatar ||
          "/default-avatar.png"
        }
        alt={comment.owner?.username}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1">
        <h3 className="text-white font-medium">
          @{comment.owner?.username}
        </h3>

        {editing ? (
          <>
            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="w-full mt-2 p-2 bg-zinc-800 text-white rounded"
            />

            <button
              onClick={handleUpdate}
              className="mt-2 bg-green-600 px-3 py-1 rounded text-white"
            >
              Save
            </button>
          </>
        ) : (
          <p className="text-gray-300 mt-1">
            {comment.content}
          </p>
        )}

        {isOwner && (
          <div className="flex gap-3 mt-2">

          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-400 hover:text-blue-300"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </button>

          </div>
        )}
      </div>
    </div>
  );
}