import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Database } from "@/types/supabase";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const albumId = params.id;

  // Optional: delete related photos too if you want
  await supabase.from("photos").delete().eq("album_id", albumId);

  const { error } = await supabase
    .from("albums")
    .delete()
    .eq("id", albumId)
    .eq("user_id", user.id); // ensure only the album owner can delete

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Album deleted successfully" });
}
