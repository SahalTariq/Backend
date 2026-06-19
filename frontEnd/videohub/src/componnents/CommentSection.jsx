import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getComments } from "../features/commentSlice.js";

import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentSection({ videoId }) {
  const dispatch = useDispatch();

  const { comments, loading } = useSelector(
    (state) => state.comments
  );

  useEffect(() => {
    if (videoId) {
      dispatch(getComments(videoId));
    }
  }, [dispatch, videoId]);

  return (
    <div className="mt-8">
      <h2 className="text-white text-xl font-semibold mb-4">
        {comments?.length || 0} Comments
      </h2>

      <CommentForm videoId={videoId} />

      {loading ? (
        <p className="text-gray-400 mt-4">
          Loading comments...
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {comments?.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
            />
          ))}
        </div>
      )}
    </div>
  );
}