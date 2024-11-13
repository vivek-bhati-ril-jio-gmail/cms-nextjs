import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const PostEditor = ({ post, onSave }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');

  const handleSave = async () => {
    const data = { title, slug, content };
    if (post?.id) {
      // Update existing post
      await fetch('/api/posts', {
        method: 'PUT',
        body: JSON.stringify({ ...data, id: post.id }),
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Create new post
      await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    onSave();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Post Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={handleSave}>Save Post</button>
    </div>
  );
};

export default PostEditor;
