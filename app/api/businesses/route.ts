import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

// GET all approved businesses
export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT * FROM businesses WHERE status = "approved" ORDER BY is_premium DESC, created_at DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
  }
}

// POST a new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, description, phone, email, website, address, city, country } = body;

    const [result] = await db.query(
      'INSERT INTO businesses (name, category, description, phone, email, website, address, city, country, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")',
      [name, category, description, phone, email, website, address, city, country]
    );

    return NextResponse.json({ message: 'Business submitted for approval!', result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit business' }, { status: 500 });
  }
}