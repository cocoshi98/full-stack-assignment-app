import type {
  Developer,
  Skill,
  Task,
} from "../types";

const API_BASE_URL = "http://localhost:3000/api";

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