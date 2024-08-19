import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const ErrorComponent = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex w-[450px] bg-gray1 dark:bg-gray4 items-center text-center gap-4 p-8 rounded-xl shadow-lg">
          <ExclamationTriangleIcon className="size-20" />
          <p>
            Something went wrong. Please try again later or contact the
            Administrator
          </p>
        </div>
      </div>
    </>
  );
};
