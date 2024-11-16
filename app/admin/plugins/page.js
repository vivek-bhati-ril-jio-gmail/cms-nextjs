'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const PluginList = () => {
  const [plugins, setPlugins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);  // To handle errors
  const router = useRouter();

  // Fetch plugins with pagination
  const fetchPlugins = async (page = 1) => {
    setIsLoading(true);
    setError(null);  // Reset any previous error
    try {
      const res = await fetch(`/api/plugins?page=${page}&limit=10`);
      if (!res.ok) {
        throw new Error('Failed to fetch plugins');
      }
      const data = await res.json();
      setPlugins(data.plugins);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);  // Set error if the fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchPlugins(page);
    }
  };

  // Handle toggling plugin status (activate or deactivate)
  const handleTogglePluginStatus = async (id, isActive) => {
    try {
      const res = await fetch(`/api/plugins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }), // Toggle status
      });

      if (res.ok) {
        fetchPlugins(currentPage);  // Refetch to reflect changes
      } else {
        throw new Error('Failed to update plugin status');
      }
    } catch (error) {
      alert(error.message);  // Display error if the update fails
    }
  };

  // Fetch plugins on initial mount and when page changes
  useEffect(() => {
    fetchPlugins(currentPage);  // Fetch plugins for the current page
  }, [currentPage]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Loading Spinner or Message */}
      {isLoading && (
        <div className={styles.loading}>
          <p>Loading plugins...</p>
          {/* Optionally add a spinner here */}
        </div>
      )}

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.pluginsList}>
        <table className={styles.pluginsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Version</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(plugins) && plugins.length > 0 ? (
              plugins.map((plugin) => (
                <tr key={plugin.id}>
                  <td className={styles.pluginName}>{plugin.name}</td>
                  <td className={styles.pluginDescription}>{plugin.description}</td>
                  <td className={styles.pluginVersion}>{plugin.version}</td>
                  <td className={styles.pluginStatus}>
                    {plugin.isActive ? 'Active' : 'Inactive'}
                  </td>
                  <td className={styles.pluginActions}>
                    <button 
                      onClick={() => handleTogglePluginStatus(plugin.id, plugin.isActive)} 
                      className={styles.btnToggleView}>
                      {plugin.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => router.push(`/admin/plugins/view?id=${plugin.id}`)} 
                      className={styles.btnToggleView}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noPluginsMessage}>No plugins available.</td>
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

export default PluginList;
