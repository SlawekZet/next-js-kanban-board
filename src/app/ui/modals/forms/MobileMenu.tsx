'use client';
import { useKanbanTaskManagerContext } from '@/app/lib/contexts/KanbanTaskManagerContext';
import { auth } from '@/app/lib/firebase/config';
import { UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BoardList } from '../../boards/BoardList';
import { ThemeSwitcher } from '../../dashboard/ThemeSwitcher';
import { Button } from '../../utils/buttons/Button';

export default function MobileMenu() {
  const { setIsBoardMenuVisible, setBoardToRender } =
    useKanbanTaskManagerContext();

  const router = useRouter();
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
    <section className=" flex flex-col justify-between flex-1 pb-4 border-gray2 dark:border-gray4 dark:bg-gray5">
      <BoardList />
      <div className="flex flex-col gap-4 w-full">
        <ThemeSwitcher />

        <Button
          onClick={handleSignOut}
          className="flex flex-row items-center mx-4 font-bold text-gray3 text-sm gap-2 justify-center "
        >
          <UserIcon className="size-6" />
          Sign Up / Sign In
        </Button>
      </div>
    </section>
  );
}
