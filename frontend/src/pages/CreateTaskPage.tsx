import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TaskFormNode from "../components/TaskFormNode";
import {
  createTask,
  getSkills,
} from "../services/api";
import type {
  Skill,
  TaskFormNodeData,
} from "../types";

import "./CreateTaskPage.css";

const initialTask: TaskFormNodeData = {
  id: crypto.randomUUID(),
  title: "",
  skillIds: [],
  subtasks: [],
};

export default function CreateTaskPage() {
  const navigate = useNavigate();

  const [task, setTask] =
    useState<TaskFormNodeData>(initialTask);

  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [loadingSkills, setLoadingSkills] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch {
        setError("Failed to load skills");
      } finally {
        setLoadingSkills(false);
      }
    }

    loadSkills();
  }, []);

  function hasEmptyTitle(
    node: TaskFormNodeData
  ): boolean {
    if (node.title.trim().length === 0) {
      return true;
    }

    return node.subtasks.some(hasEmptyTitle);
  }

  async function createTaskTree(
    node: TaskFormNodeData,
    parentTaskId?: number
  ) {
    const createdTask = await createTask({
      title: node.title.trim(),
      skillIds: node.skillIds,
      parentTaskId,
    });

    for (const subtask of node.subtasks) {
      await createTaskTree(
        subtask,
        createdTask.id
      );
    }

    return createdTask;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (hasEmptyTitle(task)) {
      setError(
        "Every task and subtask must have a title"
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createTaskTree(task);

      navigate("/tasks");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create task"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingSkills) {
    return <p>Loading skills...</p>;
  }

  return (
    <main className="create-task-page">
        <header className="create-task-header">
            <h1>Create Task</h1>

            <p className="create-task-description">
            Create a task and optionally add nested subtasks.
            </p>
        </header>

        {error && (
            <div className="create-task-error">
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
            <TaskFormNode
            node={task}
            skills={skills}
            onChange={setTask}
            />

            <div className="create-task-submit">
            <button
                type="submit"
                disabled={submitting}
            >
                {submitting
                ? "Creating..."
                : "Create Task"}
            </button>
            </div>
        </form>
    </main>
  );
}