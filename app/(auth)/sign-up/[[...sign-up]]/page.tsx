'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://server.lolaprint.us';

const SignUpPage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [accountType, setAccountType] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    if (accountType === 'BUSINESS') {
      if (!companyName || companyName.length < 3 || companyName.length > 128) {
        setError('Company name must be between 3 and 128 characters');
        return;
      }
    }
  
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          password,
          company: accountType === 'BUSINESS' ? companyName : null,
          userType: accountType,  // ✅ matches your backend
        }),
      });
  
      if (res.ok) {
        router.push('/sign-in'); // ✅ or '/profile' if you prefer
      } else {
        const errData = await res.json();
        setError(errData.message || 'Sign up failed');
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
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-300 tracking-wide">
          Create your account
        </h1>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-purple-200">
              Are you signing up as:
            </h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setAccountType('INDIVIDUAL'); handleNext(); }}
                className="border border-purple-400 rounded-lg p-4 text-purple-100 hover:border-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
              >
                ✨ Individual
              </button>
              <button
                onClick={() => { setAccountType('BUSINESS'); handleNext(); }}
                className="border border-purple-400 rounded-lg p-4 text-purple-100 hover:border-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
              >
                🏢 Business
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="rounded-md bg-purple-900 bg-opacity-30 placeholder-purple-400 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              className="rounded-md bg-purple-900 bg-opacity-30 placeholder-purple-400 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            {accountType === 'BUSINESS' && (
              <input
                type="text"
                placeholder="Company Name"
                className="rounded-md bg-purple-900 bg-opacity-30 placeholder-purple-400 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
                minLength={3}
                maxLength={128}
              />
            )}
            <input
              type="password"
              placeholder="Password"
              className="rounded-md bg-purple-900 bg-opacity-30 placeholder-purple-400 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="rounded-md bg-purple-900 bg-opacity-30 placeholder-purple-400 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-purple-900 font-bold py-3 rounded-md shadow-md hover:brightness-110 transition"
            >
              Create Account
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-center text-red-400 font-medium animate-pulse">
            {error}
          </p>
        )}

        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-sm text-yellow-300 hover:underline"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
