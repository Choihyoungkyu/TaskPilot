'use client';

import { useState } from 'react';
import { updateTask, deleteTask } from '@/lib/api';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  priorityScore: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  onUpdate: () => void;
}

export default function TaskCard({
  id,
  title,
  description,
  dueDate,
  difficulty,
  priorityScore,
  status,
  onUpdate,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask(id, { status: newStatus as any });
      onUpdate();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('이 작업을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deleteTask(id);
      onUpdate();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setIsDeleting(false);
    }
  };

  const dueDateTime = new Date(dueDate);
  const formattedDate = dueDateTime.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  const difficultyLabel = {
    EASY: '쉬움',
    MEDIUM: '중간',
    HARD: '어려움',
  }[difficulty];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-4 text-gray-400 hover:text-red-600 disabled:opacity-50"
        >
          ✕
        </button>
      </div>

      <div className="mb-3 flex items-center gap-4">
        <PriorityBadge score={priorityScore} />
        <span className="text-sm text-gray-600">{difficultyLabel}</span>
        <span className="text-sm text-gray-600">{formattedDate}</span>
      </div>

      <div className="flex gap-2">
        {['TODO', 'IN_PROGRESS', 'COMPLETED'].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
              status === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s === 'TODO' && '할 일'}
            {s === 'IN_PROGRESS' && '진행 중'}
            {s === 'COMPLETED' && '완료'}
          </button>
        ))}
      </div>
    </div>
  );
}
