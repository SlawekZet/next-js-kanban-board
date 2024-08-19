import { MouseEventHandler, ReactNode } from 'react';

interface ButtonSecondaryProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  className?: string;
}

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-gray1 hover:bg-gray2 h-10 px-8 py-2 text-sm flex justify-center items-center text-violet2 font-bold ${className}`}
    >
      {children}
    </button>
  );
};
