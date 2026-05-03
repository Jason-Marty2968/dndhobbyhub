<<<<<<< HEAD
import PostCard from "./PostCard.jsx";

export default function PostList({ posts }) {
  // Guard: no posts yet
=======
import PostCard from './PostCard.jsx';

export default function PostList({ posts }) {
>>>>>>> cc0544ce1d41732c7d12daa695472a83f64f1532
  if (!posts || posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="post-list">
<<<<<<< HEAD
      {posts.map((post) => {
        // Guard: skip malformed rows
        if (!post || !post.id) return null;

        // Ensure upvotes always exists
        const safePost = {
          ...post,
          upvotes:
            typeof post.upvotes === "number" ? post.upvotes : 0,
        };

        return <PostCard key={post.id} post={safePost} />;
=======
      {posts.map((p, index) => {
        // HARD GUARD — prevents ALL crashes
        if (!p || !p.id) return null;

        return <PostCard key={p.id} post={p} />;
>>>>>>> cc0544ce1d41732c7d12daa695472a83f64f1532
      })}
    </div>
  );
}
