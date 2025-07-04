// lib/sendVerificationEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const link = `http://localhost:3000/verify-email?token=${token}`;

  try {
    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // can be updated if you verify your own domain
      to: [email],
      subject: 'Verify your Photo Marketplace email',
      html: `<p>Thanks for signing up! Click below to verify your email:</p>
             <p><a href="${link}">${link}</a></p>`,
    });

    if (error) {
      console.error('Resend email error:', error);
    }
  } catch (err) {
    console.error('Unexpected email error:', err);
  }
}
