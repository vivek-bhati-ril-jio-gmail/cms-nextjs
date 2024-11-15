'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

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

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchPosts(page);
    }
  };

  const handleEditPost = (id) => {
    router.push(`/admin/posts/edit/?id=${id}`);
  };

  const handleDeletePost = async (id) => {
    const res = await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchPosts(currentPage);
    } else {
      alert('Failed to delete the post');
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  return (
    <div className={styles.dashboardContainer}>

      {isLoading && <p>Loading posts...</p>}

      <div className={styles.postsList}>
        <table className={styles.postsTable}>
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
                  <td className={styles.postTitle}>{post.title}</td>
                  <td className={styles.postSlug}>{post.slug}</td>
                  <td className={styles.postActions}>
                    <button onClick={() => handleEditPost(post.id)} className={styles.btnToggleView}>
                      Edit
                    </button>
                    <button onClick={() => handleDeletePost(post.id)} className={styles.btnToggleView}>
                      Delete
                    </button>
                    <button onClick={() => router.push(`/admin/posts/view?id=${post.id}`)} className={styles.btnToggleView}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.noPostsMessage}>No posts available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.btnToggleView}
        >
          Previous
        </button>
        <span className={styles.paginationText}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.btnToggleView}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;