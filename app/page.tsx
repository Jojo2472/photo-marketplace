// app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-800">
          Welcome to Peakabooo 👣
        </h1>

        <div className="space-y-4">
          <p className="text-xl text-gray-700">
            <strong>For Buyers:</strong> If you love feet, this is where you want to be!
          </p>
          <p className="text-xl text-gray-700">
            <strong>For Sellers:</strong> Do you have pretty feet? Make money selling pictures of them — you can remain 100% anonymous!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <Link
            href="/register"
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-full text-lg"
          >
            Register Here
          </Link>
          <Link
            href="/login"
            className="bg-white text-purple-700 border border-purple-700 hover:bg-purple-50 px-6 py-3 rounded-full text-lg"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
