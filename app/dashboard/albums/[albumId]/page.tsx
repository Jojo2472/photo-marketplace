import dynamic from 'next/dynamic';

const AlbumClient = dynamic(() => import('./AlbumClient'), {
  ssr: false,
  loading: () => <div>Loading album...</div>, // <- this helps prevent the build error
});

export default function AlbumPage() {
  return (
    <div>
      <AlbumClient />
    </div>
  );
}

