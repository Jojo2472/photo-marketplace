'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AlbumDetailPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const params = useParams();

  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const albumId = params.id as string;

  useEffect(() => {
    const fetchAlbum = async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single();

      if (!error) {
        setAlbum(data);
      }
      setLoading(false);
    };

    fetchAlbum();
  }, [albumId, supabase]);

  useEffect(() => {
    // Check if ?upload=1 is in the URL
    const uploadParam = searchParams.get('upload');
    if (uploadParam === '1') {
      setShowUploadModal(true);
    }
  }, [searchParams]);

  if (loading) {
    return <p className="p-4">Loading album...</p>;
  }

  if (!album) {
    return <p className="p-4 text-red-500">Album not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
      {album.description && (
        <p className="text-gray-700 mb-4">{album.description}</p>
      )}

      {/* Example photo grid placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* You can map photos here */}
        <div className="w-full h-40 bg-gray-200 rounded" />
        <div className="w-full h-40 bg-gray-200 rounded" />
        <div className="w-full h-40 bg-gray-200 rounded" />
        <div className="w-full h-40 bg-gray-200 rounded" />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Upload Photos</h2>
            {/* Replace this with your actual upload component */}
            <p>Upload form goes here...</p>
            <button
              onClick={() => setShowUploadModal(false)}
              className="mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
