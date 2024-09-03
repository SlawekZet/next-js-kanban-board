'use client';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { EyeIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '../../utils/buttons/Button';
import { BoardList } from '../../boards/BoardList';
import { ThemeSwitcher } from '../../dashboard/ThemeSwitcher';

export default function MobileMenu() {
  const {
    isSidebarHidden,
    setIsSidebarHidden,
    setIsBoardMenuVisible,
    setBoards,
    setBoardToRender,
  } = useKanbanTaskManagerContext();

  const handleHideSidebarClick = () => {
    setIsSidebarHidden((prevIsSidebarHidden) => !prevIsSidebarHidden);
  };
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      console.log('Logged user:', user?.email);
    }
  }, [user]);

  const handleSignOut = () => {
    if (user) {
      setIsBoardMenuVisible(false);
      setBoardToRender(null);
      console.log(`${user?.email} has been logged out`);
    }
    router.push('/');
  };

  return (
    <section className=" flex flex-col justify-between flex-1 pb-4 border-gray2 dark:border-gray4 dark:bg-gray5 ">
      <BoardList />
      <div className="flex flex-col">
        <ThemeSwitcher />

        <Button
          onClick={handleSignOut}
          className="flex flex-row ml-2 pl-3 items-center font-bold text-gray3 text-sm gap-2 w-fit "
        >
          <UserIcon className="size-6" />
          Sign Up / Sign In
        </Button>
      </div>
    </section>
  );
}
