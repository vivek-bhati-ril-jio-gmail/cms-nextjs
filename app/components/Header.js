'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';  // Import jwt from the jsonwebtoken package

const Header = () => {
  const [user, setUser] = useState(null); // Store user state
  const router = useRouter();

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
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; max-age=0';
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky-header">
      <div className="logo">
        {/* Display logo */}
        <img src="/images/logo.png" alt="CMS Logo" width={150} />
      </div>
      <nav>
        <ul>
          {user ? ( ( user.role === 'super_admin' ? (
            <>
              <li><a href="/admin/dashboard">Dashboard</a></li>
              <li><a href="/admin/posts">Post List</a></li>
              <li><a href="/admin/profile">Profile</a></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><a href="/posts">{user.role}</a></li>
            </>
            )) ) : (
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
