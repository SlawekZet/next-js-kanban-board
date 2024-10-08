'use client';
import { auth } from '@/app/lib/firebase/config';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import { Button } from './ui/utils/buttons/Button';
import { ErrorComponent } from './ui/utils/ErrorComponent';
import { SignUpForm } from './ui/utils/forms/SignUpForm';
import { SignInForm } from './ui/utils/forms/SingInForm';
import { SplashScreen } from './ui/utils/SplashScreen';

export default function Home() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [signup, setSignup] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, loggedInUser, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signup) {
      try {
        const res = await createUserWithEmailAndPassword(email, password);

        if (!res || !res.user || !res.user.uid) {
          throw new Error('User creation failed. UID is undefined.');
        }
        const uid = res.user.uid;

        const response = await fetch('/api/create-dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
          }),
        });

        if (response.ok) {
          console.log('User created and data successfully written!');
          setEmail('');
          setPassword('');
          router.refresh();
          router.push('/dashboard');
        } else {
          const errorData = await response.json();
          console.error('Error writing data:', errorData.error);
        }
      } catch (error) {
        console.error('An error has occured:', error);
      }
    } else {
      try {
        const res = await signInWithEmailAndPassword(email, password);
        if (res?.user.email) {
          setEmail('');
          setPassword('');
          router.push('/dashboard');
        } else {
          throw new Error('Sign in failed.');
        }
      } catch (error) {
        console.error('An error has occured:', error);
      }
    }
  };

  const handleSignInToggle = () => {
    signup ? setSignup(false) : null;
  };

  const handleSignupToggle = () => {
    signup ? null : setSignup(true);
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen mob:w-screen">
      <div className="flex flex-col mob:w-full w-[450px] mob:bg-white bg-gray1 dark:bg-gray4 items-center text-center gap-4 p-8 rounded-xl mob:shadow-none shadow-lg">
        {resolvedTheme === 'dark' ? (
          <Image
            width={200}
            height={85}
            src="/logo-light.svg"
            alt="kanban task manager logotype"
            className="p-6 border-r-[1px] mob:border-white border-gray2 dark:border-gray4"
          />
        ) : (
          <Image
            width={200}
            height={85}
            src="/logo-dark.svg"
            alt="kanban task manager logotype"
            className="p-6 border-r-[1px] mob:border-white border-gray2 dark:border-gray4"
          />
        )}

        <h2 className="text-3xl font-bold mb-6 text-center">
          <Button
            onClick={handleSignupToggle}
            className={`${signup ? 'underline' : null} hover:text-violet2`}
          >
            Sign Up
          </Button>
          /
          <Button
            onClick={handleSignInToggle}
            className={`${!signup ? 'underline' : null} hover:text-violet2`}
          >
            Sign In
          </Button>
        </h2>
        {signup ? (
          <SignUpForm
            password={password}
            email={email}
            setPassword={setPassword}
            setEmail={setEmail}
            handleSubmit={handleSubmit}
          />
        ) : (
          <SignInForm
            password={password}
            email={email}
            setPassword={setPassword}
            setEmail={setEmail}
            handleSubmit={handleSubmit}
            error={error?.message}
          />
        )}

        <ErrorBoundary fallback={<ErrorComponent />}>
          <Suspense fallback={<SplashScreen />}>
            <Link
              href="/demo"
              className="text-sm text-gray5 dark:text-gray3 px-4 py-2 rounded-lg text-center"
            >
              Demo
            </Link>
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}
