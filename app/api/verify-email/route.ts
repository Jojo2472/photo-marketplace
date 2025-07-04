// app/api/verify-email/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Token missing' }, { status: 400 });
  }

  // Find user with matching verify_token
  const { data: user, error: findError } = await supabase
    .from('User')
    .select('*')
    .eq('verify_token', token)
    .single();

  if (findError || !user) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }

  // Update user to mark as verified
  const { error: updateError } = await supabase
    .from('User')
    .update({ email_verified: true, verify_token: null })
    .eq('id', user.id);

  if (updateError) {
    return NextResponse.json({ message: 'Failed to verify user' }, { status: 500 });
  }

  return NextResponse.redirect('http://localhost:3000/login');
}

