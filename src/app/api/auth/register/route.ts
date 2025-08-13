import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import { connectToDatabase } from "../../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    return NextResponse.json({ message: "User registered", user: { name: user.name, email: user.email } });
  } catch (err: unknown) {
    console.error("Register API error:", err);
    if (typeof err === 'object' && err && 'message' in err) {
      return NextResponse.json({ error: (err as { message?: string }).message || "Internal Server Error" }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
