// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request) {
  const body = await req.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: cookieStore });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message || 'Invalid credentials' },
      { status: 401 }
    );
  }

  // This response will automatically set the Supabase session cookie
  return NextResponse.json({ message: 'Logged in!' });
}

