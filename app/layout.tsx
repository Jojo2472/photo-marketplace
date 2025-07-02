// app/layout.tsx
export const metadata = {
  title: 'Photo Marketplace',
  description: 'Buy and sell beautiful foot photos anonymously',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
