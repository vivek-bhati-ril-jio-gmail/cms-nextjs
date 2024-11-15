'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // Importing styles
import cookie from 'cookie';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Set the JWT token as a cookie
      document.cookie = cookie.serialize('auth_token', data.auth_token, {
        httpOnly: true,   // Secure, accessible only by the server
        secure: process.env.NODE_ENV === 'production',  // Only secure cookies in production
        maxAge: 3600,     // Expiry time for the cookie (1 hour)
        path: '/',        // Cookie accessible across the entire app
        sameSite: 'Strict', // SameSite policy to prevent CSRF
      });

      router.push('/admin/dashboard');  // Redirect to dashboard on successful login
    } else {
      setError(data.msg);  // Show error message
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Login</button>
        </form>
        <p className={styles.signupPrompt}>
          Don't have an account? <a href="/signup" className={styles.signupLink}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
