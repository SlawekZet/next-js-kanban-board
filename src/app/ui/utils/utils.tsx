import { Board } from './BoardInterfaces';

export async function dataSave(uid: string, data: Board[]) {
  const dataSave = async () => {
    const response = await fetch('http://localhost:3000/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: uid,
        data: data,
      }),
    });
  };
  dataSave();
}
