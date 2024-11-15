'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [user, setUser] = useState(null); // Store user state
  const router = useRouter();

  useEffect(() => {
    const authToken = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));

    if (authToken) {
      setUser({ role: 'authenticated' });
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
