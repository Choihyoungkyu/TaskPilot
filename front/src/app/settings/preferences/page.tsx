'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { updateUserPreferences } from '@/lib/api';
import Navigation from '@/components/Navigation';

export default function PreferencesPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [preferences, setPreferences] = useState({
    notificationLeadTimeMinutes: 60,
    preferredDifficulty: 'MEDIUM',
    timezone: 'Asia/Seoul',
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [userLoading, user, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]:
        name === 'notificationLeadTimeMinutes' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateUserPreferences({
        notificationLeadTimeMinutes: preferences.notificationLeadTimeMinutes,
        preferredDifficulty: preferences.preferredDifficulty as 'EASY' | 'MEDIUM' | 'HARD',
        timezone: preferences.timezone,
      });
      setMessage({ type: 'success', text: '설정이 저장되었습니다.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text:
          err instanceof Error ? err.message : '설정 저장에 실패했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">설정</h1>

          {message && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              알림 및 선호도
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="notificationLeadTimeMinutes"
                  className="block text-sm font-medium text-gray-700"
                >
                  알림 리드타임 (분)
                </label>
                <input
                  type="number"
                  id="notificationLeadTimeMinutes"
                  name="notificationLeadTimeMinutes"
                  value={preferences.notificationLeadTimeMinutes}
                  onChange={handleChange}
                  min="0"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2"
                />
                <p className="mt-1 text-sm text-gray-500">
                  마감일 전에 알림을 받을 시간 (분)
                </p>
              </div>

              <div>
                <label
                  htmlFor="preferredDifficulty"
                  className="block text-sm font-medium text-gray-700"
                >
                  선호 난이도
                </label>
                <select
                  id="preferredDifficulty"
                  name="preferredDifficulty"
                  value={preferences.preferredDifficulty}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value="EASY">쉬움</option>
                  <option value="MEDIUM">중간</option>
                  <option value="HARD">어려움</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700"
                >
                  타임존
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={preferences.timezone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value="Asia/Seoul">한국 (Asia/Seoul)</option>
                  <option value="Asia/Tokyo">일본 (Asia/Tokyo)</option>
                  <option value="Asia/Shanghai">중국 (Asia/Shanghai)</option>
                  <option value="America/New_York">미국 동부 (America/New_York)</option>
                  <option value="America/Los_Angeles">미국 서부 (America/Los_Angeles)</option>
                  <option value="Europe/London">런던 (Europe/London)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? '저장 중...' : '저장'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
