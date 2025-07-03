// app/layout.tsx
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  try {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  } catch (err) {
    console.error('SSR layout error:', err);
    return <html><body><div>Layout failed</div></body></html>;
  }
}

