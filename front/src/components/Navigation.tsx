'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export default function Navigation({ user }: NavigationProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/auth/login');
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-blue-600">TaskPilot</h1>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900"
            >
              대시보드
            </Link>
            <Link
              href="/settings/preferences"
              className="text-gray-700 hover:text-gray-900"
            >
              설정
            </Link>

            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
