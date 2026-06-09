import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

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

    return NextResponse.json({ message: 'Business submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Failed to submit business.' }, { status: 500 });
  }
}