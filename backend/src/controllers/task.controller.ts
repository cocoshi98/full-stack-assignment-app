import type { Request, Response } from "express";

import { 
    createTask,
    getAllTasks, 
    getTaskById,
    updateTask,
} from "../services/task.service.js";

export async function createTaskHandler(req: Request, res: Response) {
  try {
    const { title, skillIds, parentTaskId } = req.body;

    if (typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({
        error: "Title is required",
      });
      return;
    }

    if (
      !Array.isArray(skillIds) ||
      !skillIds.every(
        (id) => Number.isInteger(id) && id > 0
      )
    ) {
      res.status(400).json({
        error: "skillIds must be an array of valid skill IDs",
      });
      return;
    }

    if (
      parentTaskId !== undefined &&
      (!Number.isInteger(parentTaskId) || parentTaskId <= 0)
    ) {
      res.status(400).json({
        error: "parentTaskId must be a valid task ID",
      });
      return;
    }

    const task = await createTask({
      title: title.trim(),
      skillIds,
      parentTaskId,
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof Error) {
    if (error.message === "INVALID_SKILLS") {
      res.status(400).json({
        error: "One or more skill IDs do not exist",
      });
      return;
    }

    if (error.message === "PARENT_TASK_NOT_FOUND") {
      res.status(400).json({
        error: "Parent task does not exist",
      });
      return;
    }
  }

  console.error("Failed to create task:", error);

  res.status(500).json({
    error: "Failed to create task",
  });
  }
}

export async function updateTaskHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: "Invalid task ID",
      });
      return;
    }

    const { developerId, status } = req.body;

    if (
      developerId !== undefined &&
      developerId !== null &&
      (!Number.isInteger(developerId) || developerId <= 0)
    ) {
      res.status(400).json({
        error: "developerId must be a valid developer ID or null",
      });
      return;
    }

    const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];

    if (
      status !== undefined &&
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        error: "Invalid task status",
      });
      return;
    }

    if (developerId === undefined && status === undefined) {
      res.status(400).json({
        error: "At least one field must be provided",
      });
      return;
    }

    const task = await updateTask(id, {
      developerId,
      status,
    });

    res.json(task);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TASK_NOT_FOUND") {
        res.status(404).json({
          error: "Task not found",
        });
        return;
      }

      if (error.message === "DEVELOPER_NOT_FOUND") {
        res.status(400).json({
          error: "Developer does not exist",
        });
        return;
      }

      if (error.message === "DEVELOPER_MISSING_REQUIRED_SKILLS") {
        res.status(400).json({
          error: "Developer does not have all required skills",
        });
        return;
      }

      if (error.message === "SUBTASKS_NOT_DONE") {
        res.status(400).json({
          error: "Task cannot be completed while subtasks are incomplete",
        });
        return;
      }
    }

    console.error("Failed to update task:", error);

    res.status(500).json({
      error: "Failed to update task",
    });
  }
}

export async function listTasks(req: Request, res: Response) {
  try {
    const tasks = await getAllTasks();

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);

    res.status(500).json({
      error: "Failed to fetch tasks",
    });
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        error: "Invalid task ID",
      });
      return;
    }

    const task = await getTaskById(id);

    if (!task) {
      res.status(404).json({
        error: "Task not found",
      });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error("Failed to fetch task:", error);

    res.status(500).json({
      error: "Failed to fetch task",
    });
  }
}