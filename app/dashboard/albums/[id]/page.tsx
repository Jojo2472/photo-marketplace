// app/dashboard/albums/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function AlbumDetailPage() {
  const params = useParams();
  const id = params?.id;

  console.log("AlbumDetailPage loaded");

  return (
    <div>
      <h1>Album Detail Page</h1>
      <p>Album ID: {id}</p>
      {/* Add any album detail view here */}
    </div>
  );
}

