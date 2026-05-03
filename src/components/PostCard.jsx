import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  // Prevent crashes if PostList hasn't finished loading
  if (!post || !post.id) return null;

  // Ensure upvotes always shows a number
  const upvoteCount =
    typeof post.upvotes === "number" ? post.upvotes : 0;

  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <h3>{post.title}</h3>

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
      </div>
    </Link>
  );
}
