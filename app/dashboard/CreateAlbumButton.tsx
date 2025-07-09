// app/dashboard/CreateAlbumButton.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/utils/supabase/client';

export default function CreateAlbumButton() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    setCreating(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('You must be logged in.');
      setCreating(false);
      return;
    }

    let cover_url = null;

    // Upload cover image if provided
    if (coverFile) {
      const filePath = `covers/${user.id}/${Date.now()}-${coverFile.name}`;
      const { error: uploadError } = await supabase
        .storage
        .from('album-covers')
        .upload(filePath, coverFile);

      if (uploadError) {
        setError('Cover upload failed: ' + uploadError.message);
        setCreating(false);
        return;
      }

      const { data: urlData } = supabase
        .storage
        .from('album-covers')
        .getPublicUrl(filePath);

      cover_url = urlData?.publicUrl ?? null;
    }

    // Insert album
    const { data, error: insertError } = await supabase
      .from('albums')
      .insert({
        name,
        description,
        cover_url,
        user_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      setError('Failed to create album: ' + insertError.message);
      setCreating(false);
      return;
    }

    // Redirect to album's upload page
    router.push(`/dashboard/albums/${data.id}?upload=1`);
  };

  return (
    <div className="p-4 border rounded-md space-y-4 max-w-md bg-white shadow-md">
      <h2 className="text-lg font-semibold">Create New Album</h2>

      <input
        type="text"
        placeholder="Album name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setCoverFile(e.target.files[0]);
          }
        }}
      />

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={creating}
        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded w-full"
      >
        {creating ? 'Creating Album...' : 'Create Album'}
      </button>
    </div>
  );
}
