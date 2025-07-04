// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BUYER', // ✅ Must match Supabase enum exactly
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || 'Something went wrong');
    } else {
      router.push('/verify-email'); // ✅ Redirect to email verification page
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full p-2 border rounded"
          required
          onChange={handleChange}
          value={form.role}
        >
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
        </select>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </main>
  );
}
