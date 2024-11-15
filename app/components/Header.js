'use client';  // This ensures the code runs client-side

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

const Header = () => {
  const [user, setUser] = useState(null); // Store user state
  const router = useRouter();

  useEffect(() => {
    // This will ensure that we are running on the client side
    if (typeof window !== "undefined") {
      // Function to get cookie value by name
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      // Get the JWT token from cookies
      const token = getCookie('auth_token');  // Replace with your actual cookie name
      console.log('Token:', token);  // For debugging

      if (token) {
        try {
          const decoded = jwt.decode(token);  // Decode the JWT token

          if (decoded) {
            setUser(decoded.userData);
          } else {
            setUser(null);  // Token is invalid or cannot be decoded
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setUser(null);  // In case of error, set user to null
        }
      } else {
        setUser(null);  // No token found in cookies
      }
    }
  }, []);  // This will run on page refresh and always update the user state based on the token

  const handleLogout = () => {
    // Remove the token cookie when logging out
    document.cookie = 'auth_token=; path=/; max-age=0';  // Clears the cookie
    setUser(null);  // Reset the user state
    router.push('/login');  // Redirect to login page
  };

  return (
    <header className="sticky-header">
      <div className="logo">
        {/* Display logo */}
        <img src="/images/logo.png" alt="CMS Logo" width={150} />
      </div>
      <nav>
        <ul>
          {user ? (
            <>
              <li><a href="/admin/dashboard">Dashboard</a></li>
              <li><a href="/admin/posts">Post List</a></li>
              <li><a href="/admin/pages">Page List</a></li>
              <li><a href="/admin/profile">Profile</a></li>
              <li><button onClick={handleLogout}>Logout</button></li>
              {user.role === 'super_admin' && <li><a href="/switch_theme/admin">Settings</a></li>}
            </>
          ) : (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
