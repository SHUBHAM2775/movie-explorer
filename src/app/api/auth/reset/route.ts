import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(payload.userId, { password: hashed });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Password reset successful' });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}
