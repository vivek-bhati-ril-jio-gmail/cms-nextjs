'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import styles from './page.module.css'; // Import the CSS module

const PageList = () => {
  const [pages, setPages] = useState([]);  // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPages = async (page = 1) => {
    setIsLoading(true);
    const res = await fetch(`/api/pages?page=${page}&limit=10`);
    const data = await res.json();
    
    // Ensure the pages data is an array even if the API response is invalid or missing data
    setPages(data.pages || []); // Fallback to an empty array if 'pages' is undefined or null
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchPages(page);
    }
  };

  // Handle edit button
  const handleEditPage = (id) => {
    router.push(`/admin/pages/edit/${id}`); // Navigate to edit page
  };

  // Handle delete button
  const handleDeletePage = async (id) => {
    const res = await fetch('/api/pages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchPages(currentPage); // Refresh page list
    } else {
      alert('Failed to delete the page');
    }
  };

  useEffect(() => {
    fetchPages(currentPage); // Fetch pages on component mount
  }, [currentPage]);

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Manage your pages here.</h1>

      {isLoading && <p>Loading pages...</p>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pages) && pages.length > 0 ? (
            pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td>{page.slug}</td>
                <td>
                  <button onClick={() => handleEditPage(page.id)}>Edit</button>
                  <button onClick={() => handleDeletePage(page.id)}>Delete</button>
                  <button onClick={() => router.push(`/admin/pages/view/${page.id}`)}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No pages available.</td>
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

export default PageList;
