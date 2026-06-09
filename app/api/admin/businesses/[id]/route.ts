import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    await db.query('UPDATE businesses SET status = ? WHERE id = ?', [status, id]);

    return NextResponse.json({ message: 'Business updated' });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await db.query('DELETE FROM businesses WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Business deleted' });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
  }
}