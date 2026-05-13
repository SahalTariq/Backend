import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../features/commentSlice.js";

export default function CommentsPage() {
  const dispatch = useDispatch();
  const { groupedComments, loading } = useSelector(
    (state) => state.comments
  );

  useEffect(() => {
    dispatch(getComments()); // 🔥 ALWAYS fetch from DB
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  console.log("groupedComments: " ,groupedComments)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Comments</h1>

      {groupedComments.length === 0 && (
        <p className="text-gray-400">No comments yet</p>
      )}

      {groupedComments.map((group) => (
        <div
          key={group._id}
          className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          {/* Video Title */}
          {/* <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-400">
              {group.videoTitle}
            </h2>
            <span className="text-sm text-gray-400">
              {group.totalComments} comments
            </span>
          </div> */}

          {/* Comments */}
          <div className="space-y-4">
            {(group.comments || []).map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-start"
              >
                <div>
                  <p className="text-sm text-gray-400">
                    @{comment.owner}
                  </p>
                  <p className="mt-1">{comment.content}</p>
                </div>

                <div className="flex gap-3 text-sm">
                  <button className="text-blue-400 hover:underline">
                    Reply
                  </button>
                  <button className="text-yellow-400 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-400 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}