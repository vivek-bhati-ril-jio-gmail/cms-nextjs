'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import { useParams } from 'next/navigation'; // For getting the page ID from the URL

const EditPage = () => {
  const { id } = useParams(); // Get the page ID from URL
  const [page, setPage] = useState({ title: '', slug: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch page data for editing
  const fetchPage = async () => {
    const res = await fetch(`/api/pages/${id}`);
    const data = await res.json();
    setPage(data);
    setIsLoading(false);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPage({
      ...page,
      [name]: value,
    });
  };

  // Handle save (submit form)
  const handleSave = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(page),
    });

    if (res.ok) {
      alert('Page updated successfully');
      router.push('/admin/pages'); // Redirect back to the pages list
    } else {
      alert('Failed to update the page');
    }
  };

  // Fetch page data when the component mounts or the ID changes
  useEffect(() => {
    fetchPage(); // Fetch page data when the page loads
  }, [id]);

  return (
    <div>
      <h1>Edit Page</h1>

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
              value={page.title}
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
              value={page.slug}
              onChange={handleFormChange}
            />
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={page.content}
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

export default EditPage;
