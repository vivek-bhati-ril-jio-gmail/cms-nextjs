'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import hooks from next/navigation
import styles from './page.module.css'; // Adjust the path as needed for your styles

export default function EditPost() {
  const [post, setPost] = useState({
    title: '',
    slug: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Use `useSearchParams` to get the 'id' from query string

  // Fetch the post data when the id is available
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/posts/${id}`);
          const data = await res.json();
          if (res.ok) {
            setPost(data); // Set the fetched post data
          } else {
            alert('Post not found!');
          }
          setIsLoading(false);
        } catch (error) {
          alert('Error fetching post data');
        }
      };

      fetchPost();
    }
  }, [id]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  // Handle the form submission to update the post
  const handlePostUpdate = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (!post.title || !post.content) {
      alert('Title and content are required!');
      return;
    }

    // Send a request to update the post
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Post updated successfully!');
      router.push('/admin/posts'); // Redirect back to the posts list (or dashboard)
    } else {
      alert('Error updating post');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching the post data
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Form for editing the post */}
      <form className={styles.postForm} onSubmit={handlePostUpdate}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Post Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleFormChange}
            placeholder="Enter post title"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="slug">Post Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={post.slug}
            onChange={handleFormChange}
            placeholder="Enter post slug"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Post Content</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleFormChange}
            className={styles.textarea}
            placeholder="Enter post content"
            required
          ></textarea>
        </div>
        <div className={styles.formButtons}>
          <button type="submit" className={styles.btnSubmit}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
