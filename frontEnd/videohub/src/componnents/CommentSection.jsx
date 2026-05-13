import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addComment, 
  getVideoComments, 
  clearSuccessMessage 
} from '../features/commentSlice.js';

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { videoComments, loading, successMessage } = useSelector(
    (state) => state.comments
  );
  
  const comments = videoComments[videoId]?.comments || [];
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoComments({ videoId }));
    }
  }, [dispatch, videoId]);

  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        dispatch(clearSuccessMessage());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    await dispatch(addComment({ videoId, content: commentText }));
    setCommentText('');
  };

  return (
    <div className="mt-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}

      <h3 className="text-xl font-semibold text-white mb-4">
        Comments ({videoComments[videoId]?.totalComments || 0})
      </h3>

      {/* Comment Input */}
      <div className="mb-6">
        <div className="flex items-start space-x-3">
          <img
            src={currentUser?.profilePic || '/default-avatar.png'}
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => setCommentText('')}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={loading || !commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem 
            key={comment._id} 
            comment={comment} 
            videoId={videoId}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Comment Item Component
const CommentItem = ({ comment, videoId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const dispatch = useDispatch();

  const handleUpdate = async () => {
    if (editText.trim() && editText !== comment.content) {
      await dispatch(updateComment({ commentId: comment._id, content: editText }));
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await dispatch(deleteComment({ commentId: comment._id }));
    }
  };

  return (
    <div className="flex space-x-3">
      <img
        src={comment.owner?.profilePic || '/default-avatar.png'}
        alt={comment.owner?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-white text-sm">
              {comment.owner?.name}
            </h4>
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {isEditing ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg mt-2"
                rows="2"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 mt-1">{comment.content}</p>
          )}
        </div>
        
        <div className="flex space-x-4 mt-1 ml-2">
          <button className="text-xs text-gray-400 hover:text-white transition">
            Like
          </button>
          <button 
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="text-xs text-gray-400 hover:text-white transition"
          >
            Reply
          </button>
          {comment.owner?._id === currentUser?._id && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-400 hover:text-blue-300 transition"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-xs text-red-400 hover:text-red-300 transition"
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* Reply Box (you can implement replies similarly) */}
        {showReplyBox && (
          <div className="mt-3 ml-8">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
              rows="2"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setShowReplyBox(false)}
                className="px-3 py-1 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;