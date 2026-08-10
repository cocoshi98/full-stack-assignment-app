import { useEffect, useState } from "react";

import TaskRow from "../components/TaskRow";
import {
  getDevelopers,
  getTasks,
  updateTask,
} from "../services/api";
import type {
  Developer,
  Task,
  TaskStatus,
} from "../types";

function buildTaskTree(tasks: Task[]): Task[] {
  const taskMap = new Map<number, Task>();

  for (const task of tasks) {
    taskMap.set(task.id, {
      ...task,
      subtasks: [],
    });
  }

  const rootTasks: Task[] = [];

  for (const task of taskMap.values()) {
    if (task.parentTaskId === null) {
      rootTasks.push(task);
      continue;
    }

    const parentTask = taskMap.get(task.parentTaskId);

    if (parentTask) {
      parentTask.subtasks.push(task);
    }
  }

  return rootTasks;
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [taskData, developerData] = await Promise.all([
          getTasks(),
          getDevelopers(),
        ]);

        setTasks(buildTaskTree(taskData));
        setDevelopers(developerData);
      } catch {
        setError("Failed to load task data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleTaskUpdate(
    taskId: number,
    updates: {
      developerId?: number | null;
      status?: TaskStatus;
    }
  ) {
    try {
      await updateTask(taskId, updates);

      const taskData = await getTasks();

      setTasks(buildTaskTree(taskData));
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task"
      );
    }
  }

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <main>
      <h1>Tasks</h1>

      {error && <p>{error}</p>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Skills</th>
              <th>Status</th>
              <th>Developer</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                developers={developers}
                onUpdate={handleTaskUpdate}
              />
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}