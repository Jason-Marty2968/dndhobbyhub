import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  if (!post) return null; // prevents crashes

  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <h3>{post.title}</h3>
      <p className="posted-by">Posted by: {post.username}</p>
      <div className="meta">
        <span>{new Date(post.created_at).toLocaleString()}</span>
        <span>⬆ {post.upvotes}</span>
      </div>
    </Link>
  );
}
