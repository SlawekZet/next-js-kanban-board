import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { useRouter } from 'next/navigation';

export const ErrorComponent = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col w-[450px] bg-gray1 dark:bg-gray4 items-center text-center gap-4 p-8 rounded-xl shadow-lg">
          <ExclamationTriangleIcon className="size-20" />
          <p>
            Something went wrong. Please try again later or contact the
            Administrator
          </p>
          <div className="">
            Click{' '}
            <button
              className="text-violet2 underline font-bold hover:text-violet1"
              onClick={handleHomeClick}
            >
              here
            </button>{' '}
            to return to the homepage
          </div>
        </div>
      </div>
    </>
  );
};
