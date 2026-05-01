import { useEffect, useState } from 'react';

export default function LlmSummary({ post, comments }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;
  const LLM_ENDPOINT = import.meta.env.VITE_LLM_ENDPOINT;

  useEffect(() => {
    const run = async () => {
      if (!post) return;
      setLoading(true);
      try {
        const body = {
          title: post.title,
          content: post.content,
          upvotes: post.upvotes,
          comments: comments.map((c) => c.content),
        };

        // ⭐ FIXED: Use FAU HPC endpoint instead of OpenAI
        const res = await fetch(LLM_ENDPOINT + 'api/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${LLM_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'openai/gemma4:26b',
            messages: [
              {
                role: 'system',
                content:
                  'You summarize forum posts concisely for users. Highlight main idea, tone, and engagement.',
              },
              {
                role: 'user',
                content: `Post title: ${body.title}
Post content: ${body.content || '(no content)'}
Upvotes: ${body.upvotes}
Comments: ${body.comments.join('\n') || '(no comments yet)'}

Write a short paragraph summary for the UI.`,
              },
            ],
          }),
        });

        let data = await res.json();
        let text = data?.content?.[0]?.text || '';
        setSummary(text);
      } catch (e) {
        setSummary('Could not generate summary.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [post?.id, comments.length]);

  return (
    <section className="llm-summary">
      <h3>AI Summary</h3>
      {loading && <p>Generating summary...</p>}
      {!loading && summary && <p>{summary}</p>}
    </section>
  );
}
