import { MouseEventHandler, ReactNode } from 'react';

interface ButtonDestructiveProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  className?: string;
}

export const ButtonDestructive: React.FC<ButtonDestructiveProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-red2 hover:bg-red1 h-10 px-8 py-2 text-sm flex items-center text-white font-bold justify-center ${className}`}
    >
      {children}
    </button>
  );
};
