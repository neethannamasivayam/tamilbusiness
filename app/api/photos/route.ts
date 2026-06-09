import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('business_id');

    if (!businessId) {
      return NextResponse.json({ error: 'business_id required' }, { status: 400 });
    }

    const [rows] = await db.query(
      'SELECT * FROM photos WHERE business_id = ? ORDER BY created_at DESC',
      [businessId]
    ) as any[];

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { business_id, url } = await request.json();

    if (!business_id || !url) {
      return NextResponse.json({ error: 'business_id and url required' }, { status: 400 });
    }

    await db.query(
      'INSERT INTO photos (business_id, url) VALUES (?, ?)',
      [business_id, url]
    );

    return NextResponse.json({ message: 'Photo saved!' }, { status: 201 });
  } catch (error) {
    console.error('Error saving photo:', error);
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 });
  }
}