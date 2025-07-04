'use client';

import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwt.decode(token);
      if (decoded && typeof decoded === 'object' && 'email' in decoded && 'userId' in decoded) {
        setUser({ email: decoded.email as string, id: decoded.userId as string });
      }
    } catch (err) {
      console.error('Failed to decode token', err);
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome back, {user.email}!</h1>
      <p>Your user ID is: {user.id}</p>
    </div>
  );
}
