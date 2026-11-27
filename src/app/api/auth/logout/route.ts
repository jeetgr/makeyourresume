import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", "", {
    expires: new Date(0),
  });

  cookieStore.set("refreshToken", "", {
    expires: new Date(0),
  });

  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
