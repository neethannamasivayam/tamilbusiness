import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const [rows] = await db.query(
    'SELECT * FROM businesses WHERE id = ? AND status = "approved"',
    [id]
  ) as any[];
  
  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(rows[0]);
}