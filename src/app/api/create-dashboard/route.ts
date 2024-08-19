// src/app/api/createDashboardsNode/route.ts

import { database } from '@/app/lib/firebase/config';
import { ref, set } from 'firebase/database';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const initialData = {
    boards: [
      {
        id: uuidv4(),
        name: 'Your First Board',
        columns: [
          {
            id: uuidv4(),
            name: 'Your first Column',
            tasks: [
              {
                description: '',
                id: uuidv4(),
                status: 'Your first Column',
                title: 'Your first task',
                subtasks: [
                  {
                    id: uuidv4(),
                    isCompleted: false,
                    title: 'Your first Subtask',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const { uid } = await req.json();
    const dashboardsRef = ref(database, `dashboards/${uid}`);
    await set(dashboardsRef, initialData);
    return NextResponse.json(
      { message: 'Dashboard created successfully' },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: 'Error creating dashboard: ' + err.message },
      { status: 500 }
    );
  }
}
