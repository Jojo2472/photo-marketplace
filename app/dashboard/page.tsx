// app/dashboard/page.tsx
import { getTokenData } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return redirect('/login');
  }

  const user = getTokenData(token); // this should decode and verify the token

  if (!user) {
    return redirect('/login');
  }

  return (
    <div>
      <h1>Welcome back, {user.email}!</h1>
      <p>Your user ID is: {user.id}</p>
    </div>
  );
}
