'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function AlbumDetailPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`/api/albums/${id}`);
        setAlbum(res.data.album);
        setPhotos(res.data.photos || []);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load album.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAlbum();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{album.title}</h1>
      {album.description && <p className="text-gray-600 mb-4">{album.description}</p>}

      {photos.length === 0 ? (
        <p className="text-gray-500">No photos in this album yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="border rounded overflow-hidden">
              <img
                src={photo.preview_url}
                alt={photo.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-2">
                <p className="text-sm font-medium">{photo.title}</p>
                <p className="text-xs text-gray-500">${photo.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
