import jwt from 'jsonwebtoken';
import { createClient } from '@/utils/supabase/server';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

export function verifyAuthToken(req: Request): { userId: string; role: string } | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}

export async function getUserIdFromRequest(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}


