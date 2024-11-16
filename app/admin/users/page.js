'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Import your updated styles here

export default function UserList() {
  const [users, setUsers] = useState([]); // State to hold the list of users
  const router = useRouter(); // Initialize the Next.js router

  // Fetch users on page load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users'); // Get all users from the API
        const data = await res.json(); // Parse the JSON response
        setUsers(data); // Update the state with the user data
      } catch (error) {
        alert('Error fetching users');
      }
    };

    fetchUsers(); // Fetch users when the component is mounted
  }, []); // Empty dependency array, so it only runs once

  const handleEdit = (id) => {
    router.push(`/admin/users/edit?id=${id}`); // Redirect to the edit page for the selected user
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE', // Send a DELETE request to the API
        });

        if (res.ok) {
          setUsers(users.filter(user => user.id !== id)); // Remove the user from the list
        } else {
          alert('Error deleting user');
        }
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageHeader}>User Management</h1>
      {/* <button onClick={() => router.push('/admin/users/new')} className={styles.btnSubmit}>Create New User</button> */}
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => handleEdit(user.id)} className={styles.btnEdit}>Edit</button>
                <button onClick={() => handleDelete(user.id)} className={styles.btnDelete}>Delete</button>
                {user.role == 'super_admin' && <button onClick={() => handleRequestAction(user.id)} className={styles.btnEdit}>RequestAction</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
