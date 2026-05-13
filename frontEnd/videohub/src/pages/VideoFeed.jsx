import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../features/videoSlice';
import VideoCard from '../componnents/VideoCard';

export default function VideoFeed() {
  const dispatch = useDispatch();
  const { videos, isLoading, error } = useSelector((state) => state.videos);
  const { active } = useSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchVideos({ category: active === 'home' ? '' : active }));
  }, [dispatch, active]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      
      {videos.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No videos found. Be the first to upload!
        </div>
      )}
    </div>
  );
}