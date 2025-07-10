'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AlbumModal({ onAlbumCreated }: { onAlbumCreated?: () => void }) {
  const supabase = createBrowserClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('You must be logged in.');
      setCreating(false);
      return;
    }

    let cover_url = null;

    if (coverFile) {
      const filePath = `covers/${user.id}/${Date.now()}-${coverFile.name}`;
      const { error: uploadError } = await supabase.storage.from('album-covers').upload(filePath, coverFile);

      if (uploadError) {
        setError('Cover upload failed: ' + uploadError.message);
        setCreating(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('album-covers').getPublicUrl(filePath);
      cover_url = urlData?.publicUrl ?? null;
    }

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
      setError('Album creation failed: ' + insertError.message);
      setCreating(false);
      return;
    }

    if (onAlbumCreated) onAlbumCreated();
    setOpen(false);
    router.push(`/dashboard/albums/${data.id}?upload=1`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          + Create New Album
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full space-y-4">
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
      </DialogContent>
    </Dialog>
  );
}
