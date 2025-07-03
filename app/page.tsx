// app/page.tsx
'use client';

export default async function Home() {
  try {
    // Example SSR fetch or logic
    return (
      <div>
        <h1>Hello from Photo Marketplace!</h1>
      </div>
    );
  } catch (err) {
    console.error('SSR homepage error:', err); // ✅ This logs to server
    return <div>Something went wrong.</div>;
  }
}
