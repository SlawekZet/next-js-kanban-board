// src/app/api/createDashboardsNode/route.ts

import { database } from '@/app/lib/firebase/config';
import { ref, set } from 'firebase/database';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { uid, data } = await req.json();
    const dashboardsRef = ref(database, `dashboards/${uid}/boards`);
    await set(dashboardsRef, data);
    return NextResponse.json(
      { message: 'Data updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: 'Error saving data: ' + err.message },
      { status: 500 }
    );
  }
}
