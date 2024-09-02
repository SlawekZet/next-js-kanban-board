import { FormEvent } from 'react';
import { Button } from '../buttons/Button';

interface SignInFormProps {
  email: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  error: string | undefined;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  email,
  password,
  setPassword,
  setEmail,
  handleSubmit,
  error,
}) => {
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)} className="w-3/4 mb-2">
        <div className="mb-4">
          <label
            className="block text-gray5 dark:text-gray2 text-sm font-bold mb-2 mob:hidden"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 rounded-lg dark:bg-gray5 mob:border-gray3 mob:border-[1px]"
            value={email}
            placeholder="Type your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray5 dark:text-gray2 text-sm font-bold mb-2 mob:hidden"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 rounded-lg dark:bg-gray5 mob:border-gray3 mob:border-[1px]"
            value={password}
            placeholder="Type password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <Button
            // type="submit"
            className="font-bold mob:bg-gray1 mob:w-full bg-gray2 dark:bg-gray5 px-4 py-2 rounded-lg w-[150px] text-center shadow-md"
          >
            Sign In
          </Button>
        </div>
      </form>
    </>
  );
};
