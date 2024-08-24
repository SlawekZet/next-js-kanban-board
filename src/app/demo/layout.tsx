'use client';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useKanbanTaskManagerContext } from '../lib/contexts/KanbanTaskManagerContext';
import { auth } from '../lib/firebase/config';
import { Navbar } from '../ui/dashboard/Navbar';
import Sidebar from '../ui/dashboard/Sidebar';
import { SplashScreen } from '../ui/utils/SplashScreen';

export default function DemoLayout({
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
        const demoResponse = await fetch(
          'http://localhost:3000/api/fetch-demo-data'
        );

        if (!demoResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const demoData = await demoResponse.json();
        setBoards(demoData);
        setBoardToRender(demoData[0]);
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
    <dialog
      open
      className="self-center justify-self-center rounded-lg w-full backdrop:bg-gray6 backdrop:opacity-70 dark:bg-gray5 outline-none z-40"
    >
      <SplashScreen />
    </dialog>
  ) : (
    <>
      <Sidebar />
      <div className="flex flex-col justify-self-stretch w-screen h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
}
