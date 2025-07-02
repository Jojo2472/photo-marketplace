'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Dummy auth check (replace with your real auth later)
const isUserLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('authToken');
};

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isUserLoggedIn());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/auth/login';
  };

  return (
    <header className="bg-deep-purple-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-90">
          👣 Peakabooo
        </Link>

        {/* Nav */}
        <nav className="flex items-center space-x-6 text-sm sm:text-base">
          {!loggedIn ? (
            <>
              <Link href="/auth/login" className="hover:underline">
                Login
              </Link>
              <Link href="/auth/register" className="hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
              <img
                src="/default-avatar.png"
                alt="User avatar"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
