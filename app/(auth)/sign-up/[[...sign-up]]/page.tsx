'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.lolaprint.us';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!company || company.length > 128) {
      setError('Company name is required and must be 128 characters or less');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, provider: 'LOCAL', company }),
      });

      if (res.ok) {
        router.push('/signin'); // redirect to sign in after successful signup
      } else {
        const errData = await res.json();
        setError(errData.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error, please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          required
          maxLength={128}
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />
        <button type="submit" style={{ width: '100%' }}>Sign Up</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    </div>
  );
};

export default SignUpPage;
