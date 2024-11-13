'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import styles from './page.module.css'; // Import the CSS module

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    const res = await fetch(`/api/posts?page=${page}&limit=10`);
    const data = await res.json();
    setPosts(data.posts);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchPosts(page);
    }
  };

  // Handle edit button
  const handleEditPost = (id) => {
    router.push(`/admin/posts/edit/${id}`); // Navigate to edit page
  };

  // Handle delete button
  const handleDeletePost = async (id) => {
    const res = await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchPosts(currentPage); // Refresh post list
    } else {
      alert('Failed to delete the post');
    }
  };

  useEffect(() => {
    fetchPosts(currentPage); // Fetch posts on component mount
  }, [currentPage]);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Manage your posts here.</h1>

      {isLoading && <p>Loading posts...</p>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.slug}</td>
                <td>
                  <button onClick={() => handleEditPost(post.id)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                  <button onClick={() => router.push(`/admin/posts/view/${post.id}`)}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No posts available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;
