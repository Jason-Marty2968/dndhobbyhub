import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import CommentList from "../components/CommentList.jsx";
import LlmSummary from "../components/LlmSummary.jsx";

export default function PostPage({ session }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const isOwner = session && post && post.user_id === session.user.id;

  // Fetch post + real upvote count
  const fetchPost = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      // Fetch real upvote count
      const { count } = await supabase
        .from("post_upvotes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", data.id);

      setPost({ ...data, upvotes: count });
      setEditTitle(data.title);
      setEditContent(data.content || "");
      setEditImageUrl(data.image_url || "");
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    setComments(data || []);
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // REAL upvote system
  const handleUpvote = async () => {
    if (!session) return;

    // Check if user already upvoted
    const { data: existing } = await supabase
      .from("post_upvotes")
      .select("*")
      .eq("post_id", post.id)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (existing) {
      alert("You already upvoted this post.");
      return;
    }

    // Insert upvote
    await supabase.from("post_upvotes").insert({
      post_id: post.id,
      user_id: session.user.id,
    });

    // Refresh count
    const { count } = await supabase
      .from("post_upvotes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);

    setPost({ ...post, upvotes: count });
  };

  const handleSaveEdit = async () => {
    const { data } = await supabase
      .from("posts")
      .update({
        title: editTitle.trim(),
        content: editContent.trim() || null,
        image_url: editImageUrl.trim() || null,
      })
      .eq("id", post.id)
      .select()
      .single();

    if (data) {
      setPost(data);
      setEditing(false);
      fetchPost(); // refresh upvote count too
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", post.id);
    navigate("/");
  };

  const handleAddComment = async (content) => {
    if (!session || !content.trim()) return;

    await supabase.from("comments").insert({
      post_id: post.id,
      user_id: session.user.id,
      content: content.trim(),
    });

    fetchComments();
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-page">
      <h2>
        {post.title}
        <span
          className={`badge ${
            post.is_dm ? "badge-dm" : `badge-${post.class.toLowerCase()}`
          }`}
        >
          {post.is_dm ? "DM" : post.class}
        </span>
      </h2>
        <p className="posted-by">Posted by: {post.username}</p>
      <div className="meta">
        <span>{new Date(post.created_at).toLocaleString()}</span>
        <span>⬆ {post.upvotes}</span>
      </div>

      {/* IMAGE FIXED */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="post-image"
          style={{
            maxWidth: "100%",
            borderRadius: "8px",
            marginTop: "1rem",
            display: "block",
          }}
        />
      )}

      {editing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <input
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <p>{post.content}</p>
      )}

      <div className="action-row">
        <button onClick={handleUpvote}>Upvote</button>

        {isOwner && !editing && (
          <div className="owner-actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>

      <LlmSummary post={post} comments={comments} />

      <CommentList
        comments={comments}
        canComment={!!session}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
