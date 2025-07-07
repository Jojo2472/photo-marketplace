import dynamic from 'next/dynamic';

const AlbumClient = dynamic(() => import('./AlbumClient'), { ssr: false });

export default function AlbumPage() {
  return <AlbumClient />;
}
