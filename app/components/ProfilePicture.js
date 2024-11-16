import { useState } from 'react';
import styles from '../admin/profile/page.module.css';

export default function ProfilePicture({ profilePicture }) {
  const [image, setImage] = useState(profilePicture);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);  // Update the preview image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profilePictureContainer}>
      <img src={image || '/default-avatar.png'} alt="Profile" className={styles.profilePicture} />
      <input type="file" accept="image/*" onChange={handleImageChange} className={styles.uploadInput} />
      <p className={styles.uploadText}>Change Profile Picture</p>
    </div>
  );
}
