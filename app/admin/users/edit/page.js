'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css'; // Add your styles here

export default function UserForm() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'authenticated',
    isActive: true,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get the 'id' from query string

  // If we have an ID, fetch the user data for editing
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/${id}`); // Get user by ID
          const data = await res.json();
          setUser(data); // Populate the form with the user data
        } catch (error) {
          alert('Error fetching user');
        }
      };
      fetchUser();
    }
  }, [id]); // Only fetch if `id` is available

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox values
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST'; // Use PUT if we're editing, otherwise POST
      const res = await fetch(`/api/users/${id || ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        router.push('/admin/users'); // Redirect back to user list
      } else {
        alert('Error saving user');
      }
    } catch (error) {
      alert('Error saving user');
    }
  };

  if (!id && !user.username) {
    // Show a loading message or spinner until `id` and `user` are available
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.formTitle}>{id ? 'Edit User' : 'Create New User'}</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required={!id} // Don't require password if it's an edit operation
          />
        </div>
        <div className={styles.formGroup}>
          <label>Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            required
          >
            <option value="authenticated">Authenticated</option>
            <option value="content_editor">Content Editor</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        {/* Toggle Switch for Active */}
        <div className={styles.formGroup}>
          <label>Active</label>
          <label className={styles.switch}>
            <input
              type="checkbox"
              name="isActive"
              checked={user.isActive}
              onChange={handleChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.formButtons}>
          <button type="submit" className={styles.btnSubmit}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
