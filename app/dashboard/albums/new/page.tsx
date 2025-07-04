'use client';

import { useEffect, useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'supersecret';

export default function DashboardPage() {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome back, {user.email}!</h1>
      <p>Your user ID is: {user.userId}</p>
    </div>
  );
}
