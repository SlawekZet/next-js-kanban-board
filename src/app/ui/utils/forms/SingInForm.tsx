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
            className="block text-gray5 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 text-gray-900 rounded-lg"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray5 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 rounded-lg"
            placeholder="Type password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className=" text-red2 text-xs mt-2">
            {error === 'Firebase: Error (auth/invalid-credential).'
              ? 'Invalid credentials'
              : null}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            // type="submit"
            className="font-bold bg-gray2 dark:bg-gray5 px-4 py-2 rounded-lg w-[150px] text-center shadow-md"
          >
            Sign In
          </Button>
        </div>
      </form>
    </>
  );
};
