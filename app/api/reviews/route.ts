import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('business_id');
  
  if (!businessId) {
    return NextResponse.json({ error: 'business_id required' }, { status: 400 });
  }

  const [rows] = await db.query(
    'SELECT * FROM reviews WHERE business_id = ? ORDER BY created_at DESC',
    [businessId]
  );
  
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { business_id, reviewer_name, rating, comment } = await request.json();

  if (!business_id || !reviewer_name || !rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await db.query(
    'INSERT INTO reviews (business_id, reviewer_name, rating, comment) VALUES (?, ?, ?, ?)',
    [business_id, reviewer_name, rating, comment]
  );

  return NextResponse.json({ message: 'Review submitted!' }, { status: 201 });
}