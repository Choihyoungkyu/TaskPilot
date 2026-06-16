'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import Navigation from '@/components/Navigation';
import TaskList from '@/components/TaskList';
import TaskModal from '@/components/TaskModal';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, isLoading: tasksLoading, mutate } = useTasks(selectedStatus);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, userLoading, router]);

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

  const statuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <>
      <Navigation user={user} />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">작업 목록</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              + 새 작업
            </button>
          </div>

          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setSelectedStatus(undefined)}
              className={`rounded-lg px-4 py-2 ${
                selectedStatus === undefined
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              전체
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-lg px-4 py-2 ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'TODO' && '할 일'}
                {status === 'IN_PROGRESS' && '진행 중'}
                {status === 'COMPLETED' && '완료'}
              </button>
            ))}
          </div>

          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">작업 로딩 중...</p>
            </div>
          ) : (
            <TaskList tasks={tasks} onTasksChange={mutate} />
          )}
        </div>
      </main>

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            mutate();
          }}
        />
      )}
    </>
  );
}
