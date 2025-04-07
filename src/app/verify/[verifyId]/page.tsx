'use client';

import { FaRegSmileBeam } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/buttons/Button';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ActivationPage() {
  const router = useRouter();
  const { verifyId } = useParams();
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const getVerify = async () => {
      try {
        const response = await api.post(`/api/auth/verify/${verifyId}`);
        if (response.status === 200) {
          setValid(true);
        } else {
          setValid(false);
        }
      } catch (err) {
        setValid(false);
      }
    };

    getVerify();
  }, [verifyId]);

  if (valid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-200 text-primary-800">
        <p className="text-lg font-medium">Checking activation link...</p>
      </div>
    );
  }

  if (valid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">404 - Not Found</h1>
          <p className="text-base text-gray-600">Sorry, this activation link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-200 text-primary-800 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-[80px] text-primary-600 mb-4 flex justify-center">
          <FaRegSmileBeam />
        </div>

        <h1 className="text-2xl font-bold mb-2">Your account has been activated!</h1>
        <p className="text-base text-primary-600 mb-6">
          Welcome aboard! Your account is now ready to use. You can sign in to get started.
        </p>

        <Button
          onClick={() => router.push('/login')}
          className="w-full bg-primary text-white hover:bg-primary-600 font-medium py-2 rounded-xl"
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
}
