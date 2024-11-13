'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import { useParams } from 'next/navigation'; // For getting the post ID from the URL

const EditPost = () => {
  const { id } = useParams(); // Get the post ID from URL
  const [post, setPost] = useState({ title: '', slug: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch post data for editing
  const fetchPost = async () => {
    const res = await fetch(`/api/posts/${id}`);
    const data = await res.json();
    setPost(data);
    setIsLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });

    if (res.ok) {
      alert('Post updated successfully');
      router.push('/admin/posts'); // Redirect back to the posts list
    } else {
      alert('Failed to update the post');
    }
  };

  useEffect(() => {
    fetchPost(); // Fetch post data when the page loads
  }, [id]);

  return (
    <div>
      <h1>Edit Post</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSave}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleFormChange}
              required
            />
          </div>
          <div>
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={post.slug}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={post.content}
              onChange={handleFormChange}
              required
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default EditPost;
