'use client';

import { useState, useEffect } from 'react';
import PostEditor from '../../components/PostEditor'; // Assuming PostEditor is your WYSIWYG editor component
import styles from './page.module.css'; // Import the CSS module

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    content: ''
  });
  const [isPageView, setIsPageView] = useState(false); // State for toggling between post and page views

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handlePostCreation = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!newPost.title || !newPost.content) {
      alert('Title and content are required!');
      return;
    }

    // Determine the endpoint based on whether it's a post or page
    const endpoint = isPageView ? '/api/pages' : '/api/posts';

    // Send a request to create the new post/page
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });

    const data = await res.json();
    if (res.ok) {
      // Update the posts/pages list
      if (isPageView) {
        // If it's a page view, fetch pages (you may want to store pages separately in a state)
        setPosts([...posts, data]);
      } else {
        // If it's a post view, add the new post to the list
        setPosts([...posts, data]);
      }
      setNewPost({ title: '', slug: '', content: '' }); // Reset form fields
    } else {
      alert('Error creating post/page');
    }
  };

  // Toggle between Post and Page views
  const toggleView = () => {
    setIsPageView(!isPageView);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Create Post Form */}
      {!isPageView && (
        <form className={styles.postForm} onSubmit={handlePostCreation}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newPost.title}
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
              value={newPost.slug}
              onChange={handleFormChange}
              placeholder="Enter post slug"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Post Content</label>
            <textarea
              id="content"
              name="content"
              value={newPost.content}
              onChange={handleFormChange}
              className={styles.textarea}
              placeholder="Enter post content"
              required
            ></textarea>
          </div>
          <div className={styles.formButtons}>
            <button type="submit" className={styles.btnSubmit}>
              Create Post
            </button>
          </div>
        </form>
      )}

      {/* Create Page Form (Optional) */}
      {isPageView && (
        <form className={styles.pageForm} onSubmit={handlePostCreation}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Page Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newPost.title}
              onChange={handleFormChange}
              placeholder="Enter page title"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="slug">Page Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={newPost.slug}
              onChange={handleFormChange}
              placeholder="Enter page slug"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Page Content</label>
            <textarea
              id="content"
              name="content"
              value={newPost.content}
              onChange={handleFormChange}
              className={styles.textarea}
              placeholder="Enter page content"
              required
            ></textarea>
          </div>
          <div className={styles.formButtons}>
            <button type="submit" className={styles.btnSubmit}>
              Create Page
            </button>
          </div>
        </form>
      )}

      {selectedPost && (
        <PostEditor post={selectedPost} onSave={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
