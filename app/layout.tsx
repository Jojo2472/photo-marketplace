// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {(() => {
          try {
            return children;
          } catch (err) {
            console.error('❌ SSR Error:', err);
            return <div>Something went wrong on the server.</div>;
          }
        })()}
      </body>
    </html>
  );
}
