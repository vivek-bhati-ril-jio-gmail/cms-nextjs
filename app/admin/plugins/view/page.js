'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function EditPlugin() {
  const [plugin, setPlugin] = useState({
    name: '',
    description: '',
    version: '',
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get the 'id' from query string

  // Fetch the plugin data when the id is available
  useEffect(() => {
    if (id) {
      const fetchPlugin = async () => {
        try {
          const res = await fetch(`/api/plugins/${id}`);
          const data = await res.json();
          if (res.ok) {
            setPlugin({
              name: data.name,
              description: data.description,
              version: data.version,
              isActive: data.isActive,
            });
          } else {
            alert('Plugin not found!');
          }
          setIsLoading(false);
        } catch (error) {
          alert('Error fetching plugin data');
        }
      };

      fetchPlugin();
    }
  }, [id]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setPlugin({
        ...plugin,
        [name]: checked,
      });
    } else {
      setPlugin({
        ...plugin,
        [name]: value,
      });
    }
  };

  // Handle the form submission to update the plugin
  const handlePluginUpdate = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (!plugin.name || !plugin.description || !plugin.version) {
      alert('Name, version, and description are required!');
      return;
    }

    // Send a request to update the plugin
    const res = await fetch(`/api/plugins/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plugin),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Plugin updated successfully!');
      router.push('/admin/plugins'); // Redirect back to the plugins list (or dashboard)
    } else {
      alert('Error updating plugin');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching the plugin data
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Form for editing the plugin */}
      <form className={styles.pluginForm} onSubmit={handlePluginUpdate}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Plugin Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={plugin.name}
            onChange={handleFormChange}
            placeholder="Enter plugin name"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Plugin Description</label>
          <textarea
            id="description"
            name="description"
            value={plugin.description}
            onChange={handleFormChange}
            className={styles.textarea}
            placeholder="Enter plugin description"
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="version">Plugin Version</label>
          <input
            type="text"
            id="version"
            name="version"
            value={plugin.version}
            onChange={handleFormChange}
            placeholder="Enter plugin version"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="isActive">Is Active</label>
          <div className={styles.toggleWrapper}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={plugin.isActive}
                onChange={(e) => {
                  // Call handleFormChange to update state
                  handleFormChange(e);
                  handlePluginUpdate(e);
                }}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
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
