// app/dashboard/albums/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function AlbumDetailPage() {
  const params = useParams();

  return (
    <div>
      <h1>Album ID: {params.id}</h1>
      {/* Add any album detail view here */}
    </div>
  );
}
