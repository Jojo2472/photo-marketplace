// /app/upload/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UploadPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    price: '',
    albumId: '',
    image: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch seller's albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get('/api/albums'); // this will need to exist
        setAlbums(res.data);
      } catch (err) {
        setError('Failed to load albums.');
      }
    };
    fetchAlbums();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image || !form.albumId) {
      setError('Please select an image and album.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload to Cloudinary
      const uploadData = new FormData();
      uploadData.append('file', form.image);
      uploadData.append('upload_preset', 'your_unsigned_preset'); // replace with yours

      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
        uploadData
      );

      const originalUrl = cloudinaryRes.data.secure_url;

      // Build blurred + watermarked preview URL
      const previewUrl = originalUrl.replace(
        '/upload/',
        '/upload/e_blur:1000,l_text:arial_50_bold:No%20Refunds,g_south,y_30/'
      );

      // Save to your backend (which should insert into PostgreSQL)
      await axios.post('/api/photos/upload', {
        title: form.title,
        description: form.description,
        tags: form.tags,
        price: parseFloat(form.price),
        albumId: form.albumId,
        originalUrl,
        previewUrl,
      });

      router.push('/dashboard'); // or wherever you want
    } catch (err) {
      console.error(err);
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload a New Photo</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          className="w-full border p-2 rounded"
          value={form.tags}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price (USD)"
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={handleChange}
          required
        />

        <select
          name="albumId"
          className="w-full border p-2 rounded"
          value={form.albumId}
          onChange={handleChange}
          required
        >
          <option value="">Select an album</option>
          {albums.map((album: any) => (
            <option key={album.id} value={album.id}>
              {album.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded w-full"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
}
