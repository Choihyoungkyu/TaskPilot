import TaskCard from './TaskCard';

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

interface TaskListProps {
  tasks: Task[];
  onTasksChange: () => void;
}

export default function TaskList({ tasks, onTasksChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">작업이 없습니다.</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => b.priorityScore - a.priorityScore
  );

  return (
    <div className="grid gap-4">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          dueDate={task.dueDate}
          difficulty={task.difficulty}
          priorityScore={task.priorityScore}
          status={task.status}
          onUpdate={onTasksChange}
        />
      ))}
    </div>
  );
}
