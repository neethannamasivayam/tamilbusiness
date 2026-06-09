import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, category, description, phone, email, website, address, city, country } = await request.json();

    if (!name || !category || !city || !country) {
      return NextResponse.json({ error: 'Name, category, city and country are required.' }, { status: 400 });
    }

    await db.query(
      `INSERT INTO businesses (name, category, description, phone, email, website, address, city, country, status, is_premium)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0)`,
      [name, category, description || '', phone || '', email || '', website || '', address || '', city, country]
    );

    // Send email notification
    await resend.emails.send({
      from: 'TamilBusiness <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New Business Submission: ${name}`,
      html: `
        <h2>New Business Submitted</h2>
        <p>A new business has been submitted for review on TamilBusiness.com</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Category</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${category}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>City</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${city}, ${country}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Website</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${website || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${address || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Description</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${description || 'N/A'}</td></tr>
        </table>
        <br>
        <a href="https://tamilbusiness.com/admin" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Review in Admin Panel →
        </a>
      `,
    });

    return NextResponse.json({ message: 'Business submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Failed to submit business.' }, { status: 500 });
  }
}