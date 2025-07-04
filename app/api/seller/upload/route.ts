import { verifyAuthToken } from '@/lib/auth';

export async function POST(req: Request) {
  const user = verifyAuthToken(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (user.role !== 'SELLER') {
    return new Response(JSON.stringify({ error: 'Forbidden: Seller access only' }), { status: 403 });
  }

  // Continue with upload logic
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
