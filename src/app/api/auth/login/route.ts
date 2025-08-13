// This route is no longer needed with NextAuth.js. You can remove or leave as a stub.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Use NextAuth for login." }, { status: 400 });
}
