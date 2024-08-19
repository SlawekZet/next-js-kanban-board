'use client';

import { SunIcon, MoonIcon } from '@heroicons/react/20/solid';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleThemeChange = () => {
    if (isMounted) {
      if (resolvedTheme === 'dark') {
        return setTheme('light');
      }
      if (resolvedTheme === 'light') {
        return setTheme('dark');
      }
    }
  };
  return (
    <div className="py-3 bg-gray1 dark:bg-gray6 rounded-lg flex flex-row justify-center mx-4 wfull">
      <label className="inline-flex items-center cursor-pointer">
        <div className="px-4">
          <SunIcon className="size-6 fill-gray3" />
        </div>
        <input
          id="themeToggle"
          type="checkbox"
          value=""
          className="sr-only peer"
          onChange={handleThemeChange}
          defaultChecked={resolvedTheme === 'dark' ? true : false}
        />
        <div className="relative w-11 h-6 bg-violet2 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-violet2 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-violet2 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <div className="px-4">
          <MoonIcon className="size-6 fill-gray3" />
        </div>
      </label>
    </div>
  );
};
