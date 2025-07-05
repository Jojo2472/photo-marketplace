//app/dashboard/albums/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function NewAlbumPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg('You must be logged in to create an album.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('albums')
      .insert([
        {
          title,
          description,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error || !data) {
      setErrorMsg('Failed to create album.');
      setLoading(false);
      return;
    }

    // ✅ This is where we redirect after successful album creation
    router.push(`/dashboard/albums/${data.id}?upload=1`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create a New Album</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Album Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="e.g., Poolside Glamour"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Album Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Add details or themes about this album (optional)"
          />
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          {loading ? 'Creating...' : 'Create Album'}
        </button>
      </form>
    </div>
  );
}


