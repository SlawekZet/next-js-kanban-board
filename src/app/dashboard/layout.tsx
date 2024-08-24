'use client';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useKanbanTaskManagerContext } from '../lib/contexts/KanbanTaskManagerContext';
import { auth } from '../lib/firebase/config';
import { Navbar } from '../ui/dashboard/Navbar';
import Sidebar from '../ui/dashboard/Sidebar';
import { SplashScreen } from '../ui/utils/SplashScreen';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setBoards, setBoardToRender, boards } = useKanbanTaskManagerContext();
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const response = await fetch('http://localhost:3000/api/fetch-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: user.uid }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();

          setBoards(data);
          setBoardToRender(data[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (boards.length === 0) {
    return <SplashScreen />;
  }

  return isLoading ? (
    <SplashScreen />
  ) : (
    <>
      <Sidebar />
      <div className="flex flex-col w-screen h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
}
