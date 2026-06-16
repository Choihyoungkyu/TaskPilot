const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body.message) {
        errorMessage = body.message;
      }
    } catch {
      // response body가 JSON이 아니면 무시
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function kakaoLogin(code: string) {
  const response = await fetch(`${API_BASE_URL}/auth/kakao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  return handleResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: getAuthHeader(),
  });

  return handleResponse(response);
}

export async function getTasks(status?: string) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const response = await fetch(`${API_BASE_URL}/tasks?${params}`, {
    headers: getAuthHeader(),
  });

  return handleResponse(response);
}

export async function getTaskById(id: number) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: getAuthHeader(),
  });

  return handleResponse(response);
}

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate: string;
  estimatedDurationMinutes: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    dueDate?: string;
    estimatedDurationMinutes?: number;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  }
) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function deleteTask(id: number) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}

export async function getWeeklyTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks/weekly`, {
    headers: getAuthHeader(),
  });

  return handleResponse(response);
}

export async function updateUserPreferences(data: {
  notificationLeadTimeMinutes?: number;
  preferredDifficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  timezone?: string;
}) {
  const user = (await getCurrentUser()) as { id: number };
  const response = await fetch(`${API_BASE_URL}/users/${user.id}/preferences`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}
