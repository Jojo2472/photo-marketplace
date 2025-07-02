// File: pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.message);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required className="w-full border p-2 rounded" />
        <select name="role" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}