import PostCard from "./PostCard.jsx";

export default function PostList({ posts }) {
  // Guard: no posts yet
  if (!posts || posts.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="post-list">
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
      })}
    </div>
  );
}
