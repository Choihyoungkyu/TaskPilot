import useSWR, { SWRConfiguration } from 'swr';
import { getTasks, getTaskById } from '@/lib/api';

interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate: string;
  estimatedDurationMinutes: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  priorityScore: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => {
  if (url.includes('status=')) {
    const status = new URL(url, 'http://localhost').searchParams.get('status');
    return getTasks(status || undefined);
  }
  return getTasks();
};

export function useTasks(status?: string, options?: SWRConfiguration) {
  const key = status ? `tasks?status=${status}` : 'tasks';
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    key,
    async () => {
      const result = await getTasks(status);
      return result as Task[];
    },
    { revalidateOnFocus: false, ...options }
  );

  return {
    tasks: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useTask(id: number, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<Task>(
    `task/${id}`,
    async () => {
      const result = await getTaskById(id);
      return result as Task;
    },
    { revalidateOnFocus: false, ...options }
  );

  return {
    task: data,
    isLoading,
    error,
    mutate,
  };
}
