import { MouseEventHandler, ReactNode } from 'react';

interface ButtonPrimarySProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  className?: string;
}

export const ButtonPrimaryS: React.FC<ButtonPrimarySProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-violet2 hover:bg-violet1 h-10 px-8 py-2 text-sm flex items-center justify-center text-white font-bold ${className}`}
    >
      {children}
    </button>
  );
};
