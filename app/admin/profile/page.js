'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css'; // Importing CSS module for styling
import ProfileForm from '../../components/ProfileForm';
import ProfilePicture from '../../components/ProfilePicture';
import jwt from 'jsonwebtoken';  // Import jwt from the jsonwebtoken package


export default function ProfilePage() {
  const [user, setUser] = useState(null);

  // Fetch the user's profile from an API endpoint or state management (assuming the API fetch is available)
  useEffect(() => {
    const authToken = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));

    if (authToken) {
      // Extract the token value
      const token = authToken.split('=')[1];

      // Decode the token to get the user data
      const decoded = jwt.decode(token, process.env.JWT_SECRET);  // Decode the token

      if (decoded && decoded.user) {
        setUser(decoded.user);  // Store the decoded user data (e.g., id, email, role)
      } else {
        setUser(authToken);  // If the token is invalid or doesn't contain user data, clear user state
      }
    }
    else {
      setUser(null);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <ProfilePicture profilePicture={user.profilePicture} />
        <div className={styles.profileInfo}>
          <h1 className={styles.username}>{user.username}</h1>
          <p className={styles.userEmail}>Email: {user.email}</p>
          <p className={styles.userRole}>Role: {user.role}</p>
          <p className={styles.userStatus}>Status: {user.status === '1' ? 'Active' : 'Blocked'}</p>
          <p className={styles.registrationDate}>Joined: {new Date(user.registeredAt * 1000).toLocaleDateString()}</p>
        </div>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
