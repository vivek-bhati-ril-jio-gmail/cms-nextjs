import { useState } from 'react';
import styles from '../admin/profile/page.module.css';

export default function ProfileForm({ user }) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    bio: user.bio || '',
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user/updateProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Profile updated successfully');
    } else {
      alert('Error updating profile');
    }
  };

  return (
    <div className={styles.profileForm}>
      <h2 className={styles.formTitle}>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Write something about yourself"
          />
        </div>
        <div className={styles.formGroup}>
          <button type="submit" className={styles.submitBtn}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
