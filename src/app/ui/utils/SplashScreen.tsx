import { useTheme } from 'next-themes';
import Image from 'next/image';
export const SplashScreen = () => {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen focus:outline-gray1">
        <div className="flex flex-col w-[250px] bg-gray1 dark:bg-gray4 items-center text-center gap-4 p-8 rounded-xl shadow-lg focus:outline-none">
          <div className="pb-4">
            <svg
              className="animate-spin h-16 w-16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="#635FC7"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="#3E3F4E"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          {resolvedTheme === 'dark' ? (
            <Image
              width={200}
              height={85}
              src="/logo-light.svg"
              alt="kanban task manager logotype"
              className="p-6 border-r-[1px] border-gray1 dark:border-gray4"
            />
          ) : (
            <Image
              width={200}
              height={85}
              src="/logo-dark.svg"
              alt="kanban task manager logotype"
              className="p-6 border-r-[1px] border-gray1 dark:border-gray4"
            />
          )}
        </div>
      </div>
    </>
  );
};
