import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/User';

import jwt from 'jsonwebtoken';
import { sendMail } from '@/app/lib/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const user = await User.findOne({ email });
  if (!user) {
    // For security, don't reveal if user exists
    return NextResponse.json({ message: 'If that email exists, a reset link will be sent.' });
  }
  try {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset?token=${token}`;
    await sendMail({
      to: email,
      subject: 'Reset your Movie Explorer password',
      html: `<p>Click the link below to reset your password:</p><p><a href=\"${resetUrl}\">${resetUrl}</a></p>`
    });
    return NextResponse.json({ message: 'If that email exists, a reset link will be sent.' });
  } catch (err) {
    console.error('Forgot password email error:', err);
    return NextResponse.json({ error: 'Failed to send reset email. Please contact support or try again later.' }, { status: 500 });
  }
}
