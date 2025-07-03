// app/page.tsx
'use client';

import Link from 'next/link';

export default async function Home() {
  try {
    // your existing logic or fetch
    return (
      <div>
        <h1>Hello from Photo Marketplace!</h1>
      </div>
    );
  } catch (err) {
    console.error('SSR homepage error:', err);
    return <div>Something went wrong</div>;
  }
}
