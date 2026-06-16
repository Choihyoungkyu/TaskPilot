'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '';
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || 'http://localhost:3000/auth/kakao/callback';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleDevLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token?userId=1`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('개발용 로그인 실패');
      }
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userId', data.userId);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          TaskPilot
        </h1>
        <p className="mb-8 text-center text-gray-600">
          AI 기반 우선순위 작업 관리
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleKakaoLogin}
          disabled={isLoading}
          className="w-full rounded-lg bg-yellow-300 py-3 font-semibold text-gray-900 hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          Kakao로 로그인
        </button>

        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-xs text-gray-500">개발용</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleDevLogin}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          {isLoading ? '로그인 중...' : '개발용 로그인'}
        </button>

        <p className="mt-6 text-center text-xs text-gray-500">
          TaskPilot은 Kakao OAuth를 통해 안전하게 로그인합니다.
          <br />
          개발용 로그인은 테스트 계정(test@example.com)으로 즉시 접근합니다.
        </p>
      </div>
    </div>
  );
}
