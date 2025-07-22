'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Call your local Next.js API route
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/profile');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Login failed');
      }
    } catch {
      setError('Network error, please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-700 via-purple-900 to-black px-6 py-12 overflow-hidden">
      {/* Background flair blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-600 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-[20%] right-[-20%] w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-[-15%] left-[15%] w-80 h-80 bg-indigo-700 rounded-full opacity-25 blur-3xl animate-blob"></div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-purple-600 z-10">
        <h2 className="text-3xl font-semibold text-purple-300 mb-8 text-center tracking-wide">
          ✨ Welcome Back to LolaPrint ✨
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-md bg-purple-900 bg-opacity-30 placeholder-purple-400 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-md bg-purple-900 bg-opacity-30 placeholder-purple-400 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-purple-900 font-bold py-3 rounded-md shadow-md hover:brightness-110 transition"
          >
            Sign In
          </button>
        </form>
        {error && (
          <p className="mt-4 text-center text-red-400 font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
