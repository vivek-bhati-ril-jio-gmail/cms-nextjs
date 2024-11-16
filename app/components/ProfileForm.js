import { useState } from 'react';
import styles from '../admin/profile/page.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons for password visibility toggle

export default function ProfileForm({ user }) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: '', // For password
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
          <label htmlFor="password">Password</label>
          <div className={styles.passwordContainer}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            <div className={styles.passwordToggle} onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
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
