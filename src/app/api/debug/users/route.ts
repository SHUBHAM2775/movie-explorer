import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User";
import { connectToDatabase } from "../../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const users = await User.find({}, { password: 0 }); // Exclude password
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
