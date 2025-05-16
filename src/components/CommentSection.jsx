// src/components/CommentSection.jsx
import { useState } from "react";

function CommentSection() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          user: "User",
          content: comment,
          timeAgo: "Just now",
        },
      ]);
      setComment("");
    }
  };

  return (
    <div className="mt-12">
      {/* Comment Input */}
      <form onSubmit={handleCommentSubmit} className="flex space-x-4 mb-6">
        <div className="flex-1">
          <input
            value={comment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            rows="2"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-black resize-none bg-transparent text-sm p-2"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:opacity-90 transition text-sm"
            >
              Comment
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((c, idx) => (
          <div key={idx} className="flex space-x-4">
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-semibold text-gray-800">
                {c.user}
              </div>
              <div className="text-xs text-gray-500">{c.timeAgo}</div>
              <p className="text-sm text-gray-700 mt-1">{c.content}</p>
              <div className="mt-1 flex space-x-4 text-xs text-gray-600">
                <button className="hover:text-black transition">Like</button>
                <button className="hover:text-black transition">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
