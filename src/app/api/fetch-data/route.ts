import { database } from '@/app/lib/firebase/config';
import { get, ref } from 'firebase/database';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    const snapshot = await get(ref(database, `dashboards/${uid}/boards`));
    const data = snapshot.val();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Error fetching data from the database' },
      { status: 500 }
    );
  }
}
