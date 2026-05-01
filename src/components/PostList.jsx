import PostCard from './PostCard.jsx';

export default function PostList({ posts }) {
  if (!posts || posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="post-list">
      {posts.map((p, index) => {
        // HARD GUARD — prevents ALL crashes
        if (!p || !p.id) return null;

        return <PostCard key={p.id} post={p} />;
      })}
    </div>
  );
}
