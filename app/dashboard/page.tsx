// app/dashboard/page.tsx

import Link from "next/link";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .eq("user_id", session.user.id);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Albums</h1>
        <Link
          href="/dashboard/albums/new"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          New Album
        </Link>
      </div>

      {albums?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/dashboard/albums/${album.id}`}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg">{album.name}</h2>
              <p className="text-sm text-gray-500">{album.description}</p>
              <div className="mt-4 flex justify-between">
                <span className="text-xs text-gray-400">
                  Created: {new Date(album.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No albums yet. Create one to get started.</p>
      )}
    </div>
  );
}
