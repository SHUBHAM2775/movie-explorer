import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM;

if (!process.env.RESEND_API_KEY || !FROM) {
  throw new Error('RESEND_API_KEY and RESEND_FROM must be set in environment variables');
}

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  return resend.emails.send({
    from: FROM!,
    to,
    subject,
    html,
  });
}
