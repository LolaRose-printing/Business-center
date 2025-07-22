'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [accountType, setAccountType] = useState<'INDIVIDUAL' | 'BUSINESS'>('INDIVIDUAL');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // New states for names
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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
          accountType,
          firstName: firstName || null,
          lastName: lastName || null,
        }),
      });

      if (res.ok) {
        router.push('/sign-in');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Sign up failed');
      }
    } catch {
      setError('Network error, please try again.');
    }
  };

  return (
    <div>
      {/* ... your existing layout and step 1 ... */}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Existing inputs */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="..." // your styling
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="..."
          />

          {/* New inputs for first and last name */}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="..."
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="..."
          />

          {accountType === 'BUSINESS' && (
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
              minLength={3}
              maxLength={128}
              className="..."
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="..."
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="..."
          />

          <button type="submit" className="...">
            Create Account
          </button>
        </form>
      )}

      {/* error display, back button, etc */}
    </div>
  );
};

export default SignUpPage;
