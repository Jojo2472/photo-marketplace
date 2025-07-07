// app/dashboard/albums/[albumId]/page.tsx
import dynamic from 'next/dynamic';

const AlbumClient = dynamic(() => import('./AlbumClient'), {
  ssr: false,
  loading: () => <div>Loading album page...</div>,
});

export default function AlbumPage() {
  // 💡 Add something *static* to prevent hydration bug
  return (
    <>
      <div suppressHydrationWarning={true} className="sr-only">
        Server-rendered fallback
      </div>
      <AlbumClient />
    </>
  );
}

