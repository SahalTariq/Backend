import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../componnents/CommentSection";

export default function WatchVideo() {
  const { id } = useParams();

  console.log("Video ID:", id);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/videos/${id}`
        );

        if (!res.ok) {
          throw new Error("Video not found");
        }

        const data = await res.json();
        setVideo(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <h1>Loading...</h1>;
  if (!video) return <h1>Video not found</h1>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <video
        src={video.videoFile}
        controls
        autoPlay
        className="w-full rounded-lg"
      />

      <h1 className="text-2xl font-bold text-white mt-4">
        {video.title}
      </h1>

      <p className="text-gray-400 mt-2">
        {video.description}
      </p>

      <p className="text-sm text-gray-500 mt-2">
        {video.views} views
      </p>

      <CommentSection videoId={id} />
      
    </div>
  );
}