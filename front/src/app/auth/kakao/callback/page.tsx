'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { kakaoLogin } from '@/lib/api';

export default function KakaoCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('Authorization code not found');
      return;
    }

    const handleLogin = async () => {
      try {
        const response = await kakaoLogin(code) as { accessToken: string; user: { id: number } };
        localStorage.setItem('accessToken', response.accessToken);
        if (response.user?.id) {
          localStorage.setItem('userId', response.user.id.toString());
        }
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    };

    handleLogin();
  }, [searchParams, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {error ? (
        <>
          <p className="text-red-600">로그인 실패</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            다시 시도
          </button>
        </>
      ) : (
        <p className="text-gray-600">로그인 중...</p>
      )}
    </div>
  );
}
