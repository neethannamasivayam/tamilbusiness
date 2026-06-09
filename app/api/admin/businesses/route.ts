import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

// GET businesses by status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const [rows] = await db.query(
      'SELECT * FROM businesses WHERE status = ? ORDER BY created_at DESC',
      [status]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
  }
}

// PATCH - update business status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    await db.query(
      'UPDATE businesses SET status = ? WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}