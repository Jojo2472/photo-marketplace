'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function UploadPhotoInAlbum() {
  const { id: albumId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    price: '',
    image: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image || !albumId) {
      setError('Please select an image and provide all required fields.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload to Cloudinary
      const uploadData = new FormData();
      uploadData.append('file', form.image);
      uploadData.append('upload_preset', 'your_unsigned_preset'); // Replace with your actual preset

      const cloudRes = await axios.post(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your Cloudinary URL
        uploadData
      );

      const originalUrl = cloudRes.data.secure_url;

      const previewUrl = originalUrl.replace(
        '/upload/',
        '/upload/e_blur:1000,l_text:arial_50_bold:No%20Refunds,g_south,y_30/'
      );

      await axios.post('/api/photos/upload', {
        title: form.title,
        description: form.description,
        tags: form.tags,
        price: parseFloat(form.price),
        albumId,
        originalUrl,
        previewUrl,
      });

      router.push(`/dashboard/albums/${albumId}`);
    } catch (err) {
      console.error(err);
      setError('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Photo to Album</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Photo Title"
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
          disabled={uploading}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
}
