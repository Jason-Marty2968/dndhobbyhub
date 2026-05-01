import { useState } from 'react';

export default function CommentList({ comments, canComment, onAddComment }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(text);
    setText('');
  };

  return (
    <div className="comments">
      <h3>Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.username}</strong> {/* ⭐ NEW */}
            <span style={{ marginLeft: "8px", opacity: 0.7 }}>
              {new Date(c.created_at).toLocaleString()}
            </span>
            <p>{c.content}</p>
          </li>
        ))}
      </ul>

      {canComment && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Comment</button>
        </form>
      )}
    </div>
  );
}
