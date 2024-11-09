// app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user');  // Example of getting user data
      const data = await res.json();
      setUser(data);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to the Dashboard, {user.username}!</h1>
      {/* Additional user info or dashboard features */}
    </div>
  );
}
