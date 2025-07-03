// app/page.tsx
'use client';

export default async function Home() {
  try {
    // TEMP: Fake crash to force logging, remove after test
    // throw new Error("Testing SSR crash");

    return (
      <div>
        <h1>Hello from Photo Marketplace!</h1>
      </div>
    );
  } catch (err) {
    console.error('SSR homepage error:', err);
    return <div>Something went wrong on homepage</div>;
  }
}
