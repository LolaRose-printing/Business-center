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
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          password,
          provider: 'LOCAL',
          company: accountType === 'BUSINESS' ? companyName : null,
          accountType, // optional if backend wants it
        }),
      });

      if (res.ok) {
        router.push('/profile');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Sign up failed');
      }
    } catch {
      setError('Network error, please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Create your account</h1>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">Are you signing up as:</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setAccountType('INDIVIDUAL'); handleNext(); }}
              className="border border-gray-300 rounded-lg p-4 hover:border-blue-500 focus:outline-none focus:ring-2"
            >
              ✨ Individual
            </button>
            <button
              onClick={() => { setAccountType('BUSINESS'); handleNext(); }}
              className="border border-gray-300 rounded-lg p-4 hover:border-blue-500 focus:outline-none focus:ring-2"
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
            className="border rounded p-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="border rounded p-3"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          {accountType === 'BUSINESS' && (
            <input
              type="text"
              placeholder="Company Name"
              className="border rounded p-3"
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
            className="border rounded p-3"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded p-3"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-black text-white py-3 rounded hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        </form>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {step === 2 && (
        <button
          onClick={() => setStep(1)}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          ← Back
        </button>
      )}
    </div>
  );
};

export default SignUpPage;
