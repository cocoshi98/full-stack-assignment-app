export interface Skill {
  id: number;
  name: string;
}

export interface Developer {
  id: number;
  name: string;
  skills?: Skill[];
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  developerId: number | null;
  parentTaskId: number | null;
  developer: Developer | null;
  skills: Skill[];
  subtasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormNodeData {
  id: string;
  title: string;
  skillIds: number[];
  subtasks: TaskFormNodeData[];
}