// components/CommentButton.jsx

import { useState } from "react";
import CommentBox from "../componnents/CommentBox";

export default function CommentButton({ videoId }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-blue-400 hover:underline"
      >
        Comment
      </button>

      {open && <CommentBox videoId={videoId} />}
    </div>
  );
}