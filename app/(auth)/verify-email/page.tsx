// app/(auth)/verify-email/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div>
      <h1>Verify Email</h1>
      <p>Token: {token}</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}

