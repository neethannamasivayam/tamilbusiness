import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { business_name, business_email, sender_name, sender_email, sender_phone, message } = await request.json();

    if (!sender_name || !sender_email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
    }

    if (!business_email) {
      return NextResponse.json({ error: 'This business has no contact email.' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'TamilBusiness <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      reply_to: sender_email,
      subject: `New message for ${business_name} from ${sender_name}`,
      html: `
        <h2>New Contact Message via TamilBusiness.com</h2>
        <p>Someone has sent a message to <strong>${business_name}</strong></p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>From</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${sender_name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${sender_email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${sender_phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${message}</td></tr>
        </table>
        <br>
        <p style="color: #666; font-size: 14px;">Reply directly to this email to respond to ${sender_name}.</p>
      `,
    });

    return NextResponse.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}