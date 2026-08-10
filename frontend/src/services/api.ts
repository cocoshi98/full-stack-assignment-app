import type {
  Developer,
  Skill,
  Task,
  TaskStatus,
} from "../types";

const API_BASE_URL = "http://localhost:3000/api";

export interface CreateTaskInput {
  title: string;
  skillIds: number[];
  parentTaskId?: number;
}

export async function createTask(
  input: CreateTaskInput
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ?? "Failed to create task"
    );
  }

  return response.json();
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function getDevelopers(): Promise<Developer[]> {
  const response = await fetch(`${API_BASE_URL}/developers`);

  if (!response.ok) {
    throw new Error("Failed to fetch developers");
  }

  return response.json();
}

export async function getSkills(): Promise<Skill[]> {
  const response = await fetch(`${API_BASE_URL}/skills`);

  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }

  return response.json();
}

export interface UpdateTaskInput {
  developerId?: number | null;
  status?: TaskStatus;
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ?? "Failed to update task"
    );
  }

  return response.json();
}