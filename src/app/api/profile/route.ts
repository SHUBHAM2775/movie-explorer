
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/app/models/User';
import { connectToDatabase } from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';


export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, email, password } = await req.json();
  const update: any = {};
  if (name !== undefined && name !== null && name !== "") update.name = name;
  if (email !== undefined && email !== null && email !== "") update.email = email;
  if (password) update.password = await bcrypt.hash(password, 10);

  try {
    const userDoc = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { new: true }
    );
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userDoc.toObject();
    return NextResponse.json({ message: 'Profile updated', user: { name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
