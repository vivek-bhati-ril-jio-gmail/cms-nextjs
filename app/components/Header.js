// app/components/Header.js

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [user, setUser] = useState(null); // Store user state
  const router = useRouter();

  // Check if the user is logged in (e.g., check for an auth token)
  useEffect(() => {
    const authToken = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));

    if (authToken) {
      setUser({ role: 'authenticated' }); // Mock user, replace with your actual logic
    }
  }, []);

  const handleLogout = () => {
    // Clear the auth token cookie
    document.cookie = 'auth_token=; path=/; max-age=0';
    setUser(null); // Update the user state
    router.push('/login'); // Redirect to the login page
  };

  return (
    user && (
      <header className="sticky-header">
        <div className="logo">
          <h2>Your Logo</h2>
        </div>
        <nav>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>
    )
  );
};

export default Header;
