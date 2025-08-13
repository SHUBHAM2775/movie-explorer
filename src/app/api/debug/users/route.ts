import { NextResponse } from "next/server";
import User from "../../../models/User";
import { connectToDatabase } from "../../../lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}, { password: 0 }); // Exclude password
    return NextResponse.json({ users });
  } catch (err: unknown) {
    if (typeof err === 'object' && err && 'message' in err) {
      return NextResponse.json({ error: (err as { message?: string }).message || "Internal Server Error" }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
