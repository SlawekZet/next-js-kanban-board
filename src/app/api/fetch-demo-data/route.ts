import { database } from '@/app/lib/firebase/config';
import { get, ref } from 'firebase/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await get(ref(database, 'demo/boards'));
    const data = snapshot.val();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Error fetching demo document' },
      { status: 500 }
    );
  }
}
