import { MouseEventHandler, ReactNode } from 'react';

interface ButtonPrimaryLProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  className?: string;
}

export const ButtonPrimaryL: React.FC<ButtonPrimaryLProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-violet2 hover:bg-violet1 h-12 px-8 py-4 flex items-center text-white font-bold ${className}`}
    >
      {children}
    </button>
  );
};
