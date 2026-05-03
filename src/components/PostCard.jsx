<<<<<<< HEAD
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  // Prevent crashes if PostList hasn't finished loading
  if (!post || !post.id) return null;

  // Ensure upvotes always shows a number
  const upvoteCount =
    typeof post.upvotes === "number" ? post.upvotes : 0;
=======
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  if (!post) return null; // prevents crashes
>>>>>>> cc0544ce1d41732c7d12daa695472a83f64f1532

  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <h3>{post.title}</h3>
<<<<<<< HEAD

      <p className="posted-by">
        Posted by: {post.username || "Unknown"}
      </p>

      <div className="meta">
        <span>
          {post.created_at
            ? new Date(post.created_at).toLocaleString()
            : ""}
        </span>

        <span>⬆ {upvoteCount}</span>
=======
      <p className="posted-by">Posted by: {post.username}</p>
      <div className="meta">
        <span>{new Date(post.created_at).toLocaleString()}</span>
        <span>⬆ {post.upvotes}</span>
>>>>>>> cc0544ce1d41732c7d12daa695472a83f64f1532
      </div>
    </Link>
  );
}
