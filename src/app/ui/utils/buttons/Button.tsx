import { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
