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

        setTasks(taskData);
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
      const updatedTask = await updateTask(taskId, updates);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task
        )
      );

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